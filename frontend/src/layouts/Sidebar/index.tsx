import React from 'react';
import { Layout, Menu } from 'antd';
import {
  FileTextOutlined,
  ScissorOutlined,
  ApiOutlined,
  DatabaseOutlined,
  SearchOutlined,
  FilterOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';

const { Sider } = Layout;

const StyledSider = styled(Sider)`
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
`;

const menuItems = [
  {
    key: '/document-loader',
    icon: <FileTextOutlined />,
    label: '文档加载',
  },
  {
    key: '/chunk',
    icon: <ScissorOutlined />,
    label: '文档分块',
  },
  {
    key: '/embedding',
    icon: <ApiOutlined />,
    label: '文档嵌入',
  },
  {
    key: '/vec-store',
    icon: <DatabaseOutlined />,
    label: '向量存储',
  },
  {
    key: '/pre-retrieval',
    icon: <SearchOutlined />,
    label: '检索前处理',
  },
  {
    key: '/post-retrieval',
    icon: <FilterOutlined />,
    label: '检索后处理',
  },
  {
    key: '/evaluation',
    icon: <BarChartOutlined />,
    label: '检索评估',
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <StyledSider width={200}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </StyledSider>
  );
};

export default Sidebar;