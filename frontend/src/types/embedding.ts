import type { DocumentStatus } from "@/types/commonConfig";

export interface Embedding {
  id: number;
  embedding: number[];
  status: DocumentStatus;
  created_at: string;
  updated_at: string;
}

export interface EmbeddingMetaData {
  source?: string;     // 文档来源
  page?: number;       // 页码（如果有）
  embedding_id?: number;   // 嵌入ID
  chunk_id?: number;   // 分块ID
  [key: string]: string | number | boolean | undefined;
}

export interface LangChainEmbedding {
  id: number;
  content: string;
  embedding: number[];  // 嵌入向量
  metadata: EmbeddingMetaData;
}
