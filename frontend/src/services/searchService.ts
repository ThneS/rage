import type { LangChainSearch } from '@/types/search';
import type { ConfigParams } from '@/types/commonConfig';
import { API_SEARCH_URL } from '@/constants/api';
import { get, post } from '@/utils/request';


export class SearchService {
  async getSearchConfig(documentId: number,): Promise<ConfigParams | null> {
    try {
      return get<ConfigParams>(`${API_SEARCH_URL}/${documentId}/search-config`);
    } catch (error) {
      console.error('获取文档列表失败:', error);
      return null;
    }
  }

  async processSearch(
      documentId: number,
      config: ConfigParams): Promise<LangChainSearch[]> {
    try {
      const response = await post<LangChainSearch[]>(`${API_SEARCH_URL}/${documentId}/parse`, config);
      return response;
    } catch (error) {
      console.error("搜索失败:", error);
      throw error;
    }
  }
}

export const searchService = new SearchService();