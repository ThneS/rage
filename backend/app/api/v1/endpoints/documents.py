from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Body
from sqlalchemy.orm import Session
import json
import logging
from app.core.database import get_db
from app.core.document_config import get_file_type_config
from app.schemas.document import (
    Document,
    DocumentLoadConfig,
    FileTypeConfigResponse
)
from app.services.document_service import DocumentService
from app.schemas.response import ResponseModel

# 配置日志
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/upload", response_model=ResponseModel[Document])
async def upload_document(
    file: UploadFile = File(..., description="要上传的文件"),
    metadata: Optional[str] = Form(None, description="文档元数据，JSON格式字符串"),
    db: Session = Depends(get_db)
) -> ResponseModel[Document]:
    """处理文档上传请求

    接受文件和元数据，返回创建的文档对象。
    支持的文件类型：PDF、Word、Excel、CSV、图片等。

    Args:
        file: 要上传的文件
        metadata: 文档元数据，可选，JSON格式字符串
        db: 数据库会话

    Returns:
        ResponseModel[Document]: 创建的文档对象

    Raises:
        HTTPException:
            - 400: 文件类型不支持
            - 422: 请求数据格式错误
            - 500: 服务器内部错误
    """
    try:
        # 验证文件
        if not file.filename:
            raise HTTPException(
                status_code=422,
                detail="文件名不能为空"
            )

        if not file.content_type:
            raise HTTPException(
                status_code=422,
                detail="文件类型不能为空"
            )

        # 处理元数据
        metadata_dict = None
        if metadata:
            try:
                metadata_dict = json.loads(metadata)
                if not isinstance(metadata_dict, dict):
                    raise ValueError("元数据必须是JSON对象")
            except json.JSONDecodeError as e:
                raise HTTPException(
                    status_code=422,
                    detail=f"元数据JSON格式错误: {str(e)}"
                )
            except ValueError as e:
                raise HTTPException(
                    status_code=422,
                    detail=str(e)
                )

        # 创建文档
        service = DocumentService(db)
        doc = await service.create_document(file, metadata_dict)
        doc_pydantic = Document.model_validate(doc)
        return ResponseModel[Document](data=doc_pydantic)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"上传文档失败: {str(e)}"
        )

@router.get("/", response_model=ResponseModel[List[Document]])
def get_documents(
    db: Session = Depends(get_db)
):
    """获取文档列表"""
    service = DocumentService(db)
    docs = service.get_documents()
    docs_pydantic = [Document.model_validate(doc) for doc in docs]
    return ResponseModel[List[Document]](data=docs_pydantic)

@router.get("/{document_id}/load-config", response_model=ResponseModel[FileTypeConfigResponse])
async def get_load_config(
    document_id: int,
    db: Session = Depends(get_db)
) -> ResponseModel[FileTypeConfigResponse]:
    """获取文档加载配置

    根据文档的文件类型返回对应的加载配置，包括：
    - 文件类型名称和描述
    - 配置字段定义（包括字段类型、默认值、验证规则等）
    - 默认配置值

    Args:
        document_id: 文档ID
        db: 数据库会话

    Returns:
        ResponseModel[FileTypeConfigResponse]: 文件类型配置信息

    Raises:
        HTTPException:
            - 404: 文档不存在
            - 400: 文件类型不支持
            - 500: 服务器内部错误
    """
    logger.info(f"开始获取文档配置: document_id={document_id}")

    try:
        # 获取文档信息
        logger.debug(f"正在获取文档信息: document_id={document_id}")
        service = DocumentService(db)

        try:
            document = service.get_document(document_id)
        except Exception as e:
            logger.error(f"获取文档信息时发生异常: document_id={document_id}, error={str(e)}", exc_info=True)
            if isinstance(e, HTTPException):
                raise
            raise HTTPException(
                status_code=500,
                detail=f"获取文档信息失败: {str(e)}"
            )

        # 如果文档不存在，返回 404 错误
        if not document:
            logger.warning(f"文档不存在: document_id={document_id}")
            raise HTTPException(
                status_code=404,
                detail=f"文档不存在: ID={document_id}"
            )

        logger.debug(f"文档信息获取成功: document_id={document_id}, file_type={document.file_type}")

        # 获取文件类型配置
        try:
            logger.debug(f"正在获取文件类型配置: file_type={document.file_type}")
            config = get_file_type_config(document.file_type)
            logger.debug(f"文件类型配置获取成功: file_type={document.file_type}")
        except ValueError as e:
            logger.warning(f"不支持的文件类型: document_id={document_id}, file_type={document.file_type}, error={str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"不支持的文件类型: {document.file_type}, 错误: {str(e)}"
            )
        except Exception as e:
            logger.error(f"获取文件类型配置时发生异常: document_id={document_id}, error={str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=f"获取文件类型配置失败: {str(e)}"
            )

        # 返回配置信息
        try:
            response = FileTypeConfigResponse(
                name=config.name,
                description=config.description,
                icon=config.icon,
                fields=config.fields,
                default_config=config.default_config,
                group_order=config.group_order
            )
            logger.info(f"成功生成配置响应: document_id={document_id}")
            return ResponseModel[FileTypeConfigResponse](data=response)
        except Exception as e:
            logger.error(f"生成配置响应失败: document_id={document_id}, error={str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=f"生成配置响应失败: {str(e)}"
            )

    except HTTPException as e:
        # 记录 HTTP 异常并重新抛出
        logger.error(f"HTTP异常: document_id={document_id}, status_code={e.status_code}, detail={e.detail}")
        # 确保异常状态码被保留
        raise HTTPException(
            status_code=e.status_code,
            detail=e.detail
        )
    except Exception as e:
        # 记录未预期的异常
        logger.error(f"未预期的异常: document_id={document_id}, error={str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"获取配置失败: {str(e)}"
        )

# delete 接口
@router.delete("/{document_id}", response_model=ResponseModel[Document])
def delete_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """删除文档"""
    service = DocumentService(db)
    service.delete_document(document_id)
    return ResponseModel[Document](data=None)

@router.post("/{document_id}/parse", response_model=ResponseModel[Document])
def process_document(
    document_id: int,
    config: DocumentLoadConfig = Body(..., description="加载配置参数"),
    db: Session = Depends(get_db)
):
    """
    处理文档（解析和分块），参数结构与 load-config 返回一致
    """
    # 获取文档类型配置
    service = DocumentService(db)
    try:
        document = service.get_document(document_id)
    except Exception as e:
        logger.error(f"获取文档信息时发生异常: document_id={document_id}, error={str(e)}", exc_info=True)
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(
            status_code=500,
            detail=f"获取文档信息失败: {str(e)}"
        )

    doc = service.parse_document(document=document, config=config)
    doc_pydantic = Document.model_validate(doc)
    return ResponseModel[Document](data=doc_pydantic)
