from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class ConfigBase(BaseModel):
    key: str = Field(..., description="配置键")
    value: Dict[str, Any] = Field(..., description="配置值")
    description: Optional[str] = Field(None, description="配置描述")

class ConfigCreate(ConfigBase):
    pass

class ConfigUpdate(BaseModel):
    value: Dict[str, Any] = Field(..., description="配置值")
    description: Optional[str] = Field(None, description="配置描述")

class Config(ConfigBase):
    id: int = Field(..., description="配置ID")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")

    class Config:
        from_attributes = True

# 模型配置 Schema
class ModelConfig(BaseModel):
    """模型配置"""
    openai: Dict[str, Any] = Field(default_factory=dict, description="OpenAI 配置")
    deepseek: Dict[str, Any] = Field(default_factory=dict, description="DeepSeek 配置")
    anthropic: Dict[str, Any] = Field(default_factory=dict, description="Anthropic 配置")
    local: Dict[str, Any] = Field(default_factory=dict, description="本地模型配置")

class ConnectionConfig(BaseModel):
    """连接配置"""
    host: str = Field(default="localhost", description="主机地址")
    port: int = Field(default=8000, description="端口号")
    timeout: int = Field(default=30, description="超时时间（秒）")
    retry_count: int = Field(default=3, description="重试次数")

class SystemConfig(BaseModel):
    """系统配置"""
    debug: bool = Field(default=False, description="调试模式")
    log_level: str = Field(default="INFO", description="日志级别")
    max_file_size: int = Field(default=100 * 1024 * 1024, description="最大文件大小（字节）")
    allowed_file_types: list = Field(default_factory=list, description="允许的文件类型")

class AllConfig(BaseModel):
    """所有配置"""
    model: ModelConfig = Field(default_factory=ModelConfig, description="模型配置")
    connection: ConnectionConfig = Field(default_factory=ConnectionConfig, description="连接配置")
    system: SystemConfig = Field(default_factory=SystemConfig, description="系统配置")