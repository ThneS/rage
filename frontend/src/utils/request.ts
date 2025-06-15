import { message } from 'antd';
import { API_BASE_URL } from '@/constants/api';

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  code?: number;
}

const handleError = (error: any) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        message.error(data?.message || '请求参数错误');
        break;
      case 401:
        message.error('未授权，请重新登录');
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
  } else {
    message.error('网络错误，请检查您的网络连接');
  }
  throw error;
};

const request = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const fullUrl = `${API_BASE_URL}${url}`;
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(fullUrl, { ...defaultOptions, ...options });
    const result: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw { response: { status: response.status, data: result } };
    }

    return result.data;
  } catch (error) {
    return handleError(error);
  }
};

export const get = <T = any>(url: string, params?: Record<string, any>): Promise<T> => {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  return request<T>(`${url}${queryString}`);
};

export const post = <T = any>(url: string, data?: any): Promise<T> => {
  return request<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const put = <T = any>(url: string, data?: any): Promise<T> => {
  return request<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const del = <T = any>(url: string): Promise<T> => {
  return request<T>(url, {
    method: 'DELETE',
  });
};

export const upload = async <T = any>(url: string, data: File | FormData): Promise<T> => {
  return request<T>(url, {
    method: 'POST',
    body: data,
    headers: {
      // 不设置 Content-Type，让浏览器自动设置正确的 boundary
    },
  });
};

export default request;