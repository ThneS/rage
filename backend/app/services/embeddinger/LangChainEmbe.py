from typing import List, Dict, Any
from dataclasses import dataclass
from app.core.config import settings
from app.schemas.common_config import ConfigParams
from app.schemas.embedding import EmbeddingMetaData, LangChainEmbedding
import numpy as np

from app.schemas.chunk import LangChainChunk

class Embeddinger:
    def __init__(self, config: ConfigParams):
        self.config = config

    def embedding(self, chunks: List[LangChainChunk]) -> List[LangChainEmbedding]:
        # 此处使用 numpy 随机生成向量
        embd = np.random.rand(1024).tolist()  # 假设嵌入维度为768
        return [LangChainEmbedding(embedding=embd,
                                   metadata=EmbeddingMetaData(source="LangChainEmbe",
                                                              page=chunk.metadata.page,
                                                              embedding_id=chunk.metadata.page)) for chunk in chunks]