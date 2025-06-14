import type { Document, DocumentLoadConfig, FileTypeConfigResponse, LangChainDocument } from '@/types/document';
import { API_DOCUMENTS_URL } from '@/constants/api';
import { get, del, upload, post } from '../utils/request';

export class DocumentService {
  async getDocuments(): Promise<Document[]> {
    try {
      const response = await get<Document[]>(API_DOCUMENTS_URL);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('获取文档列表失败:', error);
      return [];
    }
  }

  async getDocument(id: number): Promise<Document> {
    return get<Document>(`${API_DOCUMENTS_URL}/${id}`);
  }

  async uploadDocument(file: File, metadata?: string): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', metadata);
    }
    return upload<Document>(`${API_DOCUMENTS_URL}/upload`, formData);
  }

  async deleteDocument(id: number): Promise<void> {
    return del(`${API_DOCUMENTS_URL}/${id}`);
  }

  async processDocument(
    id: number,
    config: DocumentLoadConfig
  ): Promise<LangChainDocument[]> {
    return post<LangChainDocument[]>(`${API_DOCUMENTS_URL}/${id}/parse`, config);
  }

  async getLoadConfig(id: number): Promise<FileTypeConfigResponse> {
    return get<FileTypeConfigResponse>(`${API_DOCUMENTS_URL}/${id}/load-config`);
  }
}

// 导出实例
export const documentService = new DocumentService();