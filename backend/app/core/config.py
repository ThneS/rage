from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "RAG Parameter Tuning System"

    # CORS配置
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["http://localhost:5173"]  # 前端开发服务器

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # 文件上传配置
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS: List[str] = [
        "pdf", "docx", "doc", "txt", "md", "csv", "xlsx", "xls", "html"
    ]

    # 数据库配置
    DATABASE_URL: str = "sqlite:///./rag_tuning.db"

    # 向量数据库配置
    VECTOR_DB_DIR: str = "vector_db"

    # 大模型配置
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_API_BASE: Optional[str] = None
    DEFAULT_EMBEDDING_MODEL: str = "text-embedding-ada-002"
    DEFAULT_CHAT_MODEL: str = "gpt-3.5-turbo"

    # 文档处理配置
    DEFAULT_CHUNK_SIZE: int = 1000
    DEFAULT_CHUNK_OVERLAP: int = 200
    MAX_CHUNKS_PER_DOCUMENT: int = 1000

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()