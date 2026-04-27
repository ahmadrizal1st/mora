import time
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from api.router import router
from utils.limiter import limiter

app = FastAPI(
    title="OCR Service API",
    description="FastAPI Service for Document Extraction and OCR",
    version="1.0.0"
)

# Setup slowapi limiter
app.state.limiter = limiter

# Error code mapping
ERROR_MAP = {
    400: "invalid_request",
    401: "unauthorized",
    403: "unauthorized",
    413: "file_too_large",
    415: "unsupported_format",
    422: "extraction_failed",
    429: "rate_limit_exceeded",
    500: "internal_error",
    503: "engine_unavailable"
}

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handles standard HTTP exceptions with uniform JSON format."""
    error_code = ERROR_MAP.get(exc.status_code, "internal_error")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": error_code,
            "message": str(exc.detail)
        }
    )

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """Handles rate limit exceeded errors."""
    return JSONResponse(
        status_code=429,
        content={
            "success": False,
            "error": "rate_limit_exceeded",
            "message": "Rate limit exceeded. Please try again later."
        },
        headers={"Retry-After": str(exc.detail) if hasattr(exc, 'detail') else "60"}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Allow Starlette/FastAPI HTTPExceptions to pass through with their original status code
    from fastapi import HTTPException as FastAPIHTTPException
    from starlette.exceptions import HTTPException as StarletteHTTPException
    
    if isinstance(exc, (FastAPIHTTPException, StarletteHTTPException)):
        raise exc
        
    print(f"GLOBAL ERROR: {str(exc)}") # For server logs
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "internal_error",
            "message": str(exc)
        }
    )

# Track application start time for uptime calculation
app.state.start_time = time.time()

# Include main API router
app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to OCR Service API"}
