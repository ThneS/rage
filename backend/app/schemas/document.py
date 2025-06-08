from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class DocumentBase(BaseModel):
    filename: str
    file_type: str
    doc_metadata: Optional[Dict[str, Any]] = None


class DocumentCreate(DocumentBase):
    pass


class DocumentChunkBase(BaseModel):
    chunk_index: int
    content: str
    chunk_metadata: Optional[Dict[str, Any]] = None
    embedding: Optional[List[float]] = None


class DocumentChunkCreate(DocumentChunkBase):
    document_id: int


class ProcessingLogBase(BaseModel):
    step: str
    status: str
    message: Optional[str] = None
    log_metadata: Optional[Dict[str, Any]] = None


class ProcessingLogCreate(ProcessingLogBase):
    document_id: int


class DocumentChunk(DocumentChunkBase):
    id: int
    document_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ProcessingLog(ProcessingLogBase):
    id: int
    document_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class Document(DocumentBase):
    id: int
    file_path: str
    file_size: int
    upload_time: datetime
    status: str
    error_message: Optional[str] = None
    chunks: List[DocumentChunk] = []
    processing_logs: List[ProcessingLog] = []

    class Config:
        from_attributes = True


# 文档处理配置模型
class ChunkingConfig(BaseModel):
    method: str = Field(..., description="分块方法：fixed, paragraph, semantic, llm")
    chunk_size: Optional[int] = Field(None, description="固定分块大小")
    chunk_overlap: Optional[int] = Field(None, description="分块重叠大小")
    min_chunk_size: Optional[int] = Field(None, description="最小分块大小")
    max_chunks: Optional[int] = Field(None, description="最大分块数量")
    embedding_model: Optional[str] = Field(None, description="用于语义分块的嵌入模型")
    similarity_threshold: Optional[float] = Field(None, description="语义相似度阈值")
    llm_model: Optional[str] = Field(None, description="用于LLM分块的模型")
    prompt_template: Optional[str] = Field(None, description="LLM分块的提示词模板")


class DocumentProcessingConfig(BaseModel):
    parser: str = Field(..., description="文档解析器：langchain, llamaindex, unstructured")
    enable_table_recognition: bool = Field(False, description="是否启用表格识别")
    enable_ocr: bool = Field(False, description="是否启用OCR")
    enable_image_analysis: bool = Field(False, description="是否启用图像分析")
    remove_headers_footers: bool = Field(False, description="是否移除页眉页脚")
    chunking_config: ChunkingConfig