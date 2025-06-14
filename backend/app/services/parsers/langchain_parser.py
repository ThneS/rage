from typing import Dict, Any
from app.schemas.document import DocumentLoadConfig

from langchain_core.documents import Document
from langchain_community.document_loaders import (
    PyPDFLoader,
)

class LangchainParser:
    def parse_pdf(file_path: str, config_dict: DocumentLoadConfig):
        # 根据config_dict判断使用哪个loader
        if config_dict.get('extract_images'):
            loader = PyPDFLoader(file_path)
        else:
            loader = PyPDFLoader(file_path)
        documents = loader.load()
        return "\n".join(doc.page_content for doc in documents)
