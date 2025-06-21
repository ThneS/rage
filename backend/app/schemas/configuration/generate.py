from app.schemas.common_config import ConfigParams, ConfigField, ConfigFieldOption, ConfigDependency

GENERATE_FIELDS = [
    ConfigField(
        name="max_tokens",
        label="最大令牌数",
        type="number",
        default=1024,
        description="生成内容的最大长度",
        group="基本设置"
    ),
    ConfigField(
        name="model_name",
        label="模型名称",
        type="select",
        default="gpt-3.5-turbo",
        options=[
            ConfigFieldOption(label="OpenAI Embedding", value="openai"),
            ConfigFieldOption(label="GPT-3.5", value="gpt-3.5-turbo"),
            ConfigFieldOption(label="GPT-4", value="gpt-4"),
        ],
        description="选择用于生成的模型",
        dependencies=ConfigDependency(field="ocr_enabled", value=True),
        group="基本设置"
    )
]

GENERATE_CONFIG = ConfigParams(
    name="生成配置",
    description="配置生成过程的参数",
    icon="generate",
    allowed_extensions=["*"],
    fields=GENERATE_FIELDS,
    default_config={field.name: field.default for field in GENERATE_FIELDS},
    group_order=["基本设置"]
)

def get_generate_default_config():
    return GENERATE_CONFIG
