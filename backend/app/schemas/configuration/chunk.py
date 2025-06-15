# 分块相关配置，可根据需要扩展
from typing import Dict, Any
from app.schemas.common_config import ConfigField, ConfigParams

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
CHUNK_CONFIG = ConfigParams(
    name="Chunk",
    description="分块配置",
    icon="file-chunk",
    fields=CHUNK_FIELDS,
    default_config={field.name: field.default for field in CHUNK_FIELDS},
    allowed_extensions=["pdf", "docx", "xlsx", "csv", "jpg", "jpeg", "png", "txt"],
    group_order=[
        "基本设置",
    ]
)

def get_default_config() -> ConfigParams:
    """根据文件类型获取默认加载配置"""
    return CHUNK_CONFIG