export interface ConfigFieldOption {
  label: string;
  value: string | number | boolean;
  description?: string;
}

export interface ConfigDependency {
  field: string;
  value: string | number | boolean;
}

export interface ConfigField {
  name: string;
  label: string;
  type: 'switch' | 'select' | 'radio' | 'number' | 'text' | 'textarea' | 'range' | 'checkbox';
  description?: string;
  default: string | number | boolean;
  required?: boolean;
  options?: ConfigFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  hidden?: boolean;
  group?: string;
  dependencies?: ConfigDependency;
}

export interface ConfigParams {
  name: string;
  description: string;
  icon?: string;
  fields: ConfigField[];
  default_config: Record<string, string | number | boolean>;
  group_order: string[];
}

export const DocumentStatus = {
  PENDING: 'pending',
  LOADED: 'loaded',
  CHUNKED: 'chunked',
  EMBEDDED: 'embedded',
  STORED: 'stored',
  ERROR: 'error',
} as const;

export type DocumentStatus = typeof DocumentStatus[keyof typeof DocumentStatus];

export interface StatusConfig {
  color: string;
  iconType: string;
  text: string;
}

export const documentStatusConfig: Record<DocumentStatus, StatusConfig> = {
  pending: { color: 'default', iconType: 'ClockCircleOutlined', text: '待处理' },
  loaded: { color: 'blue', iconType: 'CheckCircleOutlined', text: '已加载' },
  chunked: { color: 'cyan', iconType: 'CheckCircleOutlined', text: '已分块' },
  embedded: { color: 'purple', iconType: 'CheckCircleOutlined', text: '已嵌入' },
  stored: { color: 'green', iconType: 'CheckCircleOutlined', text: '已存储' },
  error: { color: 'error', iconType: 'CloseCircleOutlined', text: '错误' },
};