import os
from typing import List, Optional, Dict, Any
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.document import Document, DocumentChunk, ProcessingLog
from app.schemas.document import DocumentCreate, DocumentProcessingConfig, ChunkingConfig
from app.utils.file import save_upload_file, get_file_extension

def get_parser(parser_type: str):
    if parser_type == "langchain":
        from app.services.parsers.langchain_parser import LangchainParser
        return LangchainParser()
    elif parser_type == "llamaindex":
        from app.services.parsers.llamaindex_parser import LlamaIndexParser
        return LlamaIndexParser()
    else:
        raise ValueError(f"Unsupported parser type: {parser_type}")

def get_chunker(chunker_type: str):
    if chunker_type == "llm":
        from app.services.chunkers.llm_chunker import LLMChunker
        return LLMChunker()
    else:
        raise ValueError(f"Unsupported chunker type: {chunker_type}")

class DocumentService:
    def __init__(self, db: Session):
        self.db = db

    async def create_document(
        self,
        file: UploadFile,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Document:
        # 验证文件类型
        file_ext = get_file_extension(file.filename)
        if file_ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"不支持的文件类型: {file_ext}"
            )

        # 保存文件
        file_path = await save_upload_file(file)

        # 创建文档记录
        db_document = Document(
            filename=file.filename,
            file_path=file_path,
            file_type=file_ext,
            file_size=os.path.getsize(file_path),
            doc_metadata=metadata
        )
        self.db.add(db_document)
        self.db.commit()
        self.db.refresh(db_document)

        # 创建处理日志
        self._create_processing_log(
            document_id=db_document.id,
            step="upload",
            status="success",
            message="文件上传成功"
        )

        return db_document

    def process_document(
        self,
        document_id: int,
        config: DocumentProcessingConfig
    ) -> Document:
        # 获取文档
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="文档不存在")

        try:
            # 更新状态
            document.status = "processing"
            self.db.commit()

            # 创建处理日志
            self._create_processing_log(
                document_id=document_id,
                step="parse",
                status="processing",
                message="开始解析文档"
            )

            # 获取解析器并解析文档
            parser = get_parser(config.parser)
            content = parser.parse(
                document.file_path,
                enable_table_recognition=config.enable_table_recognition,
                enable_ocr=config.enable_ocr,
                enable_image_analysis=config.enable_image_analysis,
                remove_headers_footers=config.remove_headers_footers
            )

            # 更新处理日志
            self._create_processing_log(
                document_id=document_id,
                step="parse",
                status="success",
                message="文档解析完成"
            )

            # 获取分块器并分块
            chunker = get_chunker(config.chunking_config.method)
            chunks = chunker.split(content)

            # 保存分块
            for i, chunk in enumerate(chunks):
                db_chunk = DocumentChunk(
                    document_id=document_id,
                    chunk_index=i,
                    content=chunk.content,
                    chunk_metadata=chunk.metadata
                )
                self.db.add(db_chunk)

            # 更新状态
            document.status = "completed"
            self.db.commit()

            # 创建处理日志
            self._create_processing_log(
                document_id=document_id,
                step="chunk",
                status="success",
                message=f"文档分块完成，共{len(chunks)}个块"
            )

            return document

        except Exception as e:
            # 更新状态和错误信息
            document.status = "failed"
            document.error_message = str(e)
            self.db.commit()

            # 创建错误日志
            self._create_processing_log(
                document_id=document_id,
                step="process",
                status="error",
                message=str(e)
            )

            raise HTTPException(
                status_code=500,
                detail=f"文档处理失败: {str(e)}"
            )

    def get_document(self, document_id: int) -> Document:
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="文档不存在")
        return document

    def get_document_chunks(
        self,
        document_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[DocumentChunk]:
        return self.db.query(DocumentChunk)\
            .filter(DocumentChunk.document_id == document_id)\
            .order_by(DocumentChunk.chunk_index)\
            .offset(skip)\
            .limit(limit)\
            .all()

    def _create_processing_log(
        self,
        document_id: int,
        step: str,
        status: str,
        message: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> ProcessingLog:
        log = ProcessingLog(
            document_id=document_id,
            step=step,
            status=status,
            message=message,
            log_metadata=metadata
        )
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log