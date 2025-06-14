from typing import Generator, Optional
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from fastapi import Depends, HTTPException
from app.core.config import settings
import logging

# 配置日志
logger = logging.getLogger(__name__)

# 创建数据库引擎
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    pool_pre_ping=True,  # 自动检测断开的连接
    pool_recycle=3600,   # 一小时后回收连接
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """获取数据库会话

    Yields:
        Session: 数据库会话

    Raises:
        HTTPException: 当数据库连接失败时抛出
    """
    db: Optional[Session] = None
    try:
        logger.debug("创建数据库会话")
        db = SessionLocal()
        yield db
        pass
    finally:
        if db:
            try:
                logger.debug("关闭数据库会话")
                db.close()
            except Exception as close_error:
                logger.error(f"关闭数据库会话失败: {str(close_error)}", exc_info=True)
