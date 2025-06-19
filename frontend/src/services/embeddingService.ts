import type { ConfigParams } from '@/types/commonConfig';
import { API_EMBEDDING_URL } from '@/constants/api';
import { get, post } from '@/utils/request';
import type { LangChainEmbedding } from '@/types/embedding';


export class EmbeddingService {
  async getEmbeddingConfig(documentId: number,): Promise<ConfigParams | null> {
    try {
      return get<ConfigParams>(`${API_EMBEDDING_URL}/${documentId}/embedding-config`);
    } catch (error) {
      console.error('获取文档列表失败:', error);
      return null;
    }
  }

  async processEmbedding(
      documentId: number,
      config: ConfigParams): Promise<LangChainEmbedding[]> {
    try {
      const response = await post<LangChainEmbedding[]>(`${API_EMBEDDING_URL}/${documentId}/parse`, config);
      return response;
    } catch (error) {
      console.error("分块失败:", error);
      throw error;
    }
  }
}

export const embeddingService = new EmbeddingService();