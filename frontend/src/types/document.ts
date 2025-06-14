export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Document {
  id: number;
  filename: string;
  file_type: string;
  file_size: number;
  file_path: string;
  status: DocumentStatus;
  doc_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  processed_at?: string;
  error_message?: string;
}

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

export interface FileTypeConfigResponse {
  name: string;
  description: string;
  icon?: string;
  fields: ConfigField[];
  default_config: Record<string, any>;
  group_order: string[];
}

export interface DocumentLoadConfig extends FileTypeConfigResponse {
  [key: string]: any;  // 允许动态配置项
}