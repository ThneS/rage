import React, { useEffect, useState, useMemo } from 'react';
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
  Typography,
  Tooltip,
  Radio,
  Tabs,
} from 'antd';
import type { Document } from '@/types/document';
import type { FileTypeConfigResponse, ConfigField } from '@/types/document';
import { documentService } from '@/services/documentService';

const { Option } = Select;
const { Text } = Typography;

interface LoadConfigProps {
  selectedDocument: Document | null;
  onProcess: (config: any) => void;
  processing: boolean;
  onViewLoad?: () => void;
  loadResult?: any;
}

// 检查字段是否应该显示
const shouldShowField = (field: ConfigField, formValues: Record<string, any>): boolean => {
  if (!field.dependencies) return true;

  const { field: depField, value: depValue } = field.dependencies;
  const currentValue = formValues[depField];

  // 如果依赖值是数组，检查当前值是否在数组中
  if (Array.isArray(depValue)) {
    return depValue.includes(currentValue);
  }

  // 否则直接比较值
  return currentValue === depValue;
};

const LoadConfig: React.FC<LoadConfigProps> = ({
  selectedDocument,
  onProcess,
  processing,
  onViewLoad,
  loadResult,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [config, setConfig] = useState<FileTypeConfigResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});

  // 获取文档加载配置
  useEffect(() => {
    const fetchConfig = async () => {
      if (!selectedDocument) {
        setConfig(null);
        setInitialValues({});
        setFormValues({});
        return;
      }

      try {
        setLoading(true);
        const response = await documentService.getLoadConfig(selectedDocument.id);
        setConfig(response);
        const defaultValues = response.default_config;
        setInitialValues(defaultValues);
        setFormValues(defaultValues);
      } catch (error) {
        message.error('获取文档配置失败');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [selectedDocument, message]);

  // 监听表单值变化
  const handleValuesChange = (_: any, allValues: Record<string, any>) => {
    setFormValues(allValues);
  };

  const handleSubmit = async (values: any) => {
    try {
      await onProcess(values);
    } catch (error) {
      message.error('处理文档时出错');
    }
  };

  // 根据字段类型渲染表单项
  const renderFormItem = (field: ConfigField) => {
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
          <Radio.Group {...commonProps}>
            {field.options?.map(option => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
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

  // 使用 useMemo 优化分组渲染
  const formGroups = useMemo(() => {
    if (!config?.group_order) return [];

    // 使用配置中指定的分组顺序
    const orderedGroups = config.group_order;

    // 按指定顺序渲染分组
    const groups = orderedGroups.map(groupName => {
      const fields = config.fields
        .filter(field => field.group === groupName)
        .filter(field => shouldShowField(field, formValues));

      // 如果分组下没有可见的字段，则不显示该分组
      if (fields.length === 0) return null;

      return {
        key: groupName,
        label: groupName,
        children: (
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
              >
                {renderFormItem(field)}
              </Form.Item>
            ))}
          </div>
        ),
      };
    }).filter((group): group is NonNullable<typeof group> => group !== null);

    return groups;
  }, [config, formValues, processing, selectedDocument]);

  return (
    <Card
      title={
        <Space>
          {config?.icon && <i className={`fas fa-${config.icon}`} />}
          <span>处理配置</span>
          {config?.name && <Text type="secondary">({config.name})</Text>}
        </Space>
      }
      extra={
        selectedDocument ? (
          <Text type="secondary">关联文档：{selectedDocument.filename}</Text>
        ) : null
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
      {!selectedDocument ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <div className="text-lg mb-2">请先在左侧选择一个文档</div>
        </div>
      ) : !config ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <div className="text-lg mb-2">未获取到配置，请重试或联系管理员</div>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleValuesChange}
          className="flex flex-col h-full"
          initialValues={initialValues}
          key={selectedDocument.id}
        >
          <div className="flex-1">
            {config?.description && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <Text type="secondary">{config.description}</Text>
              </div>
            )}
            <Tabs
              tabPosition="top"
              style={{ height: '100%' }}
              items={formGroups}
            />
          </div>

          <Form.Item className="mt-4 mb-0">
            <Space className="w-full justify-end">
              <Button
                type="primary"
                htmlType="submit"
                loading={processing}
                disabled={!selectedDocument}
                style={{ minWidth: 100 }}
              >
                开始处理
              </Button>
              <Button
                type="default"
                onClick={onViewLoad}
                style={{ minWidth: 100 }}
                disabled={!selectedDocument || !loadResult}
              >
                查看加载
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default LoadConfig;