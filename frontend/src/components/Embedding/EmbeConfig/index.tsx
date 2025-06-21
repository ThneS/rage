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
import { fetchEmbeddingConfig, processEmbedding } from '@/store/slices/embeddingSlice';
import ConfigRender from '@/components/Common/ConfigRender';

const { Text } = Typography;

interface EmbeddingConfigProps {
  selectedDocument: Document | null;
  processing: boolean;
  onViewEmbedding?: () => void;
  EmbeddingResult?: any;
}

const EmbeddingConfig: React.FC<EmbeddingConfigProps> = ({
  selectedDocument,
  processing,
  onViewEmbedding,
  EmbeddingResult,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { config, loading, error } = useAppSelector(state => state.embedding);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const dispatch = useAppDispatch();

  // 获取文档加载配置
  useEffect(() => {
    if (selectedDocument) {
      dispatch(fetchEmbeddingConfig(selectedDocument.id));
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
  const handleValuesChange = (_: any, allValues: Record<string, any>) => {
    setFormValues(allValues);
  };

  const handleSubmit = async (values: Record<string, any>) => {
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

      await dispatch(processEmbedding(selectedDocument.id, submitConfig));
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
          <span>嵌入配置</span>
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
                onClick={onViewEmbedding}
                style={{ minWidth: 100 }}
                disabled={!selectedDocument || !EmbeddingResult}
              >
                查看嵌入
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default EmbeddingConfig;