import React from 'react';
import { Layout, Steps, Button, Space } from 'antd';
import { SaveOutlined, PlayCircleOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const StyledHeader = styled(AntHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
`;

const steps = [
  { title: '文档加载', path: '/document-loader' },
  { title: '文档分块', path: '/chunk' },
  { title: '文档嵌入', path: '/embedding' },
  { title: '向量存储', path: '/vec-store' },
  { title: '检索', path: '/search' },
  { title: '生成', path: '/generate' },
  // { title: '评估', path: '/evaluation' },
];

const Header: React.FC = () => {
  const location = useLocation();
  const currentStep = steps.findIndex(step => step.path === location.pathname);

  return (
    <StyledHeader>
      <Logo>RAG 参数调测平台</Logo>
      <Steps
        current={currentStep}
        items={steps.map(step => ({ title: step.title }))}
        style={{ width: '60%' }}
      />
      <Space>
        <Button icon={<SaveOutlined />}>保存配置</Button>
        <Button icon={<PlayCircleOutlined />} type="primary">运行测试</Button>
        <Button icon={<ImportOutlined />}>导入配置</Button>
        <Button icon={<ExportOutlined />}>导出配置</Button>
      </Space>
    </StyledHeader>
  );
};

export default Header;