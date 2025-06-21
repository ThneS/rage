from fastapi import APIRouter
from app.schemas.common_config import ConfigParams
from app.schemas.generate import GenerateRequest, GenerateResult
from app.services import generate as generate_service
from app.schemas.response import ResponseModel

router = APIRouter()

@router.get("/{document_id}/config", response_model=ResponseModel[ConfigParams])
def get_generate_config(document_id: int):
    """
    获取生成步骤的配置
    """
    config = generate_service.get_config(document_id)
    return ResponseModel[ConfigParams](data=config)

@router.post("/{document_id}/generate", response_model=ResponseModel[GenerateResult])
def generate(document_id: int, request: GenerateRequest):
    """
    执行生成
    """
    result = generate_service.generate(document_id, request)
    return ResponseModel[GenerateResult](data=result)
