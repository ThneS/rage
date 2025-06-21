import React, { useMemo } from 'react';
import { Form, Space, Tooltip, Typography, Tabs, Alert, Input, InputNumber, Select, Switch, Radio, Checkbox } from 'antd';
import type { ConfigField, ConfigParams } from '@/types/commonConfig';
import type { Document } from '@/types/document';
import type { FormInstance } from 'antd/es/form';

const { Text } = Typography;
const { Option } = Select;

interface ConfigRenderProps {
  config: ConfigParams | null;
  formValues?: Record<string, string | number | boolean>;
  processing?: boolean;
  error?: string | null;
  onValuesChange?: (changed: Record<string, string | number | boolean>, all: Record<string, string | number | boolean>) => void;
  initialValues?: Record<string, string | number | boolean>;
  selectedDocument?: Document;
  children?: React.ReactNode;
  // 表单包装器模式
  form?: FormInstance;
  onFinish?: (values: Record<string, string | number | boolean>) => void;
}

const shouldShowField = (field: ConfigField, formValues: Record<string, string | number | boolean>): boolean => {
  if (!field.dependencies) return true;
  const { field: depField, value: depValue } = field.dependencies;
  const currentValue = formValues[depField];
  if (Array.isArray(depValue)) {
    return depValue.includes(currentValue);
  }
  return currentValue === depValue;
};

const renderFormItem = (field: ConfigField, commonProps: Record<string, unknown>) => {
  switch (field.type) {
    case 'switch':
      return <Switch {...commonProps} />;
    case 'select':
      return (
        <Select {...commonProps}>
          {field.options?.map(option => (
            <Option key={String(option.value)} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      );
    case 'radio':
      return (
        <Radio.Group {...commonProps}>
          {field.options?.map(option => (
            <Radio key={String(option.value)} value={option.value}>
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
  formValues = {},
  processing = false,
  error,
  onValuesChange,
  selectedDocument,
  children,
  form,
  onFinish,
}) => {
  const [internalForm] = Form.useForm();
  const currentForm = form || internalForm;

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

  // 如果传入了 form，说明外部已经有 Form 组件，只渲染内容
  if (form) {
    return (
      <>
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
      </>
    );
  }

  // 如果没有传入 form，创建内部的 Form 组件
  const formProps = {
    form: currentForm,
    layout: "vertical" as const,
    initialValues: config?.default_config,
    onValuesChange: onValuesChange,
    onFinish: onFinish,
  };

  return (
    <Form {...formProps}>
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
