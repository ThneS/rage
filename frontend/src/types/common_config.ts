export interface ConfigFieldOption {
  label: string;
  value: any;
  description?: string;
}

export interface ConfigField {
  name: string;
  label: string;
  type: 'switch' | 'select' | 'radio' | 'number' | 'text' | 'textarea' | 'range';
  description?: string;
  default: any;
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
  dependencies?: Record<string, any>;
}

export type DocumentStatus =
  | 'pending'
  | 'loaded'
  | 'chunked'
  | 'embedded'
  | 'indexed'
  | 'error';

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
  indexed: { color: 'green', iconType: 'CheckCircleOutlined', text: '已索引' },
  error: { color: 'error', iconType: 'CloseCircleOutlined', text: '错误' },
};