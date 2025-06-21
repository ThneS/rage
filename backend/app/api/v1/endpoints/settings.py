from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.config import ConfigService
from app.schemas.config import AllConfig, ModelConfig, ConnectionConfig, SystemConfig
from app.schemas.response import ResponseModel
from typing import Dict, Any

router = APIRouter()

@router.get("/all", response_model=ResponseModel[AllConfig])
def get_all_config(db: Session = Depends(get_db)):
    """获取所有配置"""
    service = ConfigService(db)
    config = service.get_all_config()
    return ResponseModel[AllConfig](data=config)

@router.put("/all", response_model=ResponseModel[Dict[str, Any]])
def update_all_config(config: AllConfig, db: Session = Depends(get_db)):
    """更新所有配置"""
    service = ConfigService(db)
    result = service.set_all_config(config)
    return ResponseModel[Dict[str, Any]](data={"message": "配置更新成功"})

@router.get("/model", response_model=ResponseModel[ModelConfig])
def get_model_config(db: Session = Depends(get_db)):
    """获取模型配置"""
    service = ConfigService(db)
    config = service.get_model_config()
    return ResponseModel[ModelConfig](data=config)

@router.put("/model", response_model=ResponseModel[Dict[str, Any]])
def update_model_config(config: ModelConfig, db: Session = Depends(get_db)):
    """更新模型配置"""
    service = ConfigService(db)
    service.set_model_config(config)
    return ResponseModel[Dict[str, Any]](data={"message": "模型配置更新成功"})

@router.get("/connection", response_model=ResponseModel[ConnectionConfig])
def get_connection_config(db: Session = Depends(get_db)):
    """获取连接配置"""
    service = ConfigService(db)
    config = service.get_connection_config()
    return ResponseModel[ConnectionConfig](data=config)

@router.put("/connection", response_model=ResponseModel[Dict[str, Any]])
def update_connection_config(config: ConnectionConfig, db: Session = Depends(get_db)):
    """更新连接配置"""
    service = ConfigService(db)
    service.set_connection_config(config)
    return ResponseModel[Dict[str, Any]](data={"message": "连接配置更新成功"})

@router.get("/system", response_model=ResponseModel[SystemConfig])
def get_system_config(db: Session = Depends(get_db)):
    """获取系统配置"""
    service = ConfigService(db)
    config = service.get_system_config()
    return ResponseModel[SystemConfig](data=config)

@router.put("/system", response_model=ResponseModel[Dict[str, Any]])
def update_system_config(config: SystemConfig, db: Session = Depends(get_db)):
    """更新系统配置"""
    service = ConfigService(db)
    service.set_system_config(config)
    return ResponseModel[Dict[str, Any]](data={"message": "系统配置更新成功"})

@router.post("/init", response_model=ResponseModel[Dict[str, Any]])
def init_default_configs(db: Session = Depends(get_db)):
    """初始化默认配置"""
    service = ConfigService(db)
    service.load_default_configs()
    return ResponseModel[Dict[str, Any]](data={"message": "默认配置初始化成功"})