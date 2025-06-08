import React, { useState } from 'react';
import {
  Card,
  Form,
  Radio,
  InputNumber,
  Switch,
  Select,
  Space,
  Typography,
  Divider,
  Tabs,
  Table,
  Tag,
} from 'antd';
import styled from '@emotion/styled';

const { Title } = Typography;
const { TabPane } = Tabs;

const Container = styled.div`
  padding: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

const PreviewContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  max-height: 400px;
  overflow: auto;
`;

const SplitMethodConfig: React.FC<{ method: string }> = ({ method }) => {
  switch (method) {
    case 'fixed':
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item label="块大小" name="chunkSize">
            <InputNumber min={100} max={2000} step={100} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="重叠大小" name="overlapSize">
            <InputNumber min={0} max={500} step={10} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="过滤空块" name="filterEmpty" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Space>
      );
    case 'paragraph':
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item label="段落识别方式" name="paragraphMethod">
            <Select style={{ width: 200 }}>
              <Select.Option value="newline">换行符</Select.Option>
              <Select.Option value="indent">缩进</Select.Option>
              <Select.Option value="both">两者结合</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="合并短段落" name="mergeShort" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="最短段落长度" name="minParagraphLength">
            <InputNumber min={10} max={200} step={10} style={{ width: 200 }} />
          </Form.Item>
        </Space>
      );
    case 'semantic':
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item label="Embedding模型" name="embeddingModel">
            <Select style={{ width: 200 }}>
              <Select.Option value="openai">OpenAI</Select.Option>
              <Select.Option value="cohere">Cohere</Select.Option>
              <Select.Option value="bge">BGE</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="相似度阈值" name="similarityThreshold">
            <InputNumber min={0} max={1} step={0.1} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="启用PCA降维" name="usePCA" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Space>
      );
    case 'llm':
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item label="LLM模型" name="llmModel">
            <Select style={{ width: 200 }}>
              <Select.Option value="gpt4">GPT-4</Select.Option>
              <Select.Option value="qwen">Qwen</Select.Option>
              <Select.Option value="claude">Claude</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="提示词模板" name="promptTemplate">
            <Select style={{ width: 200 }}>
              <Select.Option value="default">默认模板</Select.Option>
              <Select.Option value="custom">自定义模板</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="最大分块数量" name="maxChunks">
            <InputNumber min={1} max={100} step={1} style={{ width: 200 }} />
          </Form.Item>
        </Space>
      );
    default:
      return null;
  }
};

const DocumentSplitter: React.FC = () => {
  const [form] = Form.useForm();
  const [splitMethod, setSplitMethod] = useState('fixed');

  const columns = [
    {
      title: '块ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '内容预览',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '长度',
      dataIndex: 'length',
      key: 'length',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'text' ? 'blue' : 'green'}>{type}</Tag>
      ),
    },
  ];

  const mockData = [
    {
      id: 1,
      content: '这是第一个文本块的内容...',
      length: 150,
      type: 'text',
    },
    // 更多模拟数据...
  ];

  return (
    <Container>
      <Title level={2}>文档分块设置</Title>

      <StyledCard title="分块方式选择">
        <Form form={form} layout="vertical">
          <Form.Item name="splitMethod" label="选择分块方式">
            <Radio.Group onChange={(e) => setSplitMethod(e.target.value)}>
              <Space direction="vertical">
                <Radio value="fixed">固定字符长度切分</Radio>
                <Radio value="paragraph">按自然段落切分</Radio>
                <Radio value="semantic">语义切分</Radio>
                <Radio value="llm">LLM智能切分</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Divider />

          <SplitMethodConfig method={splitMethod} />
        </Form>
      </StyledCard>

      <StyledCard title="分块预览">
        <Tabs defaultActiveKey="1">
          <TabPane tab="分块列表" key="1">
            <Table
              columns={columns}
              dataSource={mockData}
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </TabPane>
          <TabPane tab="可视化预览" key="2">
            <PreviewContainer>
              {/* 这里将显示分块的可视化预览 */}
            </PreviewContainer>
          </TabPane>
          <TabPane tab="对比视图" key="3">
            <PreviewContainer>
              {/* 这里将显示不同分块方式的对比结果 */}
            </PreviewContainer>
          </TabPane>
        </Tabs>
      </StyledCard>
    </Container>
  );
};

export default DocumentSplitter;