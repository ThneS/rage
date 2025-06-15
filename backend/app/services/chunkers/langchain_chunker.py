from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List
from app.schemas.common_config import ConfigParams
from app.schemas.chunk import LangChainChunk
from app.schemas.document import LangChainDocument

class LangChainChunker:
    def __init__(self, config: ConfigParams):
        self.config = config

    def chunk(self, document:  LangChainDocument) -> List[LangChainChunk]:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.config.get("chunk_size", 1000),
            chunk_overlap=self.config.get("chunk_overlap", 0))
        chunks = text_splitter.split_documents([document.to_langchain_document()])
        return [LangChainChunk(page_content=doc.page_content, metadata=doc.metadata) for doc in chunks]