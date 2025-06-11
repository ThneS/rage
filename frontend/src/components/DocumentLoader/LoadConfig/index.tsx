import React from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Space,
  App,
} from 'antd';
import type { Document } from '@/types/document';

const { Option } = Select;

interface LoadConfigProps {
  selectedDocument: Document | null;
  onProcess: (config: {
    prompt: string;
    model: string;
    temperature: number;
    maxTokens: number;
  }) => void;
  processing: boolean;
}

const LoadConfig: React.FC<LoadConfigProps> = ({
  selectedDocument,
  onProcess,
  processing,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const handleSubmit = async (values: any) => {
    try {
      await onProcess({
        prompt: values.prompt,
        model: values.model,
        temperature: values.temperature,
        maxTokens: values.maxTokens,
      });
    } catch (error) {
      message.error('处理文档时出错');
    }
  };

  return (
    <Card
      title="处理配置"
      className="h-full flex flex-col"
      bodyStyle={{ height: 'calc(100% - 57px)', overflowY: 'auto' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          maxTokens: 2000,
        }}
        className="flex flex-col h-full"
      >
        <div className="flex-1 space-y-4">
          <Form.Item
            label="提示词"
            name="prompt"
            rules={[{ required: true, message: '请输入提示词' }]}
            className="mb-4"
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入提示词，例如：'总结以下文档的主要内容'"
              disabled={!selectedDocument || processing}
              className="resize-none"
            />
          </Form.Item>

          <Form.Item
            label="模型"
            name="model"
            rules={[{ required: true, message: '请选择模型' }]}
            className="mb-4"
          >
            <Select
              disabled={!selectedDocument || processing}
              className="w-full"
            >
              <Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Option>
              <Option value="gpt-4">GPT-4</Option>
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="温度"
              name="temperature"
              rules={[{ required: true, message: '请输入温度值' }]}
              className="mb-0"
            >
              <Input
                type="number"
                min={0}
                max={2}
                step={0.1}
                disabled={!selectedDocument || processing}
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              label="最大 Token 数"
              name="maxTokens"
              rules={[{ required: true, message: '请输入最大 Token 数' }]}
              className="mb-0"
            >
              <Input
                type="number"
                min={1}
                max={4000}
                disabled={!selectedDocument || processing}
                className="w-full"
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item className="mt-4 mb-0">
          <Space className="w-full justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={processing}
              disabled={!selectedDocument}
              className="min-w-[100px]"
            >
              开始处理
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoadConfig;