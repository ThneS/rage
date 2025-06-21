import json
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.config import Config
from app.schemas.config import ConfigCreate, ConfigUpdate, AllConfig, ModelConfig, ConnectionConfig, SystemConfig
from fastapi import HTTPException

class ConfigService:
    def __init__(self, db: Session):
        self.db = db

    def get_config(self, key: str) -> Optional[Dict[str, Any]]:
        """获取配置"""
        config = self.db.query(Config).filter(Config.key == key).first()
        if config:
            try:
                return json.loads(config.value)
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail=f"配置 {key} 格式错误")
        return None

    def set_config(self, key: str, value: Dict[str, Any], description: Optional[str] = None) -> Config:
        """设置配置"""
        config = self.db.query(Config).filter(Config.key == key).first()

        if config:
            # 更新现有配置
            config.value = json.dumps(value, ensure_ascii=False)
            if description:
                config.description = description
        else:
            # 创建新配置
            config = Config(
                key=key,
                value=json.dumps(value, ensure_ascii=False),
                description=description
            )
            self.db.add(config)

        self.db.commit()
        self.db.refresh(config)
        return config

    def delete_config(self, key: str) -> bool:
        """删除配置"""
        config = self.db.query(Config).filter(Config.key == key).first()
        if config:
            self.db.delete(config)
            self.db.commit()
            return True
        return False

    def get_all_configs(self) -> Dict[str, Any]:
        """获取所有配置"""
        configs = self.db.query(Config).all()
        result = {}
        for config in configs:
            try:
                result[config.key] = json.loads(config.value)
            except json.JSONDecodeError:
                # 跳过格式错误的配置
                continue
        return result

    def get_model_config(self) -> ModelConfig:
        """获取模型配置"""
        config_data = self.get_config("model_config")
        if config_data:
            return ModelConfig(**config_data)
        return ModelConfig()

    def set_model_config(self, config: ModelConfig) -> Config:
        """设置模型配置"""
        return self.set_config("model_config", config.model_dump(), "模型配置")

    def get_connection_config(self) -> ConnectionConfig:
        """获取连接配置"""
        config_data = self.get_config("connection_config")
        if config_data:
            return ConnectionConfig(**config_data)
        return ConnectionConfig()

    def set_connection_config(self, config: ConnectionConfig) -> Config:
        """设置连接配置"""
        return self.set_config("connection_config", config.model_dump(), "连接配置")

    def get_system_config(self) -> SystemConfig:
        """获取系统配置"""
        config_data = self.get_config("system_config")
        if config_data:
            return SystemConfig(**config_data)
        return SystemConfig()

    def set_system_config(self, config: SystemConfig) -> Config:
        """设置系统配置"""
        return self.set_config("system_config", config.model_dump(), "系统配置")

    def get_all_config(self) -> AllConfig:
        """获取所有配置"""
        return AllConfig(
            model=self.get_model_config(),
            connection=self.get_connection_config(),
            system=self.get_system_config()
        )

    def set_all_config(self, config: AllConfig) -> Dict[str, Config]:
        """设置所有配置"""
        return {
            "model": self.set_model_config(config.model),
            "connection": self.set_connection_config(config.connection),
            "system": self.set_system_config(config.system)
        }

    def load_default_configs(self):
        """加载默认配置"""
        # 检查是否已有配置，如果没有则创建默认配置
        if not self.get_config("model_config"):
            default_model_config = ModelConfig(
                openai={
                    "api_key": "",
                    "base_url": "https://api.openai.com/v1",
                    "model": "gpt-3.5-turbo",
                    "max_tokens": 2048
                },
                deepseek={
                    "api_key": "",
                    "base_url": "https://api.deepseek.com/v1",
                    "model": "deepseek-chat",
                    "max_tokens": 2048
                },
                anthropic={
                    "api_key": "",
                    "base_url": "https://api.anthropic.com",
                    "model": "claude-3-sonnet-20240229",
                    "max_tokens": 2048
                },
                local={
                    "base_url": "http://localhost:11434",
                    "model": "llama2",
                    "max_tokens": 2048
                }
            )
            self.set_model_config(default_model_config)

        if not self.get_config("connection_config"):
            default_connection_config = ConnectionConfig(
                host="localhost",
                port=8000,
                timeout=30,
                retry_count=3
            )
            self.set_connection_config(default_connection_config)

        if not self.get_config("system_config"):
            default_system_config = SystemConfig(
                debug=False,
                log_level="INFO",
                max_file_size=100 * 1024 * 1024,  # 100MB
                allowed_file_types=[".pdf", ".txt", ".docx", ".md"]
            )
            self.set_system_config(default_system_config)