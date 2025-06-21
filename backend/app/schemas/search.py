from pydantic import BaseModel
from typing import Dict, Any

class SearchQuery(BaseModel):
    query: str

class PreProcessRequest(BaseModel):
    query: str
    config: Dict[str, Any]

class PostProcessRequest(BaseModel):
    content: str
    config: Dict[str, Any]

class PreProcessResult(BaseModel):
    content: str

class PostProcessResult(BaseModel):
    content: str

class ParseResult(BaseModel):
    data: Dict[str, Any]
