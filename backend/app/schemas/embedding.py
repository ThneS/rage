from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, field_validator

class EmbeddingBase(BaseModel):
    """文档基础模型"""
    embedding: List[float] = Field(..., description="嵌入向量")
    meta_data: Optional[Dict[str, Any]] = Field(
        default=None,
        description="文档元数据，可包含标题、作者、创建时间等信息"
    )

    @field_validator('embedding')
    @classmethod
    def validate_embedding(cls, v):
        """验证嵌入向量"""
        if not v or len(v.strip()) == 0:
            raise ValueError("文件名不能为空")
        if len(v) > 255:
            raise ValueError("文件名长度不能超过255个字符")
        return v.strip()


class EmbeddingConfig(BaseModel):
    """文档加载配置"""
    config: Dict[str, Any] = Field(..., description="加载配置")
    hash: str = Field(..., description="配置哈希值，用于快速比对")
    created_at: datetime = Field(default_factory=datetime.now, description="配置创建时间")

    class Config:
        from_attributes = True


class EmbeddingMetaData(BaseModel):
    source: str = Field(..., description="嵌入的来源")
    page: Optional[int] = Field(None, description="嵌入的页码")
    embedding_id: Optional[int] = Field(None, description="嵌入的唯一标识符")


class LangChainEmbedding(BaseModel):
    """LangChain文档模型

    用于表示文档的基本结构，包含页面内容和元数据。
    参考自 langchain.schema.Document
    """
    embedding: List[float] = Field(..., description="文档的嵌入向量")
    metadata: EmbeddingMetaData = Field(default_factory=EmbeddingMetaData, description="文档的元数据信息")