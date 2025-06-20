import type { DocumentStatus } from "@/types/commonConfig";

export interface VecStore {
  id: number;
  filename: string;
  file_type: string;
  file_size: number;
  file_path: string;
  status: DocumentStatus;
  doc_metadata?: Record<string, string | number | boolean>;
  created_at: string;
  updated_at: string;
  processed_at?: string;
  error_message?: string;
}

export interface VecStoreMetaData {
  source?: string;     // 文档来源
  page?: number;       // 页码（如果有）
  chunk_id?: number;   // 分块ID
  [key: string]: string | number | boolean | undefined;
}

export interface LangChainVecStore {
  id: number;
  content: string;
  page_content: string;  // 文档内容
  metadata: VecStoreMetaData;
}
