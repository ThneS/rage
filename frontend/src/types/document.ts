export interface Document {
  id: number;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  upload_time: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
  updated_at: string;
  doc_metadata?: Record<string, any>;
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
  required: boolean;
  options?: ConfigFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  rows?: number;
  disabled: boolean;
  hidden: boolean;
  group?: string;
  dependencies?: {
    field: string;
    value: any;
  };
}

export interface FileTypeConfigResponse {
  name: string;
  description: string;
  icon?: string;
  fields: ConfigField[];
  default_config: Record<string, any>;
}