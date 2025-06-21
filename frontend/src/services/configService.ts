import { get, put, post } from '@/utils/request';
import type { AllConfig, ModelConfig, ConnectionConfig, SystemConfig } from '@/types/config';
import { API_CONFIG_URL } from '@/constants/api';

// 前端配置存储键
const FRONTEND_CONFIG_KEY = 'rage_frontend_config';

export const configService = {
  // 后端配置 API
  getAllConfig: (): Promise<AllConfig> => {
    return get(`${API_CONFIG_URL}/all`);
  },

  updateAllConfig: (config: AllConfig): Promise<{ message: string }> => {
    return put(`${API_CONFIG_URL}/all`, config);
  },

  getModelConfig: (): Promise<ModelConfig> => {
    return get(`${API_CONFIG_URL}/model`);
  },

  updateModelConfig: (config: ModelConfig): Promise<{ message: string }> => {
    return put(`${API_CONFIG_URL}/model`, config);
  },

  getConnectionConfig: (): Promise<ConnectionConfig> => {
    return get(`${API_CONFIG_URL}/connection`);
  },

  updateConnectionConfig: (config: ConnectionConfig): Promise<{ message: string }> => {
    return put(`${API_CONFIG_URL}/connection`, config);
  },

  getSystemConfig: (): Promise<SystemConfig> => {
    return get(`${API_CONFIG_URL}/system`);
  },

  updateSystemConfig: (config: SystemConfig): Promise<{ message: string }> => {
    return put(`${API_CONFIG_URL}/system`, config);
  },

  initDefaultConfigs: (): Promise<{ message: string }> => {
    return post(`${API_CONFIG_URL}/init`);
  },

  // 前端配置管理
  getFrontendConfig: () => {
    try {
      const config = localStorage.getItem(FRONTEND_CONFIG_KEY);
      return config ? JSON.parse(config) : null;
    } catch (error) {
      console.error('获取前端配置失败:', error);
      return null;
    }
  },

  setFrontendConfig: (config: any) => {
    try {
      localStorage.setItem(FRONTEND_CONFIG_KEY, JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('保存前端配置失败:', error);
      return false;
    }
  },

  // 更新 API 基础 URL
  updateApiBaseUrl: (host: string, port: number, protocol: 'http' | 'https' = 'http') => {
    const baseUrl = `${protocol}://${host}:${port}`;
    // 这里可以更新全局的 API 基础 URL
    // 注意：这需要配合 request.ts 中的动态 URL 功能
    return baseUrl;
  }
};