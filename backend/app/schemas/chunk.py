from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, field_validator
from app.schemas.common_config import DocumentStatus

class ChunkBase(BaseModel):
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

class ChunkConfig(BaseModel):
    """文档加载配置"""
    config: Dict[str, Any] = Field(..., description="加载配置")
    hash: str = Field(..., description="配置哈希值，用于快速比对")
    created_at: datetime = Field(default_factory=datetime.now, description="配置创建时间")

    class Config:
        from_attributes = True


class ChunkMetaData(BaseModel):
    source: str = Field(..., description="分块的来源")
    page: Optional[int] = Field(None, description="分块的页码")
    chunk_id: Optional[int] = Field(None, description="分块的唯一标识符")


class LangChainChunk(BaseModel):
    """LangChain文档模型

    用于表示文档的基本结构，包含页面内容和元数据。
    参考自 langchain.schema.Document
    """
    page_content: str = Field(..., description="文档的主要内容")
    metadata: ChunkMetaData = Field(default_factory=ChunkMetaData, description="文档的元数据信息")

    model_config = {"from_attributes": True}