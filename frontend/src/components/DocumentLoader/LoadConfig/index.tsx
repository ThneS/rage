import React from 'react';
import { Card, Form, Select, Checkbox, Button, App } from 'antd';
import styled from '@emotion/styled';
import type { Document } from '@/types/document';
import { DocumentService } from '@/services/documentService';

const StyledCard = styled(Card)`
  height: 100%;
  .ant-card-body {
    height: calc(100% - 57px);
    overflow-y: auto;
  }
`;

interface LoadConfigProps {
  currentDocument: Document | null;
  onDocumentUpdate: (document: Document) => void;
}

interface ProcessConfig {
  loader: string;
  enable_table_recognition: boolean;
  enable_ocr: boolean;
  enable_image_analysis: boolean;
  remove_headers_footers: boolean;
}

const LoadConfig: React.FC<LoadConfigProps> = ({ currentDocument, onDocumentUpdate }) => {
  const [form] = Form.useForm();
  const [processing, setProcessing] = React.useState(false);
  const { message } = App.useApp();

  const handleProcess = async () => {
    if (!currentDocument) {
      message.error('请先选择文件');
      return;
    }

    try {
      setProcessing(true);
      const values = await form.validateFields();

      // 构建处理配置
      const config: ProcessConfig = {
        loader: values.loader,
        enable_table_recognition: values.enable_table_recognition || false,
        enable_ocr: values.enable_ocr || false,
        enable_image_analysis: values.enable_image_analysis || false,
        remove_headers_footers: values.remove_headers_footers || false
      };

      // 调用处理接口
      const updatedDoc = await DocumentService.processDocument(currentDocument.id, config);
      onDocumentUpdate(updatedDoc);
      message.success('文档加载成功');
    } catch (error: any) {
      message.error(`加载失败: ${error.response?.data?.detail || error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <StyledCard title="加载工具配置">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          loader: 'langchain',
          enable_table_recognition: false,
          enable_ocr: false,
          enable_image_analysis: false,
          remove_headers_footers: false
        }}
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
  );
};

export default LoadConfig;