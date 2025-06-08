from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(Integer, nullable=False)
    upload_time = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="pending")  # pending, processing, completed, failed
    doc_metadata = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)

    # 关联
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")
    processing_logs = relationship("ProcessingLog", back_populates="document", cascade="all, delete-orphan")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    chunk_metadata = Column(JSON, nullable=True)
    embedding = Column(JSON, nullable=True)  # 存储向量嵌入
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关联
    document = relationship("Document", back_populates="chunks")


class ProcessingLog(Base):
    __tablename__ = "processing_logs"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    step = Column(String(50), nullable=False)  # upload, parse, chunk, embed, etc.
    status = Column(String(50), nullable=False)  # success, error
    message = Column(Text, nullable=True)
    log_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关联
    document = relationship("Document", back_populates="processing_logs")