from typing import Dict, Any
from llama_index import SimpleDirectoryReader, Document as LlamaDocument

class LlamaIndexParser:
    def parse(
        self,
        file_path: str,
        enable_table_recognition: bool = False,
        enable_ocr: bool = False,
        enable_image_analysis: bool = False,
        remove_headers_footers: bool = False
    ) -> str:
        reader = SimpleDirectoryReader(input_files=[file_path])
        documents = reader.load_data()
        return "\n".join(doc.text for doc in documents)