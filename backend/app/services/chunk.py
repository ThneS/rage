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

        # 2. 如果存在 chunk id 则根据document的chunk_id 查找chunk，否则创建chunk
        if document.chunk_id:
            # 如果文档已有chunk_id，则查找对应的chunk配置
            chunk = self.db.query(Chunk).filter(Chunk.id == document.chunk_id).first()
            if not chunk:
                raise HTTPException(status_code=404, detail="分块配置不存在")
        else:
            # 如果文档没有chunk_id，则创建新的chunk配置
            config = get_default_config()
            chunk = Chunk(
                document_id=document_id,
                config=config.model_dump(),
                content="",  # 初始内容为空
                meta_data={},  # 初始元数据为空
                result={}  # 初始结果为空
            )
            self.db.add(chunk)
            self.db.commit()
            self.db.refresh(chunk)
            # 更新文档的chunk_id
            document.chunk_id = chunk.id
            self.db.commit()
        return

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