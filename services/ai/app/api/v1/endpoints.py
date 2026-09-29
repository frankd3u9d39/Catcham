from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.services.ocr import OcrService
from app.services.transcription import TranscriptionService
from app.services.entity_extraction import EntityExtractionService
from app.core.config import settings

api_router = APIRouter()
api_key_header = APIKeyHeader(name="X-AI-API-KEY", auto_error=False)

def verify_api_key(key: str = Security(api_key_header)):
    if not key or key != settings.AI_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized AI service access")
    return key

@api_router.post("/analyze/ocr", response_model=AnalysisResponse, dependencies=[Depends(verify_api_key)])
async def process_ocr(request: AnalysisRequest):
    result = await OcrService.extract_text(request.evidence_url)
    return AnalysisResponse(
        evidence_id=request.evidence_id,
        analysis_type="OCR",
        extracted_text=result,
        confidence=0.95,
        entities=[]
    )

@api_router.post("/analyze/transcribe", response_model=AnalysisResponse, dependencies=[Depends(verify_api_key)])
async def process_audio(request: AnalysisRequest):
    result = await TranscriptionService.transcribe(request.evidence_url)
    return AnalysisResponse(
        evidence_id=request.evidence_id,
        analysis_type="TRANSCRIPTION",
        extracted_text=result,
        confidence=0.92,
        entities=[]
    )

@api_router.post("/analyze/entities", response_model=AnalysisResponse, dependencies=[Depends(verify_api_key)])
async def process_entities(request: AnalysisRequest):
    entities = await EntityExtractionService.extract(request.text_content or "")
    return AnalysisResponse(
        evidence_id=request.evidence_id,
        analysis_type="NER",
        extracted_text="",
        confidence=0.90,
        entities=entities
    )
