import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DatabaseOutlined,
  SearchOutlined,
  FilterOutlined,
  SettingOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  ApartmentOutlined,
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
    key: '/document',
    icon: <UploadOutlined />,
    label: '文档上传',
  },
  {
    key: '/chunk',
    icon: <MenuUnfoldOutlined />,
    label: '分块处理',
  },
  {
    key: '/embedding',
    icon: <ApartmentOutlined />,
    label: '向量化',
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