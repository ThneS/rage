# 分块相关配置，可根据需要扩展
from app.schemas.common_config import ConfigField, ConfigParams, ConfigFieldOption, ConfigDependency

STORE_FIELDS = [
    ConfigField(
        name="store_method",
        label="存储方式",
        type="select",
        default="milvus",
        options=[
            ConfigFieldOption(label="Milvus", value="milvus"),
            ConfigFieldOption(label="Elasticsearch", value="elasticsearch"),
        ],
        description="选择存储方式，如Milvus、Elasticsearch等",
        group="基本设置",
        required=True,
    ),
]

STORE_CONFIG = ConfigParams(
    name="Store",
    description="Indexing and Search",
    icon="vector-store",
    fields=STORE_FIELDS,
    default_config={field.name: field.default for field in STORE_FIELDS},
    allowed_extensions=["*"],
    group_order=[
        "基本设置",
    ]
)

def get_default_config() -> ConfigParams:
    """获取默认分块配置"""
    return STORE_CONFIG