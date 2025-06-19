from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import documents, chunks, embeddings, store
from app.core.database import engine, Base
from fastapi.responses import JSONResponse
from fastapi import Request, HTTPException
from app.exceptions import APIException
import os
from dotenv import load_dotenv
import logging
from contextlib import asynccontextmanager

# 配置日志
logger = logging.getLogger(__name__)

def load_env():
    """加载环境变量配置"""
    env_file = os.getenv("ENV_FILE", ".env")
    if os.path.exists(env_file):
        logger.info(f"正在加载环境变量文件: {env_file}")
        load_dotenv(env_file)
    else:
        logger.warning(f"环境变量文件不存在: {env_file}，将使用系统环境变量")
    required_env_vars = [
        "OPENAI_API_KEY",
        "OPENAI_API_BASE"
    ]
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    if missing_vars:
        logger.warning(f"以下必要的环境变量未设置: {', '.join(missing_vars)}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 初始化逻辑
    load_env()
    Base.metadata.create_all(bind=engine)
    logger.info("应用初始化完成")
    yield
    # 可选：关闭资源等清理逻辑

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
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

app.include_router(
    chunks.router,
    prefix=f"{settings.API_V1_STR}/chunks",
    tags=["chunks"]
)

app.include_router(
    embeddings.router,
    prefix=f"{settings.API_V1_STR}/embeddings",
    tags=["embeddings"]
)
app.include_router(
    store.router,
    prefix=f"{settings.API_V1_STR}/store",
    tags=["store"]
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