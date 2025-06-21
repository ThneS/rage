from pydantic import BaseModel
from typing import Dict, Any

class GenerateRequest(BaseModel):
    config: Dict[str, Any]
    # The 'parse' result from the previous step might be needed here
    # For now, we'll just use the config

class GenerateResult(BaseModel):
    text: str
