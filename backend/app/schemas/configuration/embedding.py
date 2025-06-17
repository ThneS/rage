# 分块相关配置，可根据需要扩展
from app.schemas.common_config import ConfigField, ConfigParams, ConfigFieldOption

EMBEDDING_FIELDS = [
    ConfigField(
        name="embedding_tool",
        label="嵌入工具",
        type="select",
        default="langchain_recursive",
        options=[
            ConfigFieldOption(label="OpenAI Embedding", value="openai"),
            ConfigFieldOption(label="Sentence Transformers", value="sentence_transformers"),
            ConfigFieldOption(label="Hugging Face", value="huggingface"),
            ConfigFieldOption(label="Cohere", value="cohere"),
            ConfigFieldOption(label="LangChain Recursive", value="langchain_recursive"),
            ConfigFieldOption(label="自定义嵌入", value="custom"),
        ],
        description="选择嵌入实现工具",
        group="基本设置"
    ),
]

EMBEDDING_CONFIG = ConfigParams(
    name="Embedding",
    description="嵌入配置，支持多种嵌入方式、目标和工具",
    icon="file-embedding",
    fields=EMBEDDING_FIELDS,
    default_config={field.name: field.default for field in EMBEDDING_FIELDS},
    allowed_extensions=["*"],
    group_order=[
        "基本设置",
    ]
)

def get_default_config() -> ConfigParams:
    """获取默认嵌入配置"""
    return EMBEDDING_CONFIG