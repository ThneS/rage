import React, { useEffect } from 'react';
import { Card, Form, Input, Button, Spin, message, Divider, Switch, InputNumber, Select } from 'antd';
import type { AllConfig } from '@/types/config';
import { useAppDispatch } from '@/store';
import {
  updateBackendConfig,
  fetchBackendConfig,
} from '@/store/slices/configSlice';

interface BackendConfigProps {
  config: AllConfig | null;
  loading: boolean;
}

const BackendConfig: React.FC<BackendConfigProps> = ({ config, loading }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (config) {
      // 处理 allowed_file_types 数组转换为字符串
      const formData = {
        ...config,
        system: {
          ...config.system,
          allowed_file_types: Array.isArray(config.system.allowed_file_types)
            ? config.system.allowed_file_types.join(', ')
            : config.system.allowed_file_types
        }
      };
      form.setFieldsValue(formData);
    }
  }, [config, form]);

  const handleFinish = async (values: any) => {
    try {
      // 处理 allowed_file_types 字符串转换为数组
      const processedValues: AllConfig = {
        ...values,
        system: {
          ...values.system,
          allowed_file_types: typeof values.system.allowed_file_types === 'string'
            ? values.system.allowed_file_types.split(',').map((item: string) => item.trim()).filter(Boolean)
            : values.system.allowed_file_types
        }
      };

      await dispatch(updateBackendConfig(processedValues));
      message.success('后端配置保存成功');
      dispatch(fetchBackendConfig());
    } catch (error) {
      message.error('保存失败');
    }
  };

  return (
    <Spin spinning={loading}>
      <Card title="后端配置" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={config || {}}
        >
          <Divider orientation="left">模型配置</Divider>

          {/* OpenAI 配置 */}
          <Form.Item
            label="OpenAI API Key"
            name={["model", "openai", "api_key"]}
            rules={[{ required: false, message: '请输入 OpenAI API Key' }]}
          >
            <Input.Password placeholder="sk-..." autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="OpenAI Base URL"
            name={["model", "openai", "base_url"]}
            rules={[{ type: 'url', message: '请输入有效的 URL' }]}
          >
            <Input placeholder="https://api.openai.com/v1" />
          </Form.Item>
          <Form.Item label="OpenAI Model" name={["model", "openai", "model"]}>
            <Select placeholder="选择模型">
              <Select.Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Select.Option>
              <Select.Option value="gpt-4">GPT-4</Select.Option>
              <Select.Option value="gpt-4-turbo">GPT-4 Turbo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="OpenAI Max Tokens" name={["model", "openai", "max_tokens"]}>
            <InputNumber min={1} max={8192} placeholder="2048" style={{ width: '100%' }} />
          </Form.Item>

          {/* DeepSeek 配置 */}
          <Form.Item
            label="DeepSeek API Key"
            name={["model", "deepseek", "api_key"]}
            rules={[{ required: false, message: '请输入 DeepSeek API Key' }]}
          >
            <Input.Password placeholder="sk-..." autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="DeepSeek Base URL"
            name={["model", "deepseek", "base_url"]}
            rules={[{ type: 'url', message: '请输入有效的 URL' }]}
          >
            <Input placeholder="https://api.deepseek.com/v1" />
          </Form.Item>
          <Form.Item label="DeepSeek Model" name={["model", "deepseek", "model"]}>
            <Input placeholder="deepseek-chat" />
          </Form.Item>
          <Form.Item label="DeepSeek Max Tokens" name={["model", "deepseek", "max_tokens"]}>
            <InputNumber min={1} max={8192} placeholder="2048" style={{ width: '100%' }} />
          </Form.Item>

          <Divider orientation="left">连接配置</Divider>
          <Form.Item
            label="后端 Host"
            name={["connection", "host"]}
            rules={[{ required: true, message: '请输入主机地址' }]}
          >
            <Input placeholder="localhost" />
          </Form.Item>
          <Form.Item
            label="后端 Port"
            name={["connection", "port"]}
            rules={[{ required: true, message: '请输入端口号' }]}
          >
            <InputNumber min={1} max={65535} placeholder="8000" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="超时时间（秒）" name={["connection", "timeout"]}>
            <InputNumber min={1} max={300} placeholder="30" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="重试次数" name={["connection", "retry_count"]}>
            <InputNumber min={0} max={10} placeholder="3" style={{ width: '100%' }} />
          </Form.Item>

          <Divider orientation="left">系统配置</Divider>
          <Form.Item label="调试模式" name={["system", "debug"]} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="日志级别" name={["system", "log_level"]}>
            <Select placeholder="选择日志级别">
              <Select.Option value="DEBUG">DEBUG</Select.Option>
              <Select.Option value="INFO">INFO</Select.Option>
              <Select.Option value="WARNING">WARNING</Select.Option>
              <Select.Option value="ERROR">ERROR</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="最大文件大小（字节）" name={["system", "max_file_size"]}>
            <InputNumber
              min={1024}
              max={1024 * 1024 * 1024}
              placeholder="104857600"
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => parseInt(value!.replace(/\$\s?|(,*)/g, ''), 10)}
            />
          </Form.Item>
          <Form.Item
            label="允许的文件类型"
            name={["system", "allowed_file_types"]}
            tooltip="用逗号分隔，如：.pdf, .txt, .docx, .md"
          >
            <Input placeholder=".pdf, .txt, .docx, .md" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存配置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default BackendConfig;