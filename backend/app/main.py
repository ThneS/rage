from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import documents
from app.core.database import engine, Base

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