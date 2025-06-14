from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import documents
from app.core.database import engine, Base
from fastapi.responses import JSONResponse
from fastapi import Request, HTTPException
from app.exceptions import APIException
import os
from dotenv import load_dotenv
import logging

# 配置日志
logger = logging.getLogger(__name__)

# 加载环境变量
def load_env():
    """加载环境变量配置"""
    # 获取环境变量文件路径
    env_file = os.getenv("ENV_FILE", ".env")

    # 尝试加载环境变量文件
    if os.path.exists(env_file):
        logger.info(f"正在加载环境变量文件: {env_file}")
        load_dotenv(env_file)
    else:
        logger.warning(f"环境变量文件不存在: {env_file}，将使用系统环境变量")

    # 验证必要的环境变量
    required_env_vars = [
        "OPENAI_API_KEY",
        "OPENAI_API_BASE"
    ]

    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    if missing_vars:
        logger.warning(f"以下必要的环境变量未设置: {', '.join(missing_vars)}")

# 加载环境变量
load_env()

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(
    documents.router,
    prefix=f"{settings.API_V1_STR}/documents",
    tags=["documents"]
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to RAG Parameter Tuning System API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.exception_handler(APIException)
async def api_exception_handler(request: Request, exc: APIException):
    return JSONResponse(
        status_code=200,
        content={
            "code": exc.code,
            "message": exc.message,
            "data": None
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.status_code,
            "message": exc.detail,
            "data": None
        }
    )