import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Button,
  Space,
  App,
  Typography,
} from 'antd';
import type { Document } from '@/types/document';
import type { ConfigParams } from '@/types/commonConfig';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchVecStoreConfig, processVecStore } from '@/store/slices/vecStoreSlice';
import ConfigRender from '@/components/Common/ConfigRender';

const { Text } = Typography;

interface VecStoreConfigProps {
  selectedDocument: Document | null;
  processing: boolean;
  onViewVecStore?: () => void;
  VecStoreResult?: Record<string, unknown>;
}

const VecStoreConfig: React.FC<VecStoreConfigProps> = ({
  selectedDocument,
  processing,
  onViewVecStore,
  VecStoreResult,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { config, loading, error } = useAppSelector(state => state.vecStore);
  const [formValues, setFormValues] = useState<Record<string, string | number | boolean>>({});
  const [initialValues, setInitialValues] = useState<Record<string, string | number | boolean>>({});
  const dispatch = useAppDispatch();

  // 获取文档加载配置
  useEffect(() => {
    if (selectedDocument) {
      dispatch(fetchVecStoreConfig(selectedDocument.id));
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
    try {
      // 合并配置信息和表单值
      const submitConfig: ConfigParams = {
        ...config,
        default_config: {
          ...config.default_config,
          ...values
        }
      };

      await dispatch(processVecStore(selectedDocument.id, submitConfig));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '处理失败';
      message.error(errorMessage);
    }
  };

  return (
    <Card
      title={
        <Space>
          {config?.icon && <i className={`fas fa-${config.icon}`} />}
          <span>Indexing and Search</span>
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
                onClick={onViewVecStore}
                style={{ minWidth: 100 }}
                disabled={!selectedDocument || !VecStoreResult}
              >
                查看分块
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default VecStoreConfig;