import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Space,
  App,
  Switch,
  InputNumber,
  Divider,
  Typography,
  Tooltip,
} from 'antd';
import type { Document } from '@/types/document';
import { getDocumentLoadConfig } from '@/api/documents';
import type { FileTypeConfigResponse } from '@/types/document';

const { Option } = Select;
const { Text } = Typography;

interface LoadConfigProps {
  selectedDocument: Document | null;
  onProcess: (config: any) => void;
  processing: boolean;
}

interface FormField {
  name: string;
  label: string;
  type: 'switch' | 'select' | 'radio' | 'number' | 'text' | 'textarea' | 'range';
  description?: string;
  default: any;
  required: boolean;
  options?: Array<{label: string; value: any; description?: string}>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  rows?: number;
  disabled: boolean;
  hidden: boolean;
  group?: string;
  dependencies?: {field: string; value: any};
}

const LoadConfig: React.FC<LoadConfigProps> = ({
  selectedDocument,
  onProcess,
  processing,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [config, setConfig] = useState<FileTypeConfigResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取文档加载配置
  useEffect(() => {
    const fetchConfig = async () => {
      if (!selectedDocument) {
        setConfig(null);
        form.resetFields();
        return;
      }

      try {
        setLoading(true);
        const response = await getDocumentLoadConfig(selectedDocument.id);
        setConfig(response);
        form.setFieldsValue(response.default_config);
      } catch (error) {
        message.error('获取文档配置失败');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [selectedDocument, form, message]);

  const handleSubmit = async (values: any) => {
    try {
      await onProcess(values);
    } catch (error) {
      message.error('处理文档时出错');
    }
  };

  // 根据字段类型渲染表单项
  const renderFormItem = (field: FormField) => {
    const commonProps = {
      disabled: field.disabled || processing || !selectedDocument,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'switch':
        return <Switch {...commonProps} />;

      case 'select':
        return (
          <Select {...commonProps}>
            {field.options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'radio':
        return (
          <Select {...commonProps} mode="radio">
            {field.options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'number':
        return (
          <InputNumber
            {...commonProps}
            min={field.min}
            max={field.max}
            step={field.step}
            className="w-full"
          />
        );

      case 'textarea':
        return (
          <Input.TextArea
            {...commonProps}
            rows={field.rows || 4}
            className="resize-none"
          />
        );

      case 'range':
        return (
          <InputNumber
            {...commonProps}
            min={field.min}
            max={field.max}
            step={field.step}
            className="w-full"
          />
        );

      default:
        return <Input {...commonProps} />;
    }
  };

  // 按组渲染表单项
  const renderFormGroups = () => {
    if (!config) return null;

    const groups = config.fields.reduce((acc, field) => {
      const group = field.group || '其他设置';
      if (!acc[group]) acc[group] = [];
      acc[group].push(field);
      return acc;
    }, {} as Record<string, FormField[]>);

    return Object.entries(groups).map(([groupName, fields]) => (
      <div key={groupName} className="mb-6">
        <Divider orientation="left">{groupName}</Divider>
        <div className="space-y-4">
          {fields.map(field => (
            <Form.Item
              key={field.name}
              label={
                <Tooltip title={field.description}>
                  <Space>
                    {field.label}
                    {field.required && <Text type="danger">*</Text>}
                  </Space>
                </Tooltip>
              }
              name={field.name}
              valuePropName={field.type === 'switch' ? 'checked' : 'value'}
              rules={field.required ? [{ required: true, message: `请输入${field.label}` }] : []}
              hidden={field.hidden}
            >
              {renderFormItem(field)}
            </Form.Item>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <Card
      title={
        <Space>
          {config?.icon && <i className={`fas fa-${config.icon}`} />}
          <span>处理配置</span>
          {config?.name && <Text type="secondary">({config.name})</Text>}
        </Space>
      }
      className="h-full flex flex-col"
      styles={{
        body: {
          height: 'calc(100% - 57px)',
          overflowY: 'auto'
        }
      }}
      loading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="flex flex-col h-full"
      >
        <div className="flex-1">
          {config?.description && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <Text type="secondary">{config.description}</Text>
            </div>
          )}
          {renderFormGroups()}
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