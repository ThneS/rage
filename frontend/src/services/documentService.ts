import axios from 'axios';
import type { Document } from '../types/document';

const API_BASE_URL = '/api/v1';

class DocumentService {
  async getDocuments(params?: { search?: string; status?: string }): Promise<Document[]> {
    const response = await axios.get(`${API_BASE_URL}/documents`, { params });
    return response.data;
  }

  async getDocument(id: number): Promise<Document> {
    const response = await axios.get(`${API_BASE_URL}/documents/${id}`);
    return response.data;
  }

  async uploadDocument(file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async processDocument(id: number, config: any): Promise<Document> {
    const response = await axios.post(`${API_BASE_URL}/documents/${id}/process`, config);
    return response.data;
  }

  async deleteDocument(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/documents/${id}`);
  }

  getDownloadUrl(id: number): string {
    return `${API_BASE_URL}/documents/${id}/download`;
  }
}

export const documentService = new DocumentService();