from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Chunk(Base):
    """
    存储文档分块结果的模型类

    属性:
        id: 主键
        document_id: 关联的文档ID
        document_page: 文档页码(如果文档是分页的)
        page: 分块在文档中的页码
        content: 分块内容
        chunk_metadata: 分块元数据(如分块原因、位置等)
        chunk_config: 分块配置(如分块大小、重叠度等)
        chunk_result: 分块结果(如分块质量评估等)
        document: 关联的文档对象

    关系:
        document_id 是外键，用于数据库层面的关联关系
        document 是 SQLAlchemy ORM 的关系属性，用于在 Python 代码中方便地访问关联的文档对象
        两者不是冗余，而是互补的关系：
        - document_id 用于数据库存储和查询
        - document 用于 ORM 对象关系映射，提供便捷的对象访问方式
    """
    __tablename__ = "chunks"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False, index=True)
    meta_data = Column(JSON, nullable=True)
    config = Column(JSON, nullable=True)
    result = Column(JSON, nullable=True)
    document = relationship("Document", back_populates="chunks")

    def __repr__(self):
        return f"Chunk(id={self.id}, document_id={self.document_id}, page={self.page})"