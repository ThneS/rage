import React, { useState } from 'react';
import {
  Card,
  Upload,
  Button,
  Space,
  Checkbox,
  Form,
  Select,
  Tabs,
  List,
  Tag,
  Typography,
  Divider,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title } = Typography;
const { TabPane } = Tabs;

const Container = styled.div`
  padding: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

const FileList = styled(List)`
  margin-top: 16px;
`;

const PreviewContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  max-height: 400px;
  overflow: auto;
`;

const DocumentLoader: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const getFileIcon = (file: UploadFile) => {
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

  return (
    <Container>
      <Title level={2}>文档加载设置</Title>

      <StyledCard title="文件选择">
        <Upload.Dragger
          multiple
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={() => false}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持 PDF、DOCX、CSV、MD、HTML、TXT 等格式
          </p>
        </Upload.Dragger>

        <FileList
          dataSource={fileList}
          renderItem={(file) => (
            <List.Item
              actions={[
                <Button type="text" icon={<EyeOutlined />}>预览</Button>,
                <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={getFileIcon(file)}
                title={file.name}
                description={`${(file.size! / 1024).toFixed(2)} KB`}
              />
            </List.Item>
          )}
        />
      </StyledCard>

      <StyledCard title="解析工具配置">
        <Form form={form} layout="vertical">
          <Form.Item label="选择解析工具" name="parser">
            <Select mode="multiple" placeholder="请选择解析工具">
              <Select.Option value="langchain">LangChain</Select.Option>
              <Select.Option value="llamaindex">LlamaIndex</Select.Option>
              <Select.Option value="unstructured">Unstructured.io</Select.Option>
              <Select.Option value="custom">自定义解析器</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="解析选项">
            <Space direction="vertical">
              <Checkbox>启用表格识别</Checkbox>
              <Checkbox>启用图片OCR</Checkbox>
              <Checkbox>启用图文联合解析</Checkbox>
              <Checkbox>去除页眉页脚</Checkbox>
            </Space>
          </Form.Item>
        </Form>
      </StyledCard>

      <StyledCard title="解析预览">
        <Tabs defaultActiveKey="1">
          <TabPane tab="原始文本" key="1">
            <PreviewContainer>
              {/* 这里将显示解析后的文本内容 */}
            </PreviewContainer>
          </TabPane>
          <TabPane tab="结构化数据" key="2">
            <PreviewContainer>
              {/* 这里将显示结构化数据 */}
            </PreviewContainer>
          </TabPane>
          <TabPane tab="对比视图" key="3">
            <PreviewContainer>
              {/* 这里将显示不同解析工具的对比结果 */}
            </PreviewContainer>
          </TabPane>
        </Tabs>
      </StyledCard>
    </Container>
  );
};

export default DocumentLoader;