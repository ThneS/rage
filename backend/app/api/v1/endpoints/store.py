from fastapi import APIRouter, Depends, HTTPException, Body, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.store import StoreService
from app.schemas.response import ResponseModel
from app.schemas.common_config import ConfigParams
from app.schemas.store import LangChainStore
from typing import List

router = APIRouter()

@router.get("/{document_id}/store-config", response_model=ResponseModel[ConfigParams])
def get_store_config(document_id: int, db: Session = Depends(get_db)):
    """获取指定文档的存储参数配置"""
    service = StoreService(db)
    config = service.get_store_config(document_id)
    if not config:
        raise HTTPException(status_code=404, detail="未找到存储配置")
    return ResponseModel[ConfigParams](data=config)

@router.post("/{document_id}/store", response_model=ResponseModel[List[LangChainStore]])
def store(
    document_id: int,
    config: ConfigParams = Body(..., description="加载配置参数"),
    db: Session = Depends(get_db)):
    """存储处理"""
    service = StoreService(db)
    result = service.do_store(document_id, config)
    return ResponseModel[List[LangChainStore]](data=result)

@router.get("/{document_id}/search", response_model=ResponseModel[str])
def search(
    document_id: int,
    query: str = Query(..., description="查询参数"),
    db: Session = Depends(get_db)):
    """搜索"""
    service = StoreService(db)
    result = service.do_search(document_id, query)
    return ResponseModel[str](data=result)
