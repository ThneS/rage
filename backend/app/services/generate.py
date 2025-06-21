from app.schemas.common_config import ConfigParams
from app.schemas.generate import GenerateRequest, GenerateResult
from app.schemas.configuration.generate import get_generate_default_config

def get_config(document_id: int) -> ConfigParams:
    """
    获取生成步骤的配置
    """
    # 这里可以根据 document_id 返回不同的配置
    return get_generate_default_config()

def generate(document_id: int, request: GenerateRequest) -> GenerateResult:
    """
    生成逻辑
    """
    # config = request.config
    text = f"这是基于文档 {document_id} 和配置 {request.config} 生成的结果。"
    return GenerateResult(text=text)
