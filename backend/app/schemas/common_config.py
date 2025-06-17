from typing import Any, List, Optional, Dict, Union, Literal
from pydantic import BaseModel, Field
from enum import Enum

class DocumentStatus(str, Enum):
    """文档状态枚举"""
    PENDING = "pending"      # 待处理
    LOADED = "loaded"        # 已加载
    CHUNKED = "chunked"      # 已分块
    EMBEDDED = "embedded"    # 已嵌入
    INDEXED = "indexed"      # 已索引
    ERROR = "error"          # 错误

class ConfigFieldOption(BaseModel):
    label: str = Field(..., description="选项标签")
    value: Any = Field(..., description="选项值")
    description: Optional[str] = Field(None, description="选项描述")

class ConfigDependency(BaseModel):
    field: str = Field(..., description="依赖字段")
    value: Any = Field(..., description="依赖值")

class ConfigField(BaseModel):
    name: str = Field(..., description="字段名称")
    label: str = Field(..., description="字段标签")
    type: Literal["switch", "select", "radio", "number", "text", "textarea", "range", "checkbox"] = Field(..., description="字段类型")
    description: Optional[str] = Field(None, description="字段描述")
    default: Any = Field(..., description="默认值")
    required: bool = Field(default=False, description="是否必填")
    options: Optional[List[ConfigFieldOption]] = Field(None, description="选项列表（用于select、radio、checkbox类型）")
    min: Optional[Union[int, float]] = Field(None, description="最小值（用于number和range类型）")
    max: Optional[Union[int, float]] = Field(None, description="最大值（用于number和range类型）")
    step: Optional[Union[int, float]] = Field(None, description="步长（用于number和range类型）")
    placeholder: Optional[str] = Field(None, description="占位文本（用于text和textarea类型）")
    rows: Optional[int] = Field(None, description="行数（用于textarea类型）")
    disabled: bool = Field(default=False, description="是否禁用")
    hidden: bool = Field(default=False, description="是否隐藏")
    group: Optional[str] = Field(None, description="分组名称")
    dependencies: Optional[ConfigDependency] = Field(None, description="依赖关系")

class ConfigParams(BaseModel):
    """文件类型配置响应"""
    name: str = Field(..., description="文件类型名称")
    description: str = Field(..., description="文件类型描述")
    icon: Optional[str] = Field(None, description="文件类型图标")
    allowed_extensions: List[str] = Field(..., description="允许的文件扩展名")
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

    def get(self, key: str, default: Any = None) -> Any:
        return self.default_config.get(key, default)