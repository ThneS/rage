from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.chunk import ChunkService
from app.schemas.response import ResponseModel
from app.schemas.common_config import ConfigParams
from app.schemas.chunk import LangChainChunk
from typing import List

router = APIRouter()

@router.get("/{document_id}/chunk-config", response_model=ResponseModel[ConfigParams])
def get_chunk_config(document_id: int, db: Session = Depends(get_db)):
    """获取指定文档的分块参数配置"""
    service = ChunkService(db)
    config = service.get_chunk_config(document_id)
    if not config:
        raise HTTPException(status_code=404, detail="未找到分块配置")
    return ResponseModel[ConfigParams](data=config)

@router.post("/{document_id}/parse", response_model=ResponseModel[List[LangChainChunk]])
def parse_chunk(
    document_id: int,
    config: ConfigParams = Body(..., description="加载配置参数"),
    db: Session = Depends(get_db)):
    """分块处理"""
    service = ChunkService(db)
    result = service.parse_chunk(document_id, config)
    return ResponseModel[List[LangChainChunk]](data=result)