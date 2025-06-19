# 分块相关配置，可根据需要扩展
from app.schemas.common_config import ConfigField, ConfigParams, ConfigFieldOption, ConfigDependency

STORE_FIELDS = [
    ConfigField(
        name="chunk_method",
        label="分块方式",
        type="select",
        default="fixed_token",
        options=[
            ConfigFieldOption(label="按字符数", value="fixed_char"),
            ConfigFieldOption(label="按Token数", value="fixed_token"),
            ConfigFieldOption(label="按段落/语义/标题层级", value="semantic"),
            ConfigFieldOption(label="按代码语法块", value="code_block"),
            ConfigFieldOption(label="智能分块", value="smart"),
        ],
        description="选择分块方式，如按Token数、按段落、按代码块等",
        group="基本设置"
    ),
    ConfigField(
        name="chunk_tool",
        label="分块工具",
        type="select",
        default="langchain_recursive",
        options=[
            ConfigFieldOption(label="LangChain-RecursiveCharacterTextSplitter", value="langchain_recursive"),
            ConfigFieldOption(label="LangChain-CharacterTextSplitter", value="langchain_character"),
            ConfigFieldOption(label="Embedding+语义聚类", value="semantic_cluster"),
            ConfigFieldOption(label="LlamaIndex-自定义", value="llamaindex_custom"),
        ],
        description="选择分块实现工具",
        group="基本设置"
    ),
    ConfigField(
        name="chunk_goal",
        label="分块目标",
        type="checkbox",
        default=["semantic_integrity", "overlap"],
        options=[
            ConfigFieldOption(label="保持段落/语义完整性", value="semantic_integrity"),
            ConfigFieldOption(label="建立块之间的关联关系", value="overlap"),
            ConfigFieldOption(label="附加元数据", value="meta"),
        ],
        description="分块的目标，可多选",
        group="分块目标"
    ),
    ConfigField(
        name="token_size",
        label="Token数",
        type="number",
        default=500,
        min=100,
        max=5000,
        step=100,
        description="每块的Token数，仅在按Token分块时有效",
        group="高级参数",
        dependencies=ConfigDependency(field="chunk_method", value=["fixed_token"])
    ),
    ConfigField(
        name="char_size",
        label="字符数",
        type="number",
        default=2000,
        min=100,
        max=10000,
        step=100,
        description="每块的字符数，仅在按字符分块时有效",
        group="高级参数",
        dependencies=ConfigDependency(field="chunk_method", value=["fixed_char"])
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
        group="高级参数"
    ),
]

STORE_CONFIG = ConfigParams(
    name="Store",
    description="分块配置，支持多种分块方式、目标和工具",
    icon="file-chunk",
    fields=STORE_FIELDS,
    default_config={field.name: field.default for field in STORE_FIELDS},
    allowed_extensions=["*"],
    group_order=[
        "基本设置",
        # "分块目标",
        "高级参数",
    ]
)

def get_default_config() -> ConfigParams:
    """获取默认分块配置"""
    return STORE_CONFIG