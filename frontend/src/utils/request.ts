import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { API_BASE_URL } from '../constants/api';

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  code?: number;
}

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在这里可以添加 token 等认证信息
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: `Bearer ${token}`,
    //   };
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response.data.data;
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          message.error(data?.message || '请求参数错误');
          break;
        case 401:
          message.error('未授权，请重新登录');
          // 可以在这里处理登出逻辑
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(data?.message || '未知错误');
      }
    } else if (error.request) {
      message.error('网络错误，请检查您的网络连接');
    } else {
      message.error('请求配置错误');
    }
    return Promise.reject(error);
  }
);

// 封装 GET 请求
export const get = async <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await request.get<ApiResponse<T>>(url, { params, ...config });
  return response.data.data;
};

// 封装 POST 请求
export const post = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await request.post<ApiResponse<T>>(url, data, config);
  return response.data.data;
};

// 封装 PUT 请求
export const put = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await request.put<ApiResponse<T>>(url, data, config);
  return response.data.data;
};

// 封装 DELETE 请求
export const del = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await request.delete<ApiResponse<T>>(url, config);
  return response.data.data;
};

// 封装上传文件请求
export const upload = async <T = any>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await request.post<ApiResponse<T>>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
  return response.data.data;
};

export default request;