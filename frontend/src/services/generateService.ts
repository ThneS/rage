  import type { LangChainGenerate } from '@/types/generate';
  import type { ConfigParams } from '@/types/commonConfig';
  import { API_GENERATE_URL } from '@/constants/api';
  import { get, post } from '@/utils/request';


  export class GenerateService {
    async getGenerateConfig(documentId: number,): Promise<ConfigParams | null> {
      try {
        return get<ConfigParams>(`${API_GENERATE_URL}/${documentId}/generate-config`);
      } catch (error) {
        console.error('获取生成配置失败:', error);
        return null;
      }
    }

    async processGenerate(
      documentId: number,
      config: ConfigParams): Promise<LangChainGenerate[]> {
      try {
        const response = await post<LangChainGenerate[]>(`${API_GENERATE_URL}/${documentId}/generate`, config);
        return response;
      } catch (error) {
        console.error("生成失败:", error);
        throw error;
      }
    }
  }

  export const generateService = new GenerateService();