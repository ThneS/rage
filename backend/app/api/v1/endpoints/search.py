from fastapi import APIRouter
from app.schemas.search import SearchQuery, PreProcessRequest, PostProcessRequest, PreProcessResult, PostProcessResult, ParseResult
from app.schemas.common_config import ConfigParams
from app.services import search as search_service
from app.schemas.response import ResponseModel

router = APIRouter()

@router.get("/{document_id}/pre_config", response_model=ResponseModel[ConfigParams])
def get_pre_config(document_id: int):
    """
    获取预处理步骤的配置
    """
    config = search_service.get_pre_config(document_id)
    return ResponseModel[ConfigParams](data=config)

@router.get("/{document_id}/post_config", response_model=ResponseModel[ConfigParams])
def get_post_config(document_id: int):
    """
    获取后处理步骤的配置
    """
    config = search_service.get_post_config(document_id)
    return ResponseModel[ConfigParams](data=config)

@router.post("/{document_id}/pre", response_model=ResponseModel[PreProcessResult])
def pre_process(document_id: int, request: PreProcessRequest):
    """
    执行预处理
    """
    pre_result = search_service.pre_process(document_id, request)
    return ResponseModel[PreProcessResult](data=pre_result)

@router.post("/{document_id}/post", response_model=ResponseModel[PostProcessResult])
def post_process(document_id: int, request: PostProcessRequest):
    """
    执行后处理
    """
    post_result = search_service.post_process(document_id, request)
    return ResponseModel[PostProcessResult](data=post_result)

@router.post("/{document_id}/parse", response_model=ResponseModel[ParseResult])
def parse(document_id: int, result: PostProcessResult):
    """
    执行解析
    """
    parse_result = search_service.parse(document_id, result)
    return ResponseModel[ParseResult](data=parse_result)
