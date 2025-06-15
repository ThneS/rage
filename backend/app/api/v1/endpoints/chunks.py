from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.chunk import ChunkConfigResponse
from app.services.chunk import ChunkService
from app.schemas.response import ResponseModel

router = APIRouter()

@router.get("/{document_id}/chunk-config", response_model=ResponseModel[ChunkConfigResponse])
def get_chunk_config(document_id: int, db: Session = Depends(get_db)):
    """获取指定文档的分块参数配置"""
    config = ChunkService(db).get_chunk_config(document_id)
    if not config:
        raise HTTPException(status_code=404, detail="未找到分块配置")
    return ResponseModel[ChunkConfigResponse](data=config)