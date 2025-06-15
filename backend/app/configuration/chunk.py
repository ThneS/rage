# 分块相关配置，可根据需要扩展
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.common_config import ConfigField

class ChunkConfig(BaseModel):
    name: str = Field(..., description="文件类型名称")
    description: str = Field(..., description="文件类型描述")
    fields: List[ConfigField] = Field(..., description="配置字段列表")
    default_config: Dict[str, Any] = Field(..., description="默认配置值")
    group_order: List[str]

CHUNK_FIELDS = [
    ConfigField(
        name="chunk_method",
        label="分块方式",
        type="select",
        default="fixed_token",
        options=[{"label": "固定token数", "value": "fixed_token"}, {"label": "按页分块", "value": "by_page"}],
        description="选择分块方式",
        group="基本设置"
    ),
    ConfigField(
        name="token_size",
        label="token数",
        type="number",
        default=500,
        min=100,
        max=5000,
        step=100,
        description="每块的token数",
        group="基本设置"
    ),
    ConfigField(
        name="overlap",
        label="重叠比例",
        type="number",
        default=0.1,
        min=0,
        max=1,
        step=0.01,
        description="相邻分块的重叠比例",
        group="基本设置"
    )
]

def get_chunk_config() -> ChunkConfig:
    """
    获取通用分块配置

    Returns:
        ChunkConfig: 包含分块相关配置的对象
    """
    return ChunkConfig(
        name="通用分块",
        description="适用于大多数文档的分块方式，支持固定token数和按页分块两种模式",
        fields=CHUNK_FIELDS,
        default_config={field.name: field.default for field in CHUNK_FIELDS},
        group_order=["基本设置"]
    )