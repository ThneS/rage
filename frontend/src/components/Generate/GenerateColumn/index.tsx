import { useEffect } from 'react';
import { Card, Typography, Spin, Divider, Button, message, Form } from 'antd';
import { useAppDispatch } from '@/store';
import { runGenerate } from '@/store/slices/generateSlice';
import ConfigRender from '@/components/Common/ConfigRender';
import type { ConfigParams } from '@/types/commonConfig';
import type { Document } from '@/types/document';

const { Paragraph } = Typography;

interface GenerateColumnProps {
  documentId: number;
  config: ConfigParams | null;
  formValues: Record<string, string | number | boolean>;
  result: string | null;
  processing: boolean;
  selectedDocument?: Document | null;
}

const GenerateColumn = ({ documentId, config, formValues, result, processing, selectedDocument }: GenerateColumnProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  // 当配置变化时，重置表单值
  useEffect(() => {
    if (config && config.default_config) {
      form.setFieldsValue(config.default_config);
    }
  }, [config, form]);

  const handleRun = async () => {
    if (!config || !formValues) {
      message.error('配置信息不完整');
      return;
    }

    // 合并默认配置和用户修改的配置
    const mergedConfig = {
      ...config.default_config,
      ...formValues
    };

    try {
      await dispatch(runGenerate(documentId, mergedConfig));
    } catch {
      // 错误已经在 slice 中处理
    }
  };

  const handleValuesChange = () => {
    // 这里可以处理配置变化，如果需要的话
  };

  if (!config) {
    return (
      <Card title="生成配置" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', color: '#999' }}>正在加载配置...</div>
      </Card>
    );
  }

  return (
    <Card title="生成配置" style={{ height: '100%' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* 生成配置 */}
        <div style={{ flex: '0 0 auto', marginBottom: '20px' }}>
          <ConfigRender
            config={config}
            formValues={formValues}
            processing={processing}
            selectedDocument={selectedDocument || undefined}
            onValuesChange={handleValuesChange}
            onFinish={handleRun}
            form={form}
            initialValues={config.default_config}
          >
            <Button type="primary" htmlType="submit" loading={processing} style={{ marginTop: '10px' }}>
              生成
            </Button>
          </ConfigRender>
        </div>

        <Divider />

        {/* 生成结果 */}
        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
          <Spin spinning={processing}>
            <Paragraph
              style={{
                whiteSpace: 'pre-wrap',
                background: '#f5f5f5',
                padding: '15px',
                borderRadius: '6px',
                flex: '1 1 auto',
                minHeight: '200px',
                margin: 0
              }}
              copyable
            >
              {result || '暂无结果'}
            </Paragraph>
          </Spin>
        </div>
      </div>
    </Card>
  );
};

export default GenerateColumn;
