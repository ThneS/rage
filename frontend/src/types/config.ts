// 后端配置类型
export interface ModelConfig {
  openai: Record<string, string | number | boolean>;
  deepseek: Record<string, string | number | boolean>;
  anthropic: Record<string, string | number | boolean>;
  local: Record<string, string | number | boolean>;
}

export interface ConnectionConfig {
  host: string;
  port: number;
  timeout: number;
  retry_count: number;
}

export interface SystemConfig {
  debug: boolean;
  log_level: string;
  max_file_size: number;
  allowed_file_types: string[];
}

export interface AllConfig {
  model: ModelConfig;
  connection: ConnectionConfig;
  system: SystemConfig;
}

// 前端配置类型
export interface FrontendConfig {
  connection: {
    host: string;
    port: number;
    protocol: 'http' | 'https';
  };
  theme: {
    mode: 'light' | 'dark';
    primaryColor: string;
  };
  language: 'zh-CN' | 'en-US';
  autoSave: boolean;
  showNotifications: boolean;
}

// 默认前端配置
export const defaultFrontendConfig: FrontendConfig = {
  connection: {
    host: 'localhost',
    port: 8000,
    protocol: 'http'
  },
  theme: {
    mode: 'light',
    primaryColor: '#1890ff'
  },
  language: 'zh-CN',
  autoSave: true,
  showNotifications: true
};