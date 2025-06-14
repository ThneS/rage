import request from '@/utils/request';
import type { Document, FileTypeConfigResponse } from '@/types/document';

// ... 其他 API 函数 ...

export async function getDocumentLoadConfig(documentId: number): Promise<FileTypeConfigResponse> {
  const response = await request.get(`/api/documents/${documentId}/load-config`);
  return response.data;
}