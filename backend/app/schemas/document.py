from datetime import datetime
from typing import Optional, Dict, Any, List, Union
from pydantic import BaseModel, Field, validator
from app.core.document_config import ConfigField, ConfigFieldOption
from enum import Enum


class DocumentStatus(str, Enum):
    """文档状态枚举"""
    PENDING = "pending"      # 待处理
    PROCESSING = "processing"  # 处理中
    COMPLETED = "completed"  # 处理完成
    FAILED = "failed"       # 处理失败

class DocumentBase(BaseModel):
    """文档基础模型"""
    filename: str = Field(..., description="文件名")
    file_type: str = Field(..., description="文件类型（扩展名）")
    file_size: int = Field(..., description="文件大小（字节）")
    doc_metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        description="文档元数据，可包含标题、作者、创建时间等信息"
    )

    @validator('filename')
    def validate_filename(cls, v):
        """验证文件名"""
        if not v or len(v.strip()) == 0:
            raise ValueError("文件名不能为空")
        if len(v) > 255:
            raise ValueError("文件名长度不能超过255个字符")
        return v.strip()

    @validator('file_type')
    def validate_file_type(cls, v):
        """验证文件类型"""
        if not v or len(v.strip()) == 0:
            raise ValueError("文件类型不能为空")
        # 移除可能的点号前缀
        v = v.strip().lstrip('.')
        if len(v) > 10:
            raise ValueError("文件类型长度不能超过10个字符")
        return v.lower()

    @validator('file_size')
    def validate_file_size(cls, v):
        """验证文件大小"""
        if v <= 0:
            raise ValueError("文件大小必须大于0")
        # 限制文件大小为100MB
        if v > 100 * 1024 * 1024:
            raise ValueError("文件大小不能超过100MB")
        return v

    @validator('doc_metadata')
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

class Document(DocumentBase):
    """文档完整模型"""
    id: int
    file_path: str
    status: DocumentStatus = Field(
        default=DocumentStatus.PENDING,
        description="文档处理状态"
    )
    created_at: datetime
    updated_at: datetime
    processed_at: Optional[datetime] = None
    error_message: Optional[str] = None

    model_config = {"from_attributes": True}


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


class DocumentLoadConfig(BaseModel):
    """文档加载配置基类"""
    # PDF 配置
    extract_text: Optional[bool] = Field(default=True, description="是否提取文本")
    extract_images: Optional[bool] = Field(default=False, description="是否提取图片")
    extract_tables: Optional[bool] = Field(default=True, description="是否提取表格")
    ocr_enabled: Optional[bool] = Field(default=False, description="是否启用OCR")
    page_range: Optional[Union[str, List[int]]] = Field(default="all", description="页码范围")
    password: Optional[str] = Field(default=None, description="PDF密码")

    # Word 配置
    extract_headers: Optional[bool] = Field(default=True, description="是否提取页眉")
    extract_footers: Optional[bool] = Field(default=True, description="是否提取页脚")
    extract_comments: Optional[bool] = Field(default=False, description="是否提取批注")

    # Excel 配置
    extract_sheets: Optional[Union[str, List[str]]] = Field(default="all", description="要提取的工作表")
    extract_formulas: Optional[bool] = Field(default=False, description="是否提取公式")
    extract_charts: Optional[bool] = Field(default=False, description="是否提取图表")
    header_row: Optional[int] = Field(default=0, description="表头行号")
    skip_empty_rows: Optional[bool] = Field(default=True, description="是否跳过空行")

    # CSV 配置
    delimiter: Optional[str] = Field(default=",", description="分隔符")
    encoding: Optional[str] = Field(default="utf-8", description="文件编码")
    has_header: Optional[bool] = Field(default=True, description="是否有表头")

    # 图片配置
    ocr_language: Optional[str] = Field(default="chi_sim+eng", description="OCR语言")
    extract_metadata: Optional[bool] = Field(default=True, description="是否提取元数据")
    resize: Optional[bool] = Field(default=False, description="是否调整大小")
    max_size: Optional[tuple[int, int]] = Field(default=None, description="最大尺寸(宽,高)")

    class Config:
        json_schema_extra = {
            "example": {
                "extract_text": True,
                "extract_images": False,
                "extract_tables": True,
                "ocr_enabled": False,
                "page_range": "all",
                "password": None,
                "extract_headers": True,
                "extract_footers": True,
                "extract_comments": False,
                "extract_sheets": "all",
                "extract_formulas": False,
                "extract_charts": False,
                "header_row": 0,
                "skip_empty_rows": True,
                "delimiter": ",",
                "encoding": "utf-8",
                "has_header": True,
                "ocr_language": "chi_sim+eng",
                "extract_metadata": True,
                "resize": False,
                "max_size": None
            }
        }

# PDF
class PdfLoadConfig(DocumentLoadConfig):
    pass

# Word的加载配置
class WordLoadConfig(DocumentLoadConfig):
    pass

# Excel的加载配置
class ExcelLoadConfig(DocumentLoadConfig):
    pass

# CSV的加载配置
class CsvLoadConfig(DocumentLoadConfig):
    pass

# 图片的加载配置
class ImageLoadConfig(DocumentLoadConfig):
    pass

class FileTypeConfigResponse(BaseModel):
    """文件类型配置响应"""
    name: str = Field(..., description="文件类型名称")
    description: str = Field(..., description="文件类型描述")
    icon: Optional[str] = Field(None, description="文件类型图标")
    fields: List[ConfigField] = Field(..., description="配置字段列表")
    default_config: Dict[str, Any] = Field(..., description="默认配置值")
    group_order: List[str] = Field(..., description="分组展示顺序")