from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.chunk import Chunk
from app.schemas.chunk import LangChainChunk, ChunkMetaData
from app.schemas.common_config import ConfigParams
from app.schemas.configuration.chunk import get_default_config
from typing import List
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
        if not document.chunk_id:
            # 如果不存在 chunk，则创建新的 chunk 配置
            config:ConfigParams = get_default_config()
            chunk = Chunk(
                document_id=document_id,
                config=config.model_dump(),
                meta_data={
                    "document": {"id": document.id, "filename": document.filename}
                },
                result=[]
            )
            self.db.add(chunk)
            self.db.commit()
            self.db.refresh(chunk)
            document.chunk_id = chunk.id
            self.db.commit()
            self.db.refresh(document)
        else:
            chunk = self.db.query(Chunk).filter(Chunk.id == document.chunk_id).first()
        # 3. 返回 chunk 配置
        return ConfigParams.model_validate(chunk.config)

    def parse_chunk(self, document_id: int, config: ConfigParams) -> List[LangChainChunk]:
        # 1. 获取文档内容
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise Exception("文档不存在")
        # 2. 假设每页一段内容，简单模拟分块
        result = []
        for i in range(1, 10):
            metadata = ChunkMetaData(
                page=i,
                chunk_id=i,
                source="chunk"
            )
            result.append(
                LangChainChunk(
                    page_content=f"chunk content for page {i}",
                    metadata=metadata
                ).model_dump()
            )
        # 3. 更新文档状态
        chunk = self.db.query(Chunk).filter(Chunk.id == document.chunk_id).first()
        if not chunk:
            chunk = Chunk(
                document_id=document_id,
                config=config.model_dump(),
                meta_data={
                    "document": {"id": document.id, "filename": document.filename}
                },
                result=result,
            )
            self.db.add(chunk)
            self.db.commit()
            self.db.refresh(chunk)
            document.chunk_id = chunk.id
            self.db.commit()
            self.db.refresh(document)
        else:
            chunk.config = config.model_dump()
            chunk.result = result
            self.db.commit()
            self.db.refresh(chunk)

        return result
