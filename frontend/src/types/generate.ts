import type { DocumentStatus } from "@/types/commonConfig";

export interface Generate {
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

export interface GenerateMetaData {
  source?: string;     // 文档来源
  page?: number;       // 页码（如果有）
  generate_id?: number;   // 分块ID
}

export interface LangChainGenerate {
  page_content: string;  // 文档内容
  metadata: GenerateMetaData;
}
