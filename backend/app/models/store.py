from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Store(Base):
    """
    存储文档分块结果的模型类

    属性:
        id: 主键
        document_id: 关联的文档ID
        meta_data: 存储元数据(如文档信息、存储配置等)
        config: 存储配置(如向量化参数、索引设置等)
        result: 存储结果(如向量化结果、索引信息等)
        document: 关联的文档对象

    关系:
        document_id 是外键，用于数据库层面的关联关系
        document 是 SQLAlchemy ORM 的关系属性，用于在 Python 代码中方便地访问关联的文档对象
        两者不是冗余，而是互补的关系：
        - document_id 用于数据库存储和查询
        - document 用于 ORM 对象关系映射，提供便捷的对象访问方式
    """
    __tablename__ = "stores"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False, index=True)
    meta_data = Column(JSON, nullable=True)
    config = Column(JSON, nullable=True)
    result = Column(JSON, nullable=True)

    def __repr__(self):
        return f"Store(id={self.id}, document_id={self.document_id}, page={self.page})"