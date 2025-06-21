import React, { useEffect } from 'react';
import { Card, Form, Input, Button, Select, Switch, message, InputNumber } from 'antd';
import type { FrontendConfig } from '@/types/config';
import { useAppDispatch } from '@/store';
import { saveFrontendConfig } from '@/store/slices/configSlice';

interface FrontendConfigProps {
  config: FrontendConfig;
  loading: boolean;
}

const FrontendConfig: React.FC<FrontendConfigProps> = ({ config, loading }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (config) {
      form.setFieldsValue(config);
    }
  }, [config, form]);

  const handleFinish = async (values: FrontendConfig) => {
    try {
      await dispatch(saveFrontendConfig(values));
      message.success('前端配置保存成功');
    } catch (error) {
      message.error('保存失败');
    }
  };

  return (
    <Card title="前端配置" bordered={false} loading={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={config}
      >
        <Form.Item
          label="连接 Host"
          name={["connection", "host"]}
          rules={[{ required: true, message: '请输入连接主机地址' }]}
        >
          <Input placeholder="localhost" />
        </Form.Item>
        <Form.Item
          label="连接 Port"
          name={["connection", "port"]}
          rules={[{ required: true, message: '请输入连接端口' }]}
        >
          <InputNumber min={1} max={65535} placeholder="8000" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="协议"
          name={["connection", "protocol"]}
          rules={[{ required: true, message: '请选择连接协议' }]}
        >
          <Select placeholder="选择协议">
            <Select.Option value="http">HTTP</Select.Option>
            <Select.Option value="https">HTTPS</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="主题模式"
          name={["theme", "mode"]}
          rules={[{ required: true, message: '请选择主题模式' }]}
        >
          <Select placeholder="选择主题模式">
            <Select.Option value="light">明亮模式</Select.Option>
            <Select.Option value="dark">暗黑模式</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="主题主色"
          name={["theme", "primaryColor"]}
          rules={[{ required: true, message: '请选择主题主色' }]}
        >
          <Input type="color" style={{ width: '100px' }} />
        </Form.Item>
        <Form.Item
          label="语言"
          name="language"
          rules={[{ required: true, message: '请选择语言' }]}
        >
          <Select placeholder="选择语言">
            <Select.Option value="zh-CN">简体中文</Select.Option>
            <Select.Option value="en-US">English</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="自动保存" name="autoSave" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="显示通知" name="showNotifications" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FrontendConfig;
