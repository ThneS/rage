from typing import List
from app.schemas.document import DocumentLoadConfig, LangChainDocument
from langchain_community.document_loaders import (
    PyPDFLoader,
)

class LangchainParser:
    def parse(self, file_path: str, config: DocumentLoadConfig)-> List[LangChainDocument]:
        # 根据config_dict判断使用哪个loader
        loader_tool = config.get("loader_tool", "langchain")
        if loader_tool == "langchain":
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            return [LangChainDocument(page_content=doc.page_content, metadata=doc.metadata) for doc in documents]
        else:
            raise ValueError(f"不支持的加载工具: {loader_tool}")
