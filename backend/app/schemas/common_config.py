from typing import Any, List, Optional, Dict, Union, Literal
from pydantic import BaseModel, Field

class ConfigFieldOption(BaseModel):
    label: str = Field(..., description="选项标签")
    value: Any = Field(..., description="选项值")
    description: Optional[str] = Field(None, description="选项描述")

class ConfigField(BaseModel):
    name: str = Field(..., description="字段名称")
    label: str = Field(..., description="字段标签")
    type: Literal["switch", "select", "radio", "number", "text", "textarea", "range"] = Field(..., description="字段类型")
    description: Optional[str] = Field(None, description="字段描述")
    default: Any = Field(..., description="默认值")
    required: bool = Field(default=False, description="是否必填")
    options: Optional[List[ConfigFieldOption]] = Field(None, description="选项列表（用于select和radio类型）")
    min: Optional[Union[int, float]] = Field(None, description="最小值（用于number和range类型）")
    max: Optional[Union[int, float]] = Field(None, description="最大值（用于number和range类型）")
    step: Optional[Union[int, float]] = Field(None, description="步长（用于number和range类型）")
    placeholder: Optional[str] = Field(None, description="占位文本（用于text和textarea类型）")
    rows: Optional[int] = Field(None, description="行数（用于textarea类型）")
    disabled: bool = Field(default=False, description="是否禁用")
    hidden: bool = Field(default=False, description="是否隐藏")
    group: Optional[str] = Field(None, description="分组名称")
    dependencies: Optional[Dict[str, Any]] = Field(None, description="依赖关系，例如：{'field': 'extract_text', 'value': True}")