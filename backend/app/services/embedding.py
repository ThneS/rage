from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.embedding import Embedding
from app.schemas.embedding import LangChainEmbedding
from app.schemas.document import LangChainDocument
from app.schemas.common_config import ConfigParams, DocumentStatus
from app.schemas.configuration.chunk import get_default_config
from typing import List
from fastapi import HTTPException
from app.services.embeddinger.LangChainEmbe import Embeddinger

class EmbeddingService:
    def __init__(self, db: Session):
        self.db = db

    def get_embedding_config(self, document_id: int) -> ConfigParams:
        # 1. 获取文档对象，校验是否存在
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="文档不存在")

        # 2. 获取或创建 embedding
        if not document.embedding_id:
            # 如果不存在 embedding，则创建新的 embedding 配置
            config:ConfigParams = get_default_config()
            embedding = Embedding(
                document_id=document_id,
                config=config.model_dump(),
                meta_data={
                    "document": {"id": document.id, "filename": document.filename}
                },
                result=[]
            )
            self.db.add(embedding)
            self.db.commit()
            self.db.refresh(embedding)
            document.embedding_id = embedding.id
            self.db.commit()
            self.db.refresh(document)
        else:
            embedding = self.db.query(Embedding).filter(Embedding.id == document.embedding_id).first()
        # 3. 返回 embedding 配置
        return ConfigParams.model_validate(embedding.config)

    def parse_embedding(self, document_id: int, config: ConfigParams) -> List[LangChainEmbedding]:
        # 1. 获取文档内容
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise Exception("文档不存在")
        # 2. 获取或创建 embedding
        if not document.embedding_id:
            # 如果不存在 embedding，则创建新的 embedding 配置
            result = Embeddinger(config).embedding(document.content)
            embedding = Embedding(
                document_id=document_id,
                config=config.model_dump(),
                meta_data={
                    "document": {"id": document.id, "filename": document.filename}
                },
                result=[]
            )
            self.db.add(embedding)
            self.db.commit()
            self.db.refresh(embedding)
            document.embedding_id = embedding.id
            self.db.commit()
            self.db.refresh(document)
            document.status = DocumentStatus.EMBEDDED
            self.db.commit()
            self.db.refresh(document)
        else:
            embedding = self.db.query(Embedding).filter(Embedding.id == document.embedding_id).first()
            document.status = DocumentStatus.EMBEDDED
            self.db.commit()
            self.db.refresh(document)
        pass
