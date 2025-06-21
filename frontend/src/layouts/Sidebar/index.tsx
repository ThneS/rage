import React from 'react';
import { Layout, Menu } from 'antd';
import {
  FileTextOutlined,
  ScissorOutlined,
  ApiOutlined,
  DatabaseOutlined,
  SearchOutlined,
  FilterOutlined,
  SettingOutlined,
  // BarChartOutlined,
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
    key: '/search',
    icon: <SearchOutlined />,
    label: '检索',
  },
  {
    key: '/generate',
    icon: <FilterOutlined />,
    label: '生成',
  },
  // {
  //   key: '/evaluation',
  //   icon: <BarChartOutlined />,
  //   label: '评估',
  // },
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
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #f0f0f0',
        background: '#fff'
      }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/settings',
              icon: <SettingOutlined />,
              label: '设置',
            }
          ]}
          onClick={({ key }) => navigate(key)}
        />
      </div>
    </StyledSider>
  );
};

export default Sidebar;