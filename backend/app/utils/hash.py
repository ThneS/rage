import hashlib
import json
from typing import Dict, Any

def compute_config_hash(config: Dict[str, Any]) -> str:
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