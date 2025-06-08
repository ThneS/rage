from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.document import (
    Document,
    DocumentChunk,
    DocumentProcessingConfig,
    ProcessingLog
)
from app.services.document_service import DocumentService

router = APIRouter()


@router.post("/upload", response_model=Document)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """上传文档"""
    service = DocumentService(db)
    return await service.create_document(file)


@router.post("/{document_id}/process", response_model=Document)
def process_document(
    document_id: int,
    config: DocumentProcessingConfig,
    db: Session = Depends(get_db)
):
    """处理文档（解析和分块）"""
    service = DocumentService(db)
    return service.process_document(document_id, config)


@router.get("/{document_id}", response_model=Document)
def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """获取文档信息"""
    service = DocumentService(db)
    return service.get_document(document_id)


@router.get("/{document_id}/chunks", response_model=List[DocumentChunk])
def get_document_chunks(
    document_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """获取文档分块"""
    service = DocumentService(db)
    return service.get_document_chunks(document_id, skip, limit)


@router.get("/{document_id}/logs", response_model=List[ProcessingLog])
def get_document_logs(
    document_id: int,
    db: Session = Depends(get_db)
):
    """获取文档处理日志"""
    service = DocumentService(db)
    document = service.get_document(document_id)
    return document.processing_logs