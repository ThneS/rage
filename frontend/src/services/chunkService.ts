import type { LangChainChunk } from '@/types/chunk';
import type { ConfigParams } from '@/types/common_config';
import { API_CHUNK_URL } from '@/constants/api';
import { get, post } from '@/utils/request';


export class ChunkService {
  async getChunkConfig(documentId: number,): Promise<ConfigParams | null> {
    try {
      return get<ConfigParams>(`${API_CHUNK_URL}/${documentId}/chunk-config`);
    } catch (error) {
      console.error('获取文档列表失败:', error);
      return null;
    }
  }

  async processChunk(
      documentId: number,
      config: ConfigParams): Promise<LangChainChunk[]> {
    try {
      const response = await post<LangChainChunk[]>(`${API_CHUNK_URL}/${documentId}/parse`, config);
      return response;
    } catch (error) {
      console.error("分块失败:", error);
      throw error;
    }
  }
}

export const chunkService = new ChunkService();