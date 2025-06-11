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
import styled from '@emotion/styled';
import type { UploadFile } from 'antd';
import type { UploadChangeParam, RcFile } from 'antd/es/upload';
import { DocumentService } from '@/services/documentService';
import type { Document } from '@/types/document';

const { Dragger } = Upload;
const { Search } = Input;

const StyledCard = styled(Card)`
  height: 100%;
  .ant-card-body {
    height: calc(100% - 57px);
    overflow-y: auto;
  }
`;

const FileListContainer = styled.div`
  margin-top: 16px;
  height: calc(100% - 380px);
  overflow-y: auto;
`;

const UploadArea = styled.div`
  margin-bottom: 16px;
  .ant-upload-drag {
    background: #fafafa;
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
    cursor: pointer;
    transition: border-color 0.3s;
    &:hover {
      border-color: #1890ff;
    }
  }
`;

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
      const uploadedDoc = await DocumentService.uploadDocument(file);
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
      const files = await DocumentService.getDocuments({
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
  const handleSearch = (value: string) => {
    fetchServerFiles(value);
  };

  const handleSelectFile = async (file: Document) => {
    try {
      const document = await DocumentService.getDocument(file.id);
      onSelectDocument(document);
      setFileList([{
        uid: file.id.toString(),
        name: file.filename,
        status: 'done',
        url: DocumentService.getDownloadUrl(file.id)
      }]);
      message.success('文件加载成功');
    } catch (error: any) {
      message.error(`加载文件失败: ${error.message}`);
    }
  };

  return (
    <StyledCard title="文档列表">
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索文件名"
          onSearch={handleSearch}
          loading={searchLoading}
          enterButton
        />
      </div>

      <UploadArea>
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
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持 PDF、DOCX、CSV、MD、HTML、TXT 等格式
          </p>
        </Dragger>
      </UploadArea>

      <FileListContainer>
        {initialLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin>
              <div style={{ padding: '50px', background: 'rgba(0, 0, 0, 0.05)' }}>
                加载文件列表...
              </div>
            </Spin>
          </div>
        ) : serverFiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            {searchLoading ? '搜索中...' : '暂无文件'}
          </div>
        ) : (
          <List
            loading={searchLoading}
            itemLayout="horizontal"
            dataSource={serverFiles}
            renderItem={(file) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    onClick={() => handleSelectFile(file)}
                    disabled={processing}
                  >
                    选择
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={getFileIcon(file)}
                  title={file.filename}
                  description={
                    <div>
                      <div>上传时间: {new Date(file.upload_time).toLocaleString()}</div>
                      <div>状态: {
                        file.status === 'completed' ? '已完成' :
                        file.status === 'processing' ? '处理中' :
                        file.status === 'failed' ? '处理失败' : '待处理'
                      }</div>
                      {file.error_message && (
                        <div style={{ color: '#ff4d4f' }}>
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
      </FileListContainer>
    </StyledCard>
  );
};

export default DocumentList;