from sqlalchemy.orm import Session
from app.models.document import Document
from app.schemas.chunk import ChunkConfigResponse, Chunk, ChunkResult
from app.configuration.chunk import get_chunk_config
from typing import Dict, Any
from fastapi import HTTPException

class ChunkService:
    def __init__(self, db: Session):
        self.db = db

    def get_chunk_config(self, document_id: int) -> ChunkConfigResponse:
        # 1. 获取文档对象，校验是否存在
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="文档不存在")
        # 2. 获取分块参数配置
        config = get_chunk_config()
        return ChunkConfigResponse(fields=config.fields, default_config=config.default_config)

    def chunk_document(self, config: Dict[str, Any]) -> ChunkResult:
        # 1. 获取文档内容
        doc = self.db.query(Document).filter(Document.id == config["document_id"]).first()
        if not doc:
            raise Exception("文档不存在")
        # 2. 假设每页一段内容，简单模拟分块
        chunks = []
        for i in range(1, 5):
            chunks.append(Chunk(chunk_id=i, page=i, content=f"chunk content for page {i}"))
        meta_data = {"document": {"id": doc.id, "filename": doc.filename}}
        return ChunkResult(meta_data=meta_data, chunks=chunks)

    def get_chunk_result(self, document_id: int) -> ChunkResult:
        # 这里直接返回模拟数据，实际可查数据库
        return self.chunk_document({"document_id": document_id, "chunk_method": "fixed_token", "token_size": 500, "overlap": 0.1})