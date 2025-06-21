import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '@/layouts/Header';
import Sidebar from '@/layouts/Sidebar';
import styled from '@emotion/styled';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  height: 100vh;
`;

const StyledContent = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  overflow: auto;
`;

const MainLayout: React.FC = () => {
  return (
    <StyledLayout>
      <Header />
      <Layout style={{ height: 'calc(100vh - 64px)' }}>
        <Sidebar />
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default MainLayout;