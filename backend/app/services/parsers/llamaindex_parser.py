from app.schemas.common_config import ConfigParams
from typing import List
from app.schemas.chunk import LangChainChunk

class LlamaIndexParser:
    def __init__(self, config: ConfigParams):
        self.config = config

    def parse(self, file_path: str)-> List[LangChainChunk]:
        raise NotImplementedError("LlamaIndexParser is not implemented")