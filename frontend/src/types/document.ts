export interface Document {
  id: number;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  upload_time: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
}