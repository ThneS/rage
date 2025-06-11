import type { Document } from '@/types/document';
import { API_DOCUMENTS_URL } from '@/constants/api';
import { get, del, upload, post } from '../utils/request';

export class DocumentService {
  async getDocuments(params?: { search?: string; status?: string }): Promise<Document[]> {
    return get<Document[]>(API_DOCUMENTS_URL, params);
  }

  async getDocument(id: number): Promise<Document> {
    return get<Document>(`${API_DOCUMENTS_URL}/${id}`);
  }

  async uploadDocument(file: File): Promise<Document> {
    return upload<Document>(`${API_DOCUMENTS_URL}/upload`, file);
  }

  async deleteDocument(id: number): Promise<void> {
    return del(`${API_DOCUMENTS_URL}/${id}`);
  }

  getDownloadUrl(id: number): string {
    return `${API_DOCUMENTS_URL}/${id}/download`;
  }

  async processDocument(
    id: number,
    config: {
      prompt: string;
      model: string;
      temperature: number;
      maxTokens: number;
    }
  ): Promise<Document> {
    return post<Document>(`${API_DOCUMENTS_URL}/${id}/process`, config);
  }
}

// 导出实例
export const documentService = new DocumentService();