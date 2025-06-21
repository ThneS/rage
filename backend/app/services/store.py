from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.store import Store
from app.schemas.store import LangChainStore, StoreMetaData
from app.schemas.document import LangChainDocument
from app.models.chunk import Chunk
from app.models.embedding import Embedding
from app.schemas.common_config import ConfigParams, DocumentStatus
from app.schemas.configuration.store import get_default_config
from typing import List
from fastapi import HTTPException
from app.services.chunkers.langchain_chunker import LangChainChunker
from app.services.storer.milvus import MilvusStorer
from app.schemas.chunk import LangChainChunk
from app.exceptions import APIException
from app.schemas.embedding import LangChainEmbedding

class StoreService:
    def __init__(self, db: Session):
        self.db = db

    def get_store_config(self, document_id: int) -> ConfigParams:
        # 1. 获取文档对象，校验是否存在
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="文档不存在")

        # 2. 获取或创建 store
        if not document.store_id:
            # 如果不存在 store，则创建新的 store 配置
            config:ConfigParams = get_default_config()
            store = Store(
                document_id=document_id,
                config=config.model_dump(),
                meta_data={
                    "document": {"id": document.id, "filename": document.filename}
                },
                result=[]
            )
            self.db.add(store)
            self.db.commit()
            self.db.refresh(store)
            document.store_id = store.id
            self.db.commit()
            self.db.refresh(document)
        else:
            store = self.db.query(Store).filter(Store.id == document.store_id).first()
        # 3. 返回 store 配置
        return ConfigParams.model_validate(store.config)

    def do_parse(self, document_id: int, config: ConfigParams) -> List[LangChainStore]:
        document = self.db.query(Document).filter(Document.id == document_id).first()
        chunk = self.db.query(Chunk).filter(Chunk.id == document.chunk_id).first()
        embedding = self.db.query(Embedding).filter(Embedding.id == document.embedding_id).first()
        store = self.db.query(Store).filter(Store.id == document.store_id).first()

        if not document or not chunk:
            raise APIException(code=404, message="文档或分块不存在")

        chunks:List[LangChainChunk] = [LangChainChunk.model_validate(chunk) for chunk in chunk.result]
        embedding:List[LangChainEmbedding] = [LangChainEmbedding.model_validate(embedding) for embedding in embedding.result]
        storer = MilvusStorer(config, "doc_"+str(document.id))
        storer.delete_collection()
        storer.create_collection()
        res = storer.insert(chunks=chunks, embedding=embedding)
        store.result = [result.model_dump() for result in res]
        self.db.add(store)
        self.db.commit()
        self.db.refresh(store)

        document.status = DocumentStatus.STORED
        document.store_id = store.id
        self.db.commit()
        self.db.refresh(document)

        return res

    def do_search(self, document_id: int, query: str) -> str:
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="文档不存在")

        if not document.store_id:
            raise HTTPException(status_code=400, detail="文档尚未进行向量存储处理，请先进行向量存储")

        store = self.db.query(Store).filter(Store.id == document.store_id).first()
        if not store:
            raise HTTPException(status_code=404, detail="存储记录不存在")

        storer = MilvusStorer(ConfigParams.model_validate(store.config), "doc_"+str(document.id))

        # 检查集合是否存在
        try:
            return storer.search(query)
        except Exception as e:
            if "collection not found" in str(e):
                raise HTTPException(status_code=400, detail="文档的向量集合不存在，请先进行向量存储处理")
            else:
                raise HTTPException(status_code=500, detail=f"搜索失败: {str(e)}")