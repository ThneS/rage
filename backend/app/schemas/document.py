from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, field_validator
from app.schemas.common_config import DocumentStatus
from langchain_core.documents import Document as LangchainDocumentBase

class DocumentBase(BaseModel):
    """文档基础模型"""
    filename: str = Field(..., description="文件名")
    file_type: str = Field(..., description="文件类型（扩展名）")
    file_size: int = Field(..., description="文件大小（字节）")
    meta_data: Optional[Dict[str, Any]] = Field(
        default=None,
        description="文档元数据，可包含标题、作者、创建时间等信息"
    )

    @field_validator('filename')
    @classmethod
    def validate_filename(cls, v):
        """验证文件名"""
        if not v or len(v.strip()) == 0:
            raise ValueError("文件名不能为空")
        if len(v) > 255:
            raise ValueError("文件名长度不能超过255个字符")
        return v.strip()

    @field_validator('file_type')
    @classmethod
    def validate_file_type(cls, v):
        """验证文件类型"""
        if not v or len(v.strip()) == 0:
            raise ValueError("文件类型不能为空")
        # 移除可能的点号前缀
        v = v.strip().lstrip('.')
        if len(v) > 10:
            raise ValueError("文件类型长度不能超过10个字符")
        return v.lower()

    @field_validator('file_size')
    @classmethod
    def validate_file_size(cls, v):
        """验证文件大小"""
        if v <= 0:
            raise ValueError("文件大小必须大于0")
        # 限制文件大小为100MB
        if v > 100 * 1024 * 1024:
            raise ValueError("文件大小不能超过100MB")
        return v

    @field_validator('meta_data')
    @classmethod
    def validate_metadata(cls, v):
        """验证元数据"""
        if v is not None:
            if not isinstance(v, dict):
                raise ValueError("元数据必须是字典类型")
            # 验证元数据中的关键字段
            if 'title' in v and not isinstance(v['title'], str):
                raise ValueError("标题必须是字符串类型")
            if 'author' in v and not isinstance(v['author'], str):
                raise ValueError("作者必须是字符串类型")
            if 'created_at' in v:
                try:
                    datetime.fromisoformat(v['created_at'])
                except ValueError:
                    raise ValueError("创建时间格式无效")
        return v

class LoadConfig(BaseModel):
    """文档加载配置"""
    config: Dict[str, Any] = Field(..., description="加载配置")
    hash: str = Field(..., description="配置哈希值，用于快速比对")
    created_at: datetime = Field(default_factory=datetime.now, description="配置创建时间")

class LoadResult(BaseModel):
    """文档加载结果"""
    chunks: List[Dict[str, Any]] = Field(default_factory=list, description="文档分块结果")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="加载元数据")
    error: Optional[str] = Field(None, description="错误信息")
    created_at: datetime = Field(default_factory=datetime.now, description="结果创建时间")

class Document(DocumentBase):
    """文档完整模型"""
    id: int = Field(..., description="文档ID")
    file_path: str = Field(..., description="文件路径")
    status: DocumentStatus = Field(default=DocumentStatus.PENDING, description="文档状态")
    load_config: Optional[LoadConfig] = Field(None, description="加载配置")
    load_result: Optional[LoadResult] = Field(None, description="加载结果")
    error_message: Optional[str] = Field(None, description="错误信息")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    processed_at: Optional[datetime] = Field(None, description="处理时间")

    class Config:
        from_attributes = True

class LangChainDocument(BaseModel):
    """LangChain文档模型

    用于表示文档的基本结构，包含页面内容和元数据。
    参考自 langchain.schema.Document
    """
    page_content: str = Field(..., description="文档的主要内容")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="文档的元数据信息")

    model_config = {"from_attributes": True}

    def to_langchain_document(self) -> LangchainDocumentBase:
        document = LangchainDocumentBase(page_content=self.page_content, metadata=self.metadata)
        return document