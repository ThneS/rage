import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Button,
  Space,
  App,
  Typography,
} from 'antd';
import type { Document, LangChainDocument } from '@/types/document';
import { useAppDispatch, useAppSelector } from '@/store';
import { processDocument, fetchLoadConfig } from '@/store/slices/documentSlice';
import ConfigRender from '@/components/Common/ConfigRender';

const { Text } = Typography;

interface LoadConfigProps {
  selectedDocument: Document | null;
  processing: boolean;
  onViewLoad?: () => void;
  loadResult?: LangChainDocument[];
}

const LoadConfig: React.FC<LoadConfigProps> = ({
  selectedDocument,
  processing,
  onViewLoad,
  loadResult,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const config = useAppSelector(state => state.document.config);
  const { loading, error } = useAppSelector(state => state.document);
  const [formValues, setFormValues] = useState<Record<string, string | number | boolean>>({});
  const [initialValues, setInitialValues] = useState<Record<string, string | number | boolean>>({});
  const dispatch = useAppDispatch();

  // 获取文档加载配置
  useEffect(() => {
    if (selectedDocument) {
      dispatch(fetchLoadConfig(selectedDocument.id));
    }
  }, [selectedDocument, dispatch]);

  useEffect(() => {
    if (config) {
      setInitialValues(config.default_config || {});
      setFormValues(config.default_config || {});
      form.setFieldsValue(config.default_config || {});
    }
  }, [config, form]);

  // 监听表单值变化，同步更新到config
  const handleValuesChange = (_: Record<string, string | number | boolean>, allValues: Record<string, string | number | boolean>) => {
    setFormValues(allValues);
  };
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    if (!config || !selectedDocument) {
      message.error('配置信息不完整');
      return;
    }

    // 创建完整的 ConfigParams 对象，将用户修改的值合并到 default_config 中
    const updatedConfig = {
      ...config,
      default_config: {
        ...config.default_config,
        ...values
      }
    };

    dispatch(processDocument(selectedDocument.id, updatedConfig));
  };

  return (
    <Card
      title={
        <Space>
          {config?.icon && <i className={`fas fa-${config.icon}`} />}
          <span>文档处理</span>
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
          key={selectedDocument?.id}
        >
          <div className="flex-1">
            <ConfigRender
              config={config}
              formValues={formValues}
              processing={processing}
              error={error}
              selectedDocument={selectedDocument}
              onValuesChange={handleValuesChange}
              form={form}
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