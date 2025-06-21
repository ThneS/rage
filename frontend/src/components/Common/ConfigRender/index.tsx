import React, { useMemo } from 'react';
import { Form, Space, Tooltip, Typography, Tabs, Alert, Input, InputNumber, Select, Switch, Radio, Checkbox } from 'antd';
import type { ConfigField, ConfigParams } from '@/types/commonConfig';

const { Text } = Typography;
const { Option } = Select;

interface ConfigRenderProps {
  config: ConfigParams | null;
  formValues: Record<string, any>;
  processing: boolean;
  error?: string | null;
  onValuesChange: (changed: any, all: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  selectedDocument?: any;
  children?: React.ReactNode;
}

const shouldShowField = (field: ConfigField, formValues: Record<string, any>): boolean => {
  if (!field.dependencies) return true;
  const { field: depField, value: depValue } = field.dependencies;
  const currentValue = formValues[depField];
  if (Array.isArray(depValue)) {
    return depValue.includes(currentValue);
  }
  return currentValue === depValue;
};

const renderFormItem = (field: ConfigField, commonProps: any) => {
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
    case 'checkbox':
      return (
        <Checkbox.Group
          {...commonProps}
          options={field.options?.map(option => ({
            label: option.label,
            value: option.value,
          }))}
        />
      );
    default:
      return <Input {...commonProps} />;
  }
};

const ConfigRender: React.FC<ConfigRenderProps> = ({
  config,
  formValues,
  processing,
  error,
  onValuesChange,
  selectedDocument,
  children,
}) => {
  const [form] = Form.useForm();

  // 组装分组
  const formGroups = useMemo(() => {
    if (!config?.group_order) return [];
    const orderedGroups = config.group_order;
    const groups = orderedGroups.map(groupName => {
      const fields = config.fields
        .filter(field => field.group === groupName)
        .filter(field => shouldShowField(field, formValues));
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
                {renderFormItem(field, {
                  disabled: field.disabled || processing || !selectedDocument,
                  placeholder: field.placeholder,
                })}
              </Form.Item>
            ))}
          </div>
        ),
      };
    }).filter((group): group is NonNullable<typeof group> => group !== null);
    return groups;
  }, [config, formValues, processing, selectedDocument]);

  return (
    <Form
        form={form}
        layout="vertical"
        initialValues={config?.default_config}
        onValuesChange={onValuesChange}
    >
      {error && (
        <Alert
          message="处理失败"
          description={error}
          type="error"
          showIcon
          className="mb-4"
          closable
        />
      )}
      {config?.description && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <Text type="secondary">{config.description}</Text>
        </div>
      )}
      <Tabs tabPosition="top" style={{ height: '100%' }} items={formGroups} />
      {children}
    </Form>
  );
};

export default ConfigRender;
