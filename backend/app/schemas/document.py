from datetime import datetime
from typing import Optional, Dict, Any, List, Union
from pydantic import BaseModel, Field, field_validator
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

    @field_validator('doc_metadata')
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

class FileTypeConfigResponse(BaseModel):
    """文件类型配置响应"""
    name: str = Field(..., description="文件类型名称")
    description: str = Field(..., description="文件类型描述")
    icon: Optional[str] = Field(None, description="文件类型图标")
    fields: List[ConfigField] = Field(..., description="配置字段列表")
    default_config: Dict[str, Any] = Field(..., description="默认配置值")
    group_order: List[str] = Field(..., description="分组展示顺序")

    # 实现read方法，根据 config里面的的group_order过滤fields，选择可用的字段，在读取的取值
    def read(self, config: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """根据配置过滤并返回可用的字段值

        Args:
            config: 配置字典，包含 group_order 等字段

        Returns:
            Dict[str, Any]: 过滤后的字段值字典
        """
        if not config:
            return {}

        # 获取配置中的分组顺序
        group_order = config.get('group_order', [])
        if not group_order:
            return {}

        # 按分组顺序过滤字段
        filtered_fields = {}
        for group in group_order:
            # 找出属于当前分组的字段
            group_fields = [field for field in self.fields if field.group == group]

            # 将字段添加到结果中
            for field in group_fields:
                field_name = field.name
                # 从 default_config 中获取字段值
                if field_name in self.default_config:
                    filtered_fields[field_name] = self.default_config[field_name]

        return filtered_fields

class DocumentLoadConfig(FileTypeConfigResponse):
    pass