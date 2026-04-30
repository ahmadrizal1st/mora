from services.document_service import DocumentService
from engines.pymupdf_engine import PyMuPDFEngine
from services.image_service import ImageService
from services.pdf_service import PDFService
from engines.whisper_engine import whisper_engine

class DetectorService:
    @staticmethod
    def process_file(file_path: str, mime_type: str, langs: list = None) -> dict:
        """
        Routes the file to the appropriate extraction engine based on MIME type.
        """
        # 1. Audio formats (Transcription)
        audio_mimes = [
            "audio/mpeg", "audio/wav", "audio/x-m4a", "audio/ogg",
            "audio/webm", "audio/webm;codecs=opus", "audio/mp4",  # browser MediaRecorder
            "video/webm", "video/mp4",  # libmagic may misdetect audio blobs as video
        ]
        if mime_type in audio_mimes or mime_type.startswith("audio/"):
            lang = langs[0] if langs else None
            result = whisper_engine.extract(file_path, lang=lang)
            return {
                "text": result["text"],
                "type": "audio_transcription",
                "engine_used": result["engine"],
                "confidence": result["confidence"],
                "pages": 1
            }

        # 2. Image formats (direct OCR)
        if mime_type.startswith("image/"):
            result = ImageService.process_image(file_path, langs)
            return {
                "text": result["text"],
                "type": "image_ocr",
                "engine_used": result["engine"],
                "confidence": result["confidence"],
                "pages": 1
            }

        # 2. Document formats (Non-OCR)
        doc_mimes = [
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain",
            "text/csv",
            "application/rtf",
            "text/rtf"
        ]
        
        if mime_type in doc_mimes:
            text, engine = DocumentService.extract_text(file_path, mime_type)
            return {
                "text": text,
                "type": "document",
                "engine_used": engine,
                "confidence": 1.0 if text.strip() else 0.0,
                "pages": 1
            }
            
        # 3. PDF formats (Smart Routing: Selectable vs Scanned)
        elif mime_type == "application/pdf":
            # First try extracting selectable text
            result = PyMuPDFEngine.extract_text(file_path)
            
            # If no selectable text found (pdf_scanned), route to PDF OCR Service
            if result["type"] == "pdf_scanned":
                ocr_result = PDFService.process_scanned_pdf(file_path, langs)
                return {
                    "text": ocr_result["text"],
                    "type": "pdf_ocr",
                    "engine_used": ocr_result.get("engine_used", "surya-ocr"),
                    "confidence": ocr_result["confidence"],
                    "pages": ocr_result["pages"]
                }
                
            return {
                "text": result["text"],
                "type": "pdf_text",
                "engine_used": "pymupdf",
                "confidence": result["confidence"],
                "pages": result["pages"]
            }
            
        # Fallback
        return {
            "text": "",
            "type": "unsupported",
            "engine_used": "none",
            "confidence": 0.0,
            "pages": 0
        }
