from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from app.schemas.common_config import ConfigField

class ChunkConfigResponse(BaseModel):
    fields: List[ConfigField]
    default_config: Dict[str, Any]

class ChunkConfig(BaseModel):
    document_id: int
    chunk_method: str
    token_size: int
    overlap: float

class Chunk(BaseModel):
    chunk_id: int
    page: int
    content: str

class ChunkResult(BaseModel):
    meta_data: Dict[str, Any]
    chunks: List[Chunk]