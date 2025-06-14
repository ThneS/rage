from typing import Dict, Any, Type, List, Union, Literal, Optional
from pydantic import BaseModel, Field

class ConfigFieldOption(BaseModel):
    """配置选项"""
    label: str = Field(..., description="选项标签")
    value: Any = Field(..., description="选项值")
    description: Optional[str] = Field(None, description="选项描述")

class ConfigField(BaseModel):
    """配置字段定义"""
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

class FileTypeConfig(BaseModel):
    """文件类型配置"""
    name: str = Field(..., description="文件类型名称")
    description: str = Field(..., description="文件类型描述")
    allowed_extensions: List[str] = Field(..., description="允许的文件扩展名")
    icon: Optional[str] = Field(None, description="文件类型图标")
    fields: List[ConfigField] = Field(..., description="配置字段列表")
    default_config: Dict[str, Any] = Field(..., description="默认配置值")

# PDF配置字段
PDF_FIELDS = [
    ConfigField(
        name="loader_tool",
        label="加载工具",
        type="select",
        description="选择用于解析PDF的工具链",
        default="langchain",
        options=[
            ConfigFieldOption(label="LangChain", value="langchain"),
            ConfigFieldOption(label="PyPDF", value="pypdf"),
            ConfigFieldOption(label="pdfplumber", value="pdfplumber"),
            ConfigFieldOption(label="PyMuPDF", value="pymupdf"),
            ConfigFieldOption(label="Unstructured", value="unstructured"),
            ConfigFieldOption(label="LlamaParse", value="llamaParse"),
        ],
        group="基本设置"
    ),
    ConfigField(
        name="extract_text",
        label="提取文本",
        type="switch",
        description="是否提取文档中的文本内容",
        default=True,
        group="基本设置"
    ),
    ConfigField(
        name="extract_images",
        label="提取图片",
        type="switch",
        description="是否提取文档中的图片",
        default=False,
        group="基本设置"
    ),
    ConfigField(
        name="extract_tables",
        label="提取表格",
        type="switch",
        description="是否提取文档中的表格",
        default=True,
        group="表格设置"
    ),
    ConfigField(
        name="table_tool",
        label="表格解析工具",
        type="select",
        description="选择用于表格解析的工具",
        default="camelot",
        options=[
            ConfigFieldOption(label="Camelot", value="camelot"),
            ConfigFieldOption(label="Tabula", value="tabula"),
            ConfigFieldOption(label="Unstructured", value="unstructured"),
            ConfigFieldOption(label="LlamaParse", value="llamaParse"),
        ],
        group="表格设置",
        dependencies={"field": "extract_tables", "value": True}
    ),
    ConfigField(
        name="merge_tables",
        label="合并跨页表格",
        type="switch",
        description="是否自动合并跨页表格",
        default=False,
        group="表格设置",
        dependencies={"field": "extract_tables", "value": True}
    ),
    ConfigField(
        name="ocr_enabled",
        label="启用OCR",
        type="switch",
        description="是否启用OCR识别图片中的文字",
        default=False,
        group="OCR设置"
    ),
    ConfigField(
        name="ocr_engine",
        label="OCR引擎",
        type="select",
        description="选择OCR引擎",
        default="pytesseract",
        options=[
            ConfigFieldOption(label="Tesseract", value="pytesseract"),
            ConfigFieldOption(label="EasyOCR", value="easyocr"),
        ],
        group="OCR设置",
        dependencies={"field": "ocr_enabled", "value": True}
    ),
    ConfigField(
        name="ocr_language",
        label="OCR语言",
        type="select",
        description="OCR识别的语言",
        default="chi_sim+eng",
        options=[
            ConfigFieldOption(label="中文简体", value="chi_sim"),
            ConfigFieldOption(label="英文", value="eng"),
            ConfigFieldOption(label="中英混合", value="chi_sim+eng"),
        ],
        dependencies={"field": "ocr_enabled", "value": True},
        group="OCR设置"
    ),
    ConfigField(
        name="ocr_threshold",
        label="OCR二值化阈值",
        type="number",
        description="OCR前图片二值化阈值",
        default=128,
        min=0,
        max=255,
        step=1,
        group="OCR设置",
        dependencies={"field": "ocr_enabled", "value": True}
    ),
    ConfigField(
        name="page_range",
        label="页码范围",
        type="text",
        description="要处理的页码范围，例如：1-5,7,9-12",
        default="all",
        placeholder="all 或 1-5,7,9-12",
        group="页面设置"
    ),
    ConfigField(
        name="split_by_page",
        label="按页分割",
        type="switch",
        description="是否按页分割文档",
        default=False,
        group="页面设置"
    ),
    ConfigField(
        name="password",
        label="文档密码",
        type="text",
        description="PDF文档的密码（如果有）",
        default=None,
        placeholder="请输入PDF密码",
        group="安全设置"
    ),
]

# Word配置字段
WORD_FIELDS = [
    ConfigField(
        name="extract_text",
        label="提取文本",
        type="switch",
        description="是否提取文档中的文本内容",
        default=True,
        group="基本设置"
    ),
    ConfigField(
        name="extract_images",
        label="提取图片",
        type="switch",
        description="是否提取文档中的图片",
        default=True,
        group="基本设置"
    ),
    ConfigField(
        name="extract_tables",
        label="提取表格",
        type="switch",
        description="是否提取文档中的表格",
        default=True,
        group="基本设置"
    ),
    ConfigField(
        name="extract_headers",
        label="提取页眉",
        type="switch",
        description="是否提取文档的页眉",
        default=True,
        group="格式设置"
    ),
    ConfigField(
        name="extract_footers",
        label="提取页脚",
        type="switch",
        description="是否提取文档的页脚",
        default=True,
        group="格式设置"
    ),
    ConfigField(
        name="extract_comments",
        label="提取批注",
        type="switch",
        description="是否提取文档中的批注",
        default=False,
        group="格式设置"
    )
]

# Excel配置字段
EXCEL_FIELDS = [
    ConfigField(
        name="extract_sheets",
        label="工作表",
        type="select",
        description="要提取的工作表",
        default="all",
        options=[
            ConfigFieldOption(label="所有工作表", value="all", description="提取所有工作表"),
            ConfigFieldOption(label="当前工作表", value="current", description="仅提取当前工作表"),
        ],
        group="基本设置"
    ),
    ConfigField(
        name="extract_formulas",
        label="提取公式",
        type="switch",
        description="是否提取单元格中的公式",
        default=False,
        group="内容设置"
    ),
    ConfigField(
        name="extract_charts",
        label="提取图表",
        type="switch",
        description="是否提取工作表中的图表",
        default=False,
        group="内容设置"
    ),
    ConfigField(
        name="header_row",
        label="表头行号",
        type="number",
        description="表格的表头所在行号（从0开始）",
        default=0,
        min=0,
        group="表格设置"
    ),
    ConfigField(
        name="skip_empty_rows",
        label="跳过空行",
        type="switch",
        description="是否跳过空行",
        default=True,
        group="表格设置"
    )
]

# CSV配置字段
CSV_FIELDS = [
    ConfigField(
        name="delimiter",
        label="分隔符",
        type="select",
        description="CSV文件的分隔符",
        default=",",
        options=[
            ConfigFieldOption(label="逗号", value=",", description="使用逗号作为分隔符"),
            ConfigFieldOption(label="制表符", value="\t", description="使用制表符作为分隔符"),
            ConfigFieldOption(label="分号", value=";", description="使用分号作为分隔符"),
        ],
        group="基本设置"
    ),
    ConfigField(
        name="encoding",
        label="文件编码",
        type="select",
        description="CSV文件的编码格式",
        default="utf-8",
        options=[
            ConfigFieldOption(label="UTF-8", value="utf-8", description="UTF-8编码"),
            ConfigFieldOption(label="GBK", value="gbk", description="GBK编码"),
            ConfigFieldOption(label="GB2312", value="gb2312", description="GB2312编码"),
        ],
        group="基本设置"
    ),
    ConfigField(
        name="has_header",
        label="包含表头",
        type="switch",
        description="CSV文件是否包含表头行",
        default=True,
        group="表格设置"
    ),
    ConfigField(
        name="skip_empty_rows",
        label="跳过空行",
        type="switch",
        description="是否跳过空行",
        default=True,
        group="表格设置"
    )
]

# 图片配置字段
IMAGE_FIELDS = [
    ConfigField(
        name="ocr_enabled",
        label="启用OCR",
        type="switch",
        description="是否启用OCR识别图片中的文字",
        default=True,
        group="OCR设置"
    ),
    ConfigField(
        name="ocr_language",
        label="OCR语言",
        type="select",
        description="OCR识别的语言",
        default="chi_sim+eng",
        options=[
            ConfigFieldOption(label="中文简体", value="chi_sim", description="简体中文"),
            ConfigFieldOption(label="英文", value="eng", description="英语"),
            ConfigFieldOption(label="中文简体+英文", value="chi_sim+eng", description="简体中文和英语"),
        ],
        dependencies={"field": "ocr_enabled", "value": True},
        group="OCR设置"
    ),
    ConfigField(
        name="extract_metadata",
        label="提取元数据",
        type="switch",
        description="是否提取图片的元数据（如EXIF信息）",
        default=True,
        group="基本设置"
    ),
    ConfigField(
        name="resize",
        label="调整大小",
        type="switch",
        description="是否调整图片大小",
        default=False,
        group="图片处理"
    ),
    ConfigField(
        name="max_size",
        label="最大尺寸",
        type="text",
        description="图片的最大尺寸，格式：宽,高",
        default=None,
        placeholder="例如：1920,1080",
        dependencies={"field": "resize", "value": True},
        group="图片处理"
    )
]

# 具体文件类型配置
PDF_CONFIG = FileTypeConfig(
    name="PDF文档",
    description="支持PDF格式文档的加载和处理，支持多种工具链（LangChain、PyPDF、pdfplumber、PyMuPDF、Unstructured、LlamaParse）及OCR、表格解析等高级功能。",
    allowed_extensions=["pdf"],
    icon="file-pdf",
    fields=PDF_FIELDS,
    default_config={field.name: field.default for field in PDF_FIELDS}
)

WORD_CONFIG = FileTypeConfig(
    name="Word文档",
    description="支持Word格式文档的加载和处理",
    allowed_extensions=["docx"],
    icon="file-word",
    fields=WORD_FIELDS,
    default_config={field.name: field.default for field in WORD_FIELDS}
)

EXCEL_CONFIG = FileTypeConfig(
    name="Excel表格",
    description="支持Excel格式表格的加载和处理",
    allowed_extensions=["xlsx"],
    icon="file-excel",
    fields=EXCEL_FIELDS,
    default_config={field.name: field.default for field in EXCEL_FIELDS}
)

CSV_CONFIG = FileTypeConfig(
    name="CSV文件",
    description="支持CSV格式文件的加载和处理",
    allowed_extensions=["csv"],
    icon="file-csv",
    fields=CSV_FIELDS,
    default_config={field.name: field.default for field in CSV_FIELDS}
)

IMAGE_CONFIG = FileTypeConfig(
    name="图片文件",
    description="支持常见图片格式的加载和处理",
    allowed_extensions=["jpg", "jpeg", "png"],
    icon="file-image",
    fields=IMAGE_FIELDS,
    default_config={field.name: field.default for field in IMAGE_FIELDS}
)

# 文件类型配置映射
FILE_TYPE_CONFIGS: Dict[str, FileTypeConfig] = {
    "pdf": PDF_CONFIG,
    "docx": WORD_CONFIG,
    "xlsx": EXCEL_CONFIG,
    "csv": CSV_CONFIG,
    "jpg": IMAGE_CONFIG,
    "jpeg": IMAGE_CONFIG,
    "png": IMAGE_CONFIG
}

def get_file_type_config(file_ext: str) -> FileTypeConfig:
    """获取文件类型配置

    Args:
        file_ext: 文件扩展名（不包含点号）

    Returns:
        FileTypeConfig: 文件类型配置

    Raises:
        ValueError: 当文件类型不支持时抛出
    """
    # 规范化文件扩展名
    file_ext = file_ext.strip().lower().lstrip('.')

    if not file_ext:
        raise ValueError("文件类型不能为空")

    # 检查文件类型是否支持
    if file_ext not in FILE_TYPE_CONFIGS:
        supported_types = ", ".join(sorted(FILE_TYPE_CONFIGS.keys()))
        raise ValueError(
            f"不支持的文件类型: {file_ext}。"
            f"支持的文件类型: {supported_types}"
        )

    # 获取配置
    config = FILE_TYPE_CONFIGS[file_ext]

    # 验证配置完整性
    if not config.name:
        raise ValueError(f"文件类型 {file_ext} 的配置不完整: 缺少名称")
    if not config.description:
        raise ValueError(f"文件类型 {file_ext} 的配置不完整: 缺少描述")
    if not config.fields:
        raise ValueError(f"文件类型 {file_ext} 的配置不完整: 缺少字段定义")
    if not config.default_config:
        raise ValueError(f"文件类型 {file_ext} 的配置不完整: 缺少默认配置")

    return config

def get_default_load_config(file_ext: str) -> Dict[str, Any]:
    """根据文件类型获取默认加载配置"""
    config = get_file_type_config(file_ext)
    return config.default_config