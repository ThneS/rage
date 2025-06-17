from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, ForeignKey, Text, JSON
from app.core.database import Base

class Embedding(Base):
    """
    存储文档嵌入结果的模型类

    属性:
        id: 主键
        document_id: 关联的文档ID
        embedding: 嵌入向量
        status: 状态
        created_at: 创建时间
        updated_at: 更新时间
    """
    __tablename__ = "embeddings"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False, index=True)
    meta_data = Column(JSON, nullable=True)
    config = Column(JSON, nullable=True)
    result = Column(JSON, nullable=True)
