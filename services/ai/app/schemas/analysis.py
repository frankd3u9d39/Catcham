from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class AnalysisRequest(BaseModel):
    evidence_id: str
    evidence_url: Optional[str] = None
    text_content: Optional[str] = None
    media_type: str

class EntityItem(BaseModel):
    category: str
    text: str
    start: int
    end: int

class AnalysisResponse(BaseModel):
    evidence_id: str
    analysis_type: str
    extracted_text: str
    confidence: float
    entities: List[EntityItem] = []
    metadata: Dict[str, Any] = {}
