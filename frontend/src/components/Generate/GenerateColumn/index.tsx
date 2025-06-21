import { useState } from 'react';
import { Card, Typography, Spin, Divider, Button, message, Form, Empty } from 'antd';
import { useAppDispatch } from '@/store';
import { runGenerate } from '@/store/slices/generateSlice';
import ConfigRender from '@/components/Common/ConfigRender';
import type { ConfigParams } from '@/types/commonConfig';

const { Title, Paragraph, Text } = Typography;

interface GenerateColumnProps {
  documentId: number;
  config: ConfigParams | null;
  formValues: Record<string, any>;
  result: string | null;
  processing: boolean;
}

const GenerateColumn = ({ documentId, config, formValues, result, processing }: GenerateColumnProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const handleGenerate = async (values: Record<string, any>) => {
    try {
      await dispatch(runGenerate(documentId, values));
      message.success('生成完成');
    } catch (error) {
      message.error('生成失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
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
    <Card title={config.name} style={{ height: '100%' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* 生成配置 */}
        <div style={{ flex: '0 0 auto', marginBottom: '20px' }}>
          <ConfigRender
            form={form}
            config={config}
            onFinish={handleGenerate}
            onValuesChange={(_, allValues) => {
              // 这里可以处理配置变化
            }}
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
