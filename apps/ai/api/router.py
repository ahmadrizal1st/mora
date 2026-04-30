import os
import uuid
import time
import magic
import psutil
from fastapi import APIRouter, Request, Response, UploadFile, File, Form, Depends, HTTPException, status
from typing import List
from api.dependencies import validate_api_key
from services.detector import DetectorService
from engines.surya_engine import surya_engine
from engines.whisper_engine import whisper_engine
from services.batch_service import batch_service
from utils.limiter import limiter

router = APIRouter()

SUPPORTED_MIME_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
    "application/rtf",
    "text/rtf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "audio/mpeg",
    "audio/wav",
    "audio/x-m4a",
    "audio/ogg",
    "audio/webm",           # Chrome / Firefox MediaRecorder default
    "audio/webm;codecs=opus",
    "audio/mp4",            # Safari MediaRecorder
    "video/webm",           # libmagic detects .webm audio blobs as video/webm
    "video/mp4",            # libmagic detects .mp4 audio blobs as video/mp4
]

MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
TEMP_DIR = "/tmp/ai"

@router.get("/health", tags=["System"])
def health_check(request: Request):
    uptime_seconds = time.time() - request.app.state.start_time
    
    # Check engine health
    engines = [surya_engine.get_status(), whisper_engine.get_status()]
    errors = [e["name"] for e in engines if e.get("status") == "error"]
    
    if errors:
        return {
            "status": "degraded",
            "message": f"Engine error: {', '.join(errors)}",
            "tier": "MVP",
            "version": request.app.version,
            "uptime_seconds": round(uptime_seconds, 2)
        }

    return {
        "status": "ok",
        "tier": "MVP",
        "version": request.app.version,
        "uptime_seconds": round(uptime_seconds, 2)
    }

@router.get("/engines", dependencies=[Depends(validate_api_key)], tags=["System"])
@limiter.limit("60/minute")
def get_engines_status(request: Request):
    vm = psutil.virtual_memory()
    
    return {
        "engines": [
            surya_engine.get_status(),
            whisper_engine.get_status()
        ],
        "system": {
            "ram_used_gb": round(vm.used / (1024**3), 2),
            "ram_total_gb": round(vm.total / (1024**3), 2),
            "cpu_percent": psutil.cpu_percent(interval=None)
        }
    }

@router.post("/extract", 
             dependencies=[Depends(validate_api_key)],
             tags=["Extraction"])
@limiter.limit("60/minute")
async def extract_file(
    request: Request,
    response: Response,
    file: UploadFile = File(...),
    language: str = Form("en"),
    engine_hint: str = Form(None)
):
    return await _process_single_file(request, response, file, language, engine_hint)

@router.post("/extract/batch",
             dependencies=[Depends(validate_api_key)],
             tags=["Extraction"])
@limiter.limit("10/minute")
async def extract_batch(
    request: Request,
    response: Response,
    files: List[UploadFile] = File(...),
    language: str = Form("en"),
    engine_hint: str = Form(None)
):
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 files per batch")
    
    batch_id = batch_service.create_batch(total_files=len(files))
    
    for file in files:
        try:
            res = await _process_single_file(request, response, file, language, engine_hint)
            batch_service.add_result(batch_id, {"filename": file.filename, "success": True, "data": res})
        except Exception as e:
            batch_service.add_result(batch_id, {"filename": file.filename, "success": False, "error": str(e)})
            
    return batch_service.get_batch(batch_id)

@router.get("/extract/batch/{batch_id}",
            dependencies=[Depends(validate_api_key)],
            tags=["Extraction"])
def get_batch_result(batch_id: str):
    batch = batch_service.get_batch(batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch

@router.delete("/extract/batch/{batch_id}",
               dependencies=[Depends(validate_api_key)],
               tags=["Extraction"])
def cancel_batch(batch_id: str):
    if batch_service.delete_batch(batch_id):
        return {"success": True, "message": "Batch deleted/cancelled"}
    raise HTTPException(status_code=404, detail="Batch not found")

async def _process_single_file(
    request: Request,
    response: Response,
    file: UploadFile,
    language: str,
    engine_hint: str
):
    start_time = time.time()
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Get file size using underlying file object as Starlette's async seek() only takes 1 argument
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size == 0:
        raise HTTPException(status_code=400, detail="File is empty")
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large (max 100MB)")
    
    file.file.seek(0)
    head = file.file.read(2048)
    mime_type = magic.from_buffer(head, mime=True)
    file.file.seek(0)
    
    # Fallback to extension-based detection if libmagic fails or misdetects
    # browser audio blobs (.webm / .ogg recorded by MediaRecorder)
    AUDIO_EXTENSIONS = {'.webm', '.ogg', '.mp3', '.wav', '.m4a', '.mp4', '.aac', '.flac'}
    file_ext = os.path.splitext(file.filename)[1].lower()

    if mime_type == "application/octet-stream" or (
        mime_type.startswith("video/") and file_ext in AUDIO_EXTENSIONS
    ):
        import mimetypes
        ext_mime, _ = mimetypes.guess_type(file.filename)
        if ext_mime:
            mime_type = ext_mime
        elif file_ext in AUDIO_EXTENSIONS:
            # Last resort: treat as audio/webm so ffmpeg can handle it
            mime_type = "audio/webm"

    if mime_type not in SUPPORTED_MIME_TYPES:
        raise HTTPException(status_code=415, detail=f"Unsupported file type: {mime_type}")
    
    os.makedirs(TEMP_DIR, exist_ok=True)
    extension = os.path.splitext(file.filename)[1]
    file_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}{extension}")
    
    try:
        with open(file_path, "wb") as f:
            # Using synchronous read/write for the underlying file to be safe
            while content := file.file.read(1024 * 1024):
                f.write(content)
        
        result = DetectorService.process_file(file_path, mime_type, langs=[language])
        processing_time_ms = (time.time() - start_time) * 1000
        
        response.headers["X-Processing-Time"] = f"{processing_time_ms:.2f}"
        response.headers["X-Engine-Used"] = result["engine_used"]
        response.headers["X-Confidence"] = str(result["confidence"])
        response.headers["X-Request-ID"] = request_id
        
        return {
            "text": result["text"],
            "type": result["type"],
            "engine_used": result["engine_used"],
            "language": language,
            "confidence": result["confidence"],
            "pages": result["pages"],
            "processing_time_ms": round(processing_time_ms, 2),
            "file_info": {
                "filename": file.filename,
                "size": file_size,
                "mime_type": mime_type
            }
        }
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
        
    finally:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass
