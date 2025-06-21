import React, { useEffect } from 'react';
import { Tabs, Card, message, Spin, Alert } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchBackendConfig, loadFrontendConfig } from '@/store/slices/configSlice';
import BackendConfig from './BackendConfig';
import FrontendConfig from './FrontendConfig';

const SettingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { backendConfig, frontendConfig, loading, error } = useAppSelector(state => state.config);

  useEffect(() => {
    // 加载配置
    dispatch(fetchBackendConfig());
    dispatch(loadFrontendConfig());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const items = [
    {
      key: 'backend',
      label: '后端设置',
      children: (
        <BackendConfig
          config={backendConfig}
          loading={loading}
        />
      ),
    },
    {
      key: 'frontend',
      label: '前端设置',
      children: (
        <FrontendConfig
          config={frontendConfig}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', height: '100vh', overflow: 'auto' }}>
      <Card title="系统设置" style={{ height: '100%' }}>
        <Spin spinning={loading}>
          {error && (
            <Alert
              message="配置加载失败"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}
          <Tabs
            defaultActiveKey="backend"
            items={items}
            style={{ height: 'calc(100% - 60px)' }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default SettingPage;
