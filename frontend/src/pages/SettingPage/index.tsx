import React from 'react';
import { Card, Form, Input, Button, Switch, Select, Space, Typography, Divider } from 'antd';
import styled from '@emotion/styled';

const { Title } = Typography;
const { Option } = Select;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

const SettingPage: React.FC = () => {
  const [form] = Form.useForm();

  const handleSave = (values: any) => {
    console.log('保存设置:', values);
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Title level={2}>系统设置</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          apiEndpoint: 'http://localhost:8000',
          timeout: 30,
          enableCache: true,
          language: 'zh-CN',
          theme: 'light'
        }}
      >
        <StyledCard title="API 配置">
          <Form.Item
            label="API 端点"
            name="apiEndpoint"
            rules={[{ required: true, message: '请输入 API 端点' }]}
          >
            <Input placeholder="请输入 API 端点地址" />
          </Form.Item>

          <Form.Item
            label="请求超时时间（秒）"
            name="timeout"
            rules={[{ required: true, message: '请输入超时时间' }]}
          >
            <Input type="number" min={1} max={300} />
          </Form.Item>
        </StyledCard>

        <StyledCard title="缓存设置">
          <Form.Item
            label="启用缓存"
            name="enableCache"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="缓存过期时间（分钟）"
            name="cacheExpire"
            dependencies={['enableCache']}
          >
            <Input
              type="number"
              min={1}
              max={1440}
              disabled={!form.getFieldValue('enableCache')}
            />
          </Form.Item>
        </StyledCard>

        <StyledCard title="界面设置">
          <Form.Item
            label="语言"
            name="language"
          >
            <Select>
              <Option value="zh-CN">中文</Option>
              <Option value="en-US">English</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="主题"
            name="theme"
          >
            <Select>
              <Option value="light">浅色主题</Option>
              <Option value="dark">深色主题</Option>
            </Select>
          </Form.Item>
        </StyledCard>

        <StyledCard title="高级设置">
          <Form.Item
            label="调试模式"
            name="debugMode"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="日志级别"
            name="logLevel"
          >
            <Select>
              <Option value="info">信息</Option>
              <Option value="warn">警告</Option>
              <Option value="error">错误</Option>
              <Option value="debug">调试</Option>
            </Select>
          </Form.Item>
        </StyledCard>

        <Divider />

        <Space>
          <Button type="primary" htmlType="submit">
            保存设置
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default SettingPage;
