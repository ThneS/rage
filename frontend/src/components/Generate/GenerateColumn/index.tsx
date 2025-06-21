import { useState, useEffect } from 'react';
import { Card, Typography, Spin, Divider, Button, message, Form, Empty } from 'antd';
import { useAppDispatch } from '@/store';
import { runGenerate } from '@/store/slices/generateSlice';
import ConfigRender from '@/components/Common/ConfigRender';
import type { ConfigParams } from '@/types/commonConfig';
import type { Document } from '@/types/document';

const { Title, Paragraph, Text } = Typography;

interface GenerateColumnProps {
  documentId: number;
  config: ConfigParams | null;
  formValues: Record<string, any>;
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

  const handleGenerate = async (values: Record<string, any>) => {
    console.log('GenerateColumn: 生成按钮被点击，values:', values);
    console.log('GenerateColumn: documentId:', documentId);
    try {
      await dispatch(runGenerate(documentId, values));
      message.success('生成完成');
    } catch (error) {
      console.error('GenerateColumn: 生成失败:', error);
      message.error('生成失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleValuesChange = (changed: any, allValues: Record<string, any>) => {
    // 这里可以处理配置变化，如果需要的话
    console.log('配置值变化:', changed, allValues);
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
            selectedDocument={selectedDocument}
            onValuesChange={handleValuesChange}
            onFinish={handleGenerate}
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
