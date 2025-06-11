import React, { useState, useEffect } from 'react';
import {
  Card,
  Upload,
  Button,
  List,
  Input,
  App,
  Spin,
} from 'antd';
import {
  FileTextOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import type { UploadChangeParam, RcFile } from 'antd/es/upload';
import { documentService } from '@/services/documentService';
import type { Document } from '@/types/document';

const { Dragger } = Upload;
const { Search } = Input;

interface DocumentListProps {
  onSelectDocument: (document: Document) => void;
  processing: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({ onSelectDocument, processing }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [serverFiles, setServerFiles] = useState<Document[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { message } = App.useApp();

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList);
  };

  const handleUpload = async (file: RcFile) => {
    try {
      const uploadedDoc = await documentService.uploadDocument(file);
      if (uploadedDoc) {
        onSelectDocument(uploadedDoc);
        message.success('文件上传成功');
        fetchServerFiles();
      }
      return false; // 阻止默认上传行为
    } catch (error: any) {
      message.error(`上传失败: ${error.response?.data?.detail || error.message}`);
      return false;
    }
  };

  const getFileIcon = (file: Document | UploadFile): React.ReactNode => {
    const filename = 'filename' in file ? file.filename : file.name;
    if (!filename) return <FileTextOutlined />;
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ color: '#1890ff' }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  // 获取服务器文件列表
  const fetchServerFiles = async (searchText?: string) => {
    try {
      setSearchLoading(true);
      const files = await documentService.getDocuments({
        search: searchText,
        status: 'completed' // 只获取处理完成的文件
      });
      setServerFiles(files);
    } catch (error: any) {
      message.error(`获取文件列表失败: ${error.message}`);
      setServerFiles([]); // 清空列表
    } finally {
      setSearchLoading(false);
      setInitialLoading(false);
    }
  };

  // 初始加载文件列表
  useEffect(() => {
    fetchServerFiles();
  }, []);

  // 处理文件搜索
  const handleSearch = async (value: string) => {
    try {
      setSearchLoading(true);
      const files = await documentService.getDocuments({ search: value });
      setServerFiles(files);
    } catch (error: any) {
      message.error(`获取文件列表失败: ${error.message}`);
      setServerFiles([]); // 清空列表
    } finally {
      setSearchLoading(false);
      setInitialLoading(false);
    }
  };

  const handleSelectFile = async (file: Document) => {
    try {
      const document = await documentService.getDocument(file.id);
      onSelectDocument(document);
      setFileList([{
        uid: file.id.toString(),
        name: file.filename,
        status: 'done',
        url: documentService.getDownloadUrl(file.id)
      }]);
      message.success('文件加载成功');
    } catch (error: any) {
      message.error(`加载文件失败: ${error.message}`);
    }
  };

  return (
    <Card
      title="文档列表"
      className="h-full flex flex-col"
      styles={{
        body: {
          height: 'calc(100% - 57px)',
          overflowY: 'auto'
        }
      }}
    >
      <div className="mb-4">
        <Search
          placeholder="搜索文件名"
          onSearch={handleSearch}
          loading={searchLoading}
          enterButton
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <Dragger
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={handleUpload}
          maxCount={1}
          accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.md,.html"
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: true,
            showDownloadIcon: true,
          }}
          className="bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors duration-300"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-4xl text-blue-500" />
          </p>
          <p className="ant-upload-text text-base font-medium">
            点击或拖拽文件到此区域上传
          </p>
          <p className="ant-upload-hint text-sm text-gray-500">
            支持 PDF、DOCX、CSV、MD、HTML、TXT 等格式
          </p>
        </Dragger>
      </div>

      <div className="flex-1 overflow-y-auto">
        {initialLoading ? (
          <div className="flex items-center justify-center p-5">
            <Spin>
              <div className="p-[50px] bg-gray-50 rounded-lg">
                加载文件列表...
              </div>
            </Spin>
          </div>
        ) : serverFiles.length === 0 ? (
          <div className="flex items-center justify-center p-5 text-gray-500">
            {searchLoading ? '搜索中...' : '暂无文件'}
          </div>
        ) : (
          <List
            loading={searchLoading}
            itemLayout="horizontal"
            dataSource={serverFiles}
            className="space-y-2"
            renderItem={(file) => (
              <List.Item
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                actions={[
                  <Button
                    type="link"
                    onClick={() => handleSelectFile(file)}
                    disabled={processing}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    选择
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={getFileIcon(file)}
                  title={
                    <span className="text-base font-medium">
                      {file.filename}
                    </span>
                  }
                  description={
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>上传时间: {new Date(file.upload_time).toLocaleString()}</div>
                      <div>状态: {
                        file.status === 'completed' ? (
                          <span className="text-green-500">已完成</span>
                        ) : file.status === 'processing' ? (
                          <span className="text-blue-500">处理中</span>
                        ) : file.status === 'failed' ? (
                          <span className="text-red-500">处理失败</span>
                        ) : (
                          <span className="text-gray-500">待处理</span>
                        )
                      }</div>
                      {file.error_message && (
                        <div className="text-red-500">
                          错误: {file.error_message}
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Card>
  );
};

export default DocumentList;