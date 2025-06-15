from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.chunk import ChunkService
from app.schemas.response import ResponseModel
from app.schemas.common_config import ConfigParams

router = APIRouter()

@router.get("/{document_id}/chunk-config", response_model=ResponseModel[ConfigParams])
def get_chunk_config(document_id: int, db: Session = Depends(get_db)):
    """获取指定文档的分块参数配置"""
    service = ChunkService(db)
    config = service.get_chunk_config(document_id)
    if not config:
        raise HTTPException(status_code=404, detail="未找到分块配置")
    return ResponseModel[ConfigParams](data=config)