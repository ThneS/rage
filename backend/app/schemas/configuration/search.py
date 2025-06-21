from app.schemas.common_config import ConfigParams, ConfigField
PRE_FIELDS = [
    ConfigField(
            name="enable_summarization",
            label="启用摘要",
            type="switch",
            default=False,
            description="是否在预处理中生成摘要",
            group="基本设置"
        ),
        ConfigField(
            name="max_length",
            label="最大长度",
            type="number",
            default=512,
            description="预处理内容的最大长度",
            group="基本设置"
        )
    ]

POST_FIELDS = [
    ConfigField(
            name="temperature",
            label="温度",
            type="range",
            min=0.0,
            max=1.0,
            step=0.1,
            default=0.7,
            description="控制生成内容的多样性",
            group="基本设置"
        )]

PRE_CONFIG = ConfigParams(
    name="预处理",
    description="预处理配置",
    allowed_extensions=["*"],
    icon="pre",
    fields=PRE_FIELDS,
    default_config={field.name: field.default for field in PRE_FIELDS},
    group_order=[
        "基本设置"
    ]
)

POST_CONFIG = ConfigParams(
    name="后处理",
    description="后处理配置",
    allowed_extensions=["*"],
    icon="post",
    fields=POST_FIELDS,
    default_config={field.name: field.default for field in POST_FIELDS},
    group_order=[
        "基本设置"
    ]
)

def get_pre_default_config():
    return PRE_CONFIG

def get_post_default_config():
    return POST_CONFIG