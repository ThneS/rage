from typing import List, Dict, Any
from dataclasses import dataclass
from openai import OpenAI
from app.core.config import settings

@dataclass
class Chunk:
    content: str
    metadata: Dict[str, Any] = None

class LLMChunker:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def split(self, content: str) -> List[Chunk]:
        prompt = f"""请将以下文本分成有意义的段落，每个段落应该是一个完整的语义单元。
        文本内容：
        {content}

        请以JSON格式返回，格式为：
        {{"chunks": [{{"content": "段落内容", "metadata": {{"reason": "分块原因"}}}}]}}
        """

        response = self.client.chat.completions.create(
            model=settings.DEFAULT_CHAT_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        result = response.choices[0].message.content
        chunks_data = eval(result)["chunks"]

        return [Chunk(content=c["content"], metadata=c.get("metadata")) for c in chunks_data]