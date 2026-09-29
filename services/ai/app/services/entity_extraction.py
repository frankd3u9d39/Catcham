from typing import List
from app.schemas.analysis import EntityItem

class EntityExtractionService:
    @staticmethod
    async def extract(text: str) -> List[EntityItem]:
        # NER model targeting Nigerian agencies, dates, amounts
        return []
