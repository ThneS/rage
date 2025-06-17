from typing import List, Dict, Any
from dataclasses import dataclass
from openai import OpenAI
from app.core.config import settings
from app.schemas.common_config import ConfigParams
from app.schemas.embedding import LangChainEmbedding

class Embeddinger:
    def __init__(self, config: ConfigParams):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.config = config

    def embedding(self, content: str) -> List[LangChainEmbedding]:
        pass