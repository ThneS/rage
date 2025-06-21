import { get, post } from '@/utils/request';
import type { ConfigParams } from '@/types/commonConfig';
import { API_SEARCH_URL } from '@/constants/api';
export const searchService = {
  getPreConfig: (documentId: number): Promise<ConfigParams> => {
    return get(`${API_SEARCH_URL}/${documentId}/pre_config`);
  },
  getPostConfig: (documentId: number): Promise<ConfigParams> => {
    return get(`${API_SEARCH_URL}/${documentId}/post_config`);
  },
  preProcess: (documentId: number, query: string, config: Record<string, any>): Promise<{ content: string }> => {
    return post(`${API_SEARCH_URL}/${documentId}/pre`, { query, config });
  },
  postProcess: (documentId: number, content: string, config: Record<string, any>): Promise<{ content: string }> => {
    return post(`${API_SEARCH_URL}/${documentId}/post`, { content, config });
  },
  parse: (documentId: number, content: string): Promise<{ data: any }> => {
    return post(`${API_SEARCH_URL}/${documentId}/parse`, { content });
  },
};