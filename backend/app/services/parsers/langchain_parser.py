from typing import List
from app.schemas.document import LangChainDocument
from langchain_community.document_loaders import (
    PyPDFLoader,
)
from app.schemas.common_config import ConfigParams

class LangchainParser:
    def __init__(self, config: ConfigParams):
        self.config = config

    def parse(self, file_path: str)-> List[LangChainDocument]:
        if self.config.get("loader_tool") == "langchain":
            loader = PyPDFLoader(file_path)
        else:
            raise ValueError(f"不支持的加载工具: {self.config.get('loader_tool')}")
        documents = loader.load()
        return [LangChainDocument(page_content=doc.page_content, metadata=doc.metadata) for doc in documents]
