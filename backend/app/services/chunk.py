from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.chunk import Chunk
from app.schemas.chunk import ChunkResult
from app.schemas.common_config import ConfigParams
from app.schemas.configuration.chunk import get_default_config
from typing import Dict, Any
from fastapi import HTTPException

class ChunkService:
    def __init__(self, db: Session):
        self.db = db

    def get_chunk_config(self, document_id: int) -> ConfigParams:
        # 1. 获取文档对象，校验是否存在
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="文档不存在")

        # 2. 获取或创建 chunk
        chunk = self.db.query(Chunk).filter(Chunk.document_id == document_id).first()
        if not chunk:
            # 如果不存在 chunk，则创建新的 chunk 配置
            config:ConfigParams = get_default_config()
            chunk = Chunk(
                document_id=document_id,
                config=config.model_dump(),
                meta_data={
                    "document": {"id": document.id, "filename": document.filename}
                },
                result={},
                document=document
            )
            self.db.add(chunk)
            self.db.commit()
            self.db.refresh(chunk)

        # 3. 返回 chunk 配置
        return ConfigParams.model_validate(chunk.config)

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