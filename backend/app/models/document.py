from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON, Enum as SQLEnum
from sqlalchemy.sql import func
from app.core.database import Base
from app.schemas.document import DocumentStatus


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False, index=True)
    file_path = Column(String(512), nullable=False)
    file_type = Column(String(10), nullable=False, index=True)
    file_size = Column(Integer, nullable=False)
    status = Column(
        SQLEnum(DocumentStatus),
        nullable=False,
        default=DocumentStatus.PENDING,
        index=True
    )
    meta_data = Column(JSON, nullable=True)
    config = Column(JSON, nullable=True)
    result = Column(JSON, nullable=True)

    # 时间字段
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    processed_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<Document(id={self.id}, filename='{self.filename}', status='{self.status}')>"