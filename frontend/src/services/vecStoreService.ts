import type { LangChainVecStore } from '@/types/vecStore';
import type { ConfigParams } from '@/types/commonConfig';
import { API_VEC_STORE_URL } from '@/constants/api';
import { get, post } from '@/utils/request';


export class VecStoreService {
  async getVecStoreConfig(documentId: number,): Promise<ConfigParams | null> {
    try {
      return get<ConfigParams>(`${API_VEC_STORE_URL}/${documentId}/vec-store-config`);
    } catch (error) {
      console.error('获取文档列表失败:', error);
      return null;
    }
  }

  async processVecStore(
      documentId: number,
      config: ConfigParams): Promise<LangChainVecStore[]> {
    try {
      const response = await post<LangChainVecStore[]>(`${API_VEC_STORE_URL}/${documentId}/parse`, config);
      return response;
    } catch (error) {
      console.error("分块失败:", error);
      throw error;
    }
  }

  async searchVecStore(documentId: number, query: string): Promise<string> {
    try {
      return get<string>(`${API_VEC_STORE_URL}/${documentId}/search?query=${query}`);
    } catch (error) {
      console.error("检索失败:", error);
      throw error;
    }
  }
}

export const vecStoreService = new VecStoreService();