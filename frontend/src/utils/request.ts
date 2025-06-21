import { message } from 'antd';
import { API_BASE_URL } from '@/constants/api';
interface ErrorResponse {
  message?: string;
  code?: number;
}

interface HttpError {
  response?: {
    status: number;
    data: ErrorResponse;
  };
}

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  code?: number;
}

interface ErrorResponse {
  message?: string;
  code?: number;
}

interface HttpError {
  response?: {
    status: number;
    data: ErrorResponse;
  };
}

const handleError = (error: HttpError) => {
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
    return handleError(error as HttpError);
  }
};

export const get = <T = unknown>(url: string, params?: Record<string, string | number | boolean>): Promise<T> => {
  const queryString = params ? `?${new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  ).toString()}` : '';
  return request<T>(`${url}${queryString}`);
};

export const post = <T = unknown>(url: string, data?: unknown): Promise<T> => {
  return request<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const put = <T = unknown>(url: string, data?: unknown): Promise<T> => {
  return request<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const del = <T = unknown>(url: string): Promise<T> => {
  return request<T>(url, {
    method: 'DELETE',
  });
};

export const upload = async <T = unknown>(url: string, data: File | FormData): Promise<T> => {
  return request<T>(url, {
    method: 'POST',
    body: data,
    headers: {
      // 不设置 Content-Type，让浏览器自动设置正确的 boundary
    },
  });
};

export default request;