from typing import List, Dict, Any
from dataclasses import dataclass
from openai import OpenAI
from app.core.config import settings
from app.schemas.common_config import ConfigParams
from app.schemas.embedding import LangChainEmbedding
from collections import Counter

def bm25_sparse_embedding(log):
    tf = Counter(log.split("，"))
    log_len = len(log.split("，"))
    embedding = {}
    for word, freq in tf.items():
        if word in vocabulary:
            idx = vocab_to_idx[word]
            score = idf[word] * (freq * (k1 + 1)) / (freq + k1 * (1 - b + b * log_len / avg_log_len))
            embedding[idx] = score
    return embedding
# 生成稀疏向量

class Bm25Embeddinger:
    def __init__(self, config: ConfigParams):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.config = config

    def embedding(self, content: str) -> List[LangChainEmbedding]:
        pass