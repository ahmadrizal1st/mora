from pydantic import BaseModel
from typing import Optional, Any, Dict

class ExtractResponse(BaseModel):
    text: str
    type: str
    engine_used: str
    language: Optional[str] = None
    confidence: float
    pages: int
    processing_time_ms: float
    file_info: Dict[str, Any]
