import axios from 'axios';
import type { Document } from '@/types/document';
import { API_DOCUMENTS_URL } from '@/constants/api';
import { get, del, upload } from '../utils/request';

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
}

// 导出实例
export const documentService = new DocumentService();