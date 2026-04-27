from pydantic import BaseModel
from typing import Optional

class ExtractRequest(BaseModel):
    language: Optional[str] = "en"
    engine_hint: Optional[str] = None
