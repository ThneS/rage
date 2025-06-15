from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.chunk import Chunk
from app.schemas.chunk import LangChainChunk
from app.schemas.document import LangChainDocument
from app.schemas.common_config import ConfigParams, DocumentStatus
from app.schemas.configuration.chunk import get_default_config
from typing import List
from fastapi import HTTPException
from app.services.chunkers.langchain_chunker import LangChainChunker

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
        # 2. 根据类型调用不同的chunkers
        results: List[LangChainChunk] = []
        if config.get("chunk_tool") == "langchain_recursive":
            chunker = LangChainChunker(config)
            for l_document in document.result:
                langchain_document = LangChainDocument.model_validate(l_document)
                results.extend(chunker.chunk(langchain_document))
            results = [result.model_dump() for result in results]
        else:
            raise ValueError(f"不支持的chunk工具: {config.get('chunk_tool')}")

        # 3. 更新文档状态
        chunk = self.db.query(Chunk).filter(Chunk.id == document.chunk_id).first()
        if not chunk:
            chunk = Chunk(
                document_id=document_id,
                config=config.model_dump(),
                meta_data={
                    "document": {"id": document.id, "filename": document.filename}
                },
                result=results,
            )
            self.db.add(chunk)
            self.db.commit()
            self.db.refresh(chunk)
            document.chunk_id = chunk.id
            document.status = DocumentStatus.CHUNKED
            self.db.commit()
            self.db.refresh(document)
        else:
            document.status = DocumentStatus.CHUNKED
            self.db.commit()
            self.db.refresh(document)
            chunk.config = config.model_dump()
            chunk.result = results
            self.db.commit()
            self.db.refresh(chunk)

        return results
