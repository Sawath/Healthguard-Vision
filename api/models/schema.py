from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Literal
from datetime import datetime

Level = Literal["low", "medium", "high"]

class ConditionResult(BaseModel):
    condition: str
    score: float = Field(ge=0, le=1)
    level: Level
    recommendations: List[str]

class AnalyzeResponse(BaseModel):
    # ✅ désactive la protection "model_"
    model_config = ConfigDict(protected_namespaces=())

    analysis_id: str
    patient_id: str
    created_at: datetime
    model_versions: Dict[str, str]
    results: List[ConditionResult]
    disclaimer: str
