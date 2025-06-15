import type { ChunkConfig, ChunkConfigResponse, LangChainChunk } from '@/types/chunk';
import { API_CHUNK_URL } from '@/constants/api';
import { get, post } from '@/utils/request';


export class ChunkService {
  async getChunkConfig(documentId: number): Promise<ChunkConfigResponse | null> {
    try {
      const response = await get<ChunkConfigResponse>(`${API_CHUNK_URL}/${documentId}/chunk-config`);
      return response;
    } catch (error) {
      console.error('获取文档列表失败:', error);
      return null;
    }
  }

  async processChunk(
      documentId: number,
      config: ChunkConfig): Promise<LangChainChunk[]> {
    try {
      const response = await post<LangChainChunk[]>(`${API_CHUNK_URL}/${documentId}`, { config });
      return response;
    } catch (error) {
      console.error("分块失败:", error);
      throw error;
    }
  }
}

export const chunkService = new ChunkService();