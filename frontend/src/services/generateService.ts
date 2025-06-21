import { get, post } from '@/utils/request';
import type { ConfigParams } from '@/types/commonConfig';
import { API_GENERATE_URL } from '@/constants/api';

export const generateService = {
  getGenerateConfig: (documentId: number): Promise<ConfigParams> => {
    return get(`${API_GENERATE_URL}/${documentId}/config`);
  },
  generate: (documentId: number, config: Record<string, any>): Promise<{ text: string }> => {
    return post(`${API_GENERATE_URL}/${documentId}/generate`, { config });
  },
};