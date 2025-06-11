import React, { useState, useEffect } from 'react';
import {
  Card,
  Upload,
  Button,
  Checkbox,
  Form,
  Select,
  List,
  Row,
  Col,
  message,
  Spin,
  Input,
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
import type { UploadChangeParam } from 'antd/es/upload';
import axios from 'axios';

const { Dragger } = Upload;
const { Search } = Input;

const Container = styled.div`
  padding: 24px;
  height: 100%;
`;

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

const DocumentLoader: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<any>(null);
  const [serverFiles, setServerFiles] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList);
  };

  const getFileIcon = (file: UploadFile | { name?: string }): React.ReactNode => {
    if (!file?.name) return <FileTextOutlined />;
    const extension = file.name.split('.').pop()?.toLowerCase();
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

  const handleProcess = async () => {
    if (fileList.length === 0) {
      message.error('请先上传文件');
      return;
    }

    try {
      setProcessing(true);
      const values = await form.validateFields();

      // 构建处理配置
      const config = {
        loader: values.loader,
        enable_table_recognition: values.enable_table_recognition || false,
        enable_ocr: values.enable_ocr || false,
        enable_image_analysis: values.enable_image_analysis || false,
        remove_headers_footers: values.remove_headers_footers || false
      };

      // 调用处理接口
      const response = await axios.post(`/api/v1/documents/${currentDocument.id}/process`, config);

      // 更新文档状态
      setCurrentDocument(response.data);
      message.success('文档加载成功');
    } catch (error: any) {
      message.error(`加载失败: ${error.response?.data?.detail || error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  // 获取服务器文件列表
  const fetchServerFiles = async (searchText?: string) => {
    try {
      setSearchLoading(true);
      const response = await axios.get('/api/v1/documents', {
        params: {
          search: searchText,
          status: 'completed' // 只获取处理完成的文件
        }
      });
      setServerFiles(response.data);
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

  const handleUpload = async (file: UploadFile) => {
    try {
      setProcessing(true);
      const formData = new FormData();
      formData.append('file', file as any);

      const response = await axios.post('/api/v1/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        setCurrentDocument(response.data);
        message.success('文件上传成功');
        fetchServerFiles();
      }
      return response.data;
    } catch (error: any) {
      message.error(`上传失败: ${error.response?.data?.detail || error.message}`);
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const handleSelectFile = async (file: any) => {
    try {
      setProcessing(true);
      const response = await axios.get(`/api/v1/documents/${file.id}`);
      setCurrentDocument(response.data);
      setFileList([{
        uid: file.id.toString(),
        name: file.filename,
        status: 'done',
        url: `/api/v1/documents/${file.id}/download`
      }]);
      message.success('文件加载成功');
    } catch (error: any) {
      message.error(`加载文件失败: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Container>
      <Row gutter={24} style={{ height: '100%' }}>
        {/* 左侧：文件列表和上传 */}
        <Col span={12}>
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
        </Col>

        {/* 右侧：加载工具配置 */}
        <Col span={12}>
          <StyledCard title="加载工具配置">
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item
                name="loader"
                label="加载工具"
                rules={[{ required: true, message: '请选择加载工具' }]}
              >
                <Select>
                  <Select.Option value="langchain">LangChain</Select.Option>
                  <Select.Option value="llamaindex">LlamaIndex</Select.Option>
                  <Select.Option value="unstructured">Unstructured</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="enable_table_recognition" valuePropName="checked">
                <Checkbox>启用表格识别</Checkbox>
              </Form.Item>

              <Form.Item name="enable_ocr" valuePropName="checked">
                <Checkbox>启用OCR</Checkbox>
              </Form.Item>

              <Form.Item name="enable_image_analysis" valuePropName="checked">
                <Checkbox>启用图像分析</Checkbox>
              </Form.Item>

              <Form.Item name="remove_headers_footers" valuePropName="checked">
                <Checkbox>移除页眉页脚</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleProcess}
                  loading={processing}
                  disabled={!currentDocument}
                  block
                >
                  开始加载
                </Button>
              </Form.Item>
            </Form>
          </StyledCard>
        </Col>
      </Row>
    </Container>
  );
};

export default DocumentLoader;