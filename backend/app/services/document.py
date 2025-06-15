import os
import logging
import hashlib
import json
from typing import Optional, Dict, Any, List
from datetime import datetime
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.configuration.document import get_file_type_config, get_default_load_config
from app.models.document import Document
from app.utils.file import save_upload_file, get_file_extension, delete_file
from app.schemas.document import (
    DocumentLoadConfig,
    LangChainDocument,
    DocumentStatus,
)
from app.services.parsers import LangchainParser, LlamaIndexParser

# 配置日志
logger = logging.getLogger(__name__)

class DocumentService:
    def __init__(self, db: Session):
        self.db = db
    def _compute_config_hash(self, config: Dict[str, Any]) -> str:
        """计算配置的哈希值

        Args:
            config: 配置字典

        Returns:
            str: 配置的哈希值
        """
        # 将配置转换为JSON字符串，确保键值对顺序一致
        config_str = json.dumps(config, sort_keys=True)
        # 使用SHA-256计算哈希值
        return hashlib.sha256(config_str.encode()).hexdigest()

    def get_document(self, document_id: int) -> Optional[Document]:
        """获取文档信息

        Args:
            document_id: 文档ID

        Returns:
            Document: 文档信息，如果不存在则返回 None

        Raises:
            HTTPException:
                - 404: 文档不存在
                - 400: 文件类型不支持
                - 500: 服务器内部错误
        """
        logger.debug(f"开始查询文档: document_id={document_id}")

        try:
            # 查询文档
            document = self.db.query(Document).filter(Document.id == document_id).first()

            # 如果文档不存在，直接返回 None，让调用者处理 404 错误
            if not document:
                logger.warning(f"文档不存在: document_id={document_id}")
                return None

            logger.debug(f"文档查询成功: document_id={document_id}, file_type={document.file_type}")

            # 验证文件类型
            try:
                file_ext = document.file_type.strip().lower().lstrip('.')
                if not file_ext:
                    logger.error(f"文档文件类型为空: document_id={document_id}")
                    raise HTTPException(
                        status_code=500,
                        detail=f"文档 {document_id} 的文件类型为空"
                    )
                # 尝试获取文件类型配置，验证是否支持
                logger.debug(f"验证文件类型: document_id={document_id}, file_type={file_ext}")
                get_file_type_config(file_ext)
                logger.debug(f"文件类型验证成功: document_id={document_id}, file_type={file_ext}")
            except ValueError as e:
                logger.warning(f"文件类型不支持: document_id={document_id}, file_type={file_ext}, error={str(e)}")
                raise HTTPException(
                    status_code=400,
                    detail=f"文档 {document_id} 的文件类型无效: {str(e)}"
                )
            except Exception as e:
                logger.error(f"验证文件类型时出错: document_id={document_id}, error={str(e)}")
                raise HTTPException(
                    status_code=500,
                    detail=f"验证文档 {document_id} 的文件类型时出错: {str(e)}"
                )

            return document

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"获取文档信息失败: document_id={document_id}, error={str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=f"获取文档信息失败: {str(e)}"
            )

    def get_documents(self) -> List[Document]:
        """获取所有文档列表

        Returns:
            List[Document]: 文档列表

        Raises:
            HTTPException: 当数据库查询出错时抛出
        """
        try:
            return self.db.query(Document).all()
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"获取文档列表失败: {str(e)}"
            )

    async def create_document(
        self,
        file: UploadFile,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Document:
        """创建新文档

        Args:
            file: 上传的文件
            metadata: 文档元数据

        Returns:
            Document: 创建的文档信息

        Raises:
            HTTPException: 当文件类型不支持或保存失败时抛出
        """
        try:
            # 验证文件类型
            file_ext = get_file_extension(file.filename)
            try:
                file_config = get_file_type_config(file_ext)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))

            # 保存文件
            file_path = await save_upload_file(file)

            # 创建文档记录
            db_document = Document(
                filename=file.filename,
                file_path=file_path,
                file_type=file_ext,
                file_size=os.path.getsize(file_path),
                meta_data={
                    "file_type_info": {
                        "name": file_config.name,
                        "description": file_config.description
                    },
                    **(metadata or {})
                }
            )
            self.db.add(db_document)
            self.db.commit()
            self.db.refresh(db_document)

            return db_document
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"创建文档失败: {str(e)}"
            )

    def parse_document(
        self,
        document: Document,
        config: DocumentLoadConfig
    ) -> List[LangChainDocument]:
        """处理文档

        Args:
            document_id: 文档ID
            config: 处理配置

        Returns:
            Document: 更新后的文档信息

        Raises:
            HTTPException: 当文档不存在或处理失败时抛出
        """
        try:
            file_type = document.file_type.lower()
            file_path = document.file_path

            if file_type != "pdf":
                raise HTTPException(status_code=400, detail="仅支持PDF文档处理")
            loader_tool = config.get("loader_tool", "langchain")
            parse_result: List[LangChainDocument] = []
            parser = None
            if loader_tool == "langchain":
                parser = LangchainParser()
            elif loader_tool == "llamaindex":
                parser = LlamaIndexParser()
            else:
                raise HTTPException(status_code=400, detail=f"不支持的加载工具: {loader_tool}")
            try:
                parse_result = parser.parse(file_path, config)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"处理文档失败: {str(e)}")
            # 存入 metadata
            document.meta_data = document.meta_data or {}
            document.meta_data["parse_result"] = parse_result
            # 更新文档状态
            document.status = DocumentStatus.LOADED
            # 将config转为json进行存储
            document.load_config = {
                "config": config.model_dump(),
                "hash": self._compute_config_hash(config.model_dump()),
                "created_at": datetime.now().isoformat()
            }
            self.db.commit()
            self.db.refresh(document)
            return parse_result

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"处理文档失败: {str(e)}"
            )

    def get_load_config(self, document_id: int) -> DocumentLoadConfig:
        """获取文档加载配置

        Args:
            document_id: 文档ID

        Returns:
            DocumentLoadConfig: 文档加载配置

        Raises:
            HTTPException: 当文档不存在或获取配置失败时抛出
        """
        try:
            document = self.get_document(document_id)
            if not document:
                raise HTTPException(status_code=404, detail="文档不存在")
            try:
                return get_default_load_config(document.file_type)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"获取加载配置失败: {str(e)}"
            )

    def delete_document(self, document_id: int) -> None:
        """删除文档"""
        try:
            document = self.get_document(document_id)
            if not document:
                raise HTTPException(status_code=404, detail="文档不存在")
            self.db.delete(document)
            self.db.commit()
            # upload文件夹下的文档删除
            delete_file(document.file_path)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"删除文档失败: {str(e)}"
            )