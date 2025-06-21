import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, message, Card, Empty, Input, Button, Typography, Alert } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, selectSelectedDocument, selectDocument } from '@/store/slices/documentSlice';
import { searchVecStore } from '@/store/slices/vecStoreSlice';
import DocumentList from '@/components/Document/DocumentList';
import VecStoreConfig from '@/components/VecStore/VecStoreConfig';
import VecStoreResult from '@/components/VecStore/VecStoreConfig/VecStoreResult';
import type { Document } from '@/types/document';
import { DocumentStatus } from '@/types/commonConfig';

const { TextArea } = Input;
const { Paragraph } = Typography;

const VecStorePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading: docsLoading, error: docsError } = useAppSelector(state => state.document);
  const { result: vecStoreResult, loading, searchResult } = useAppSelector(state => state.vecStore);
  const selectedDocument = useAppSelector(selectSelectedDocument);
  const [modalVisible, setModalVisible] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [outputText, setOutputText] = useState('');

  useEffect(() => {
    dispatch(fetchDocuments());
    // 确保页面加载时清除任何已选择的文档
    dispatch(selectDocument(null));
  }, [dispatch]);

  useEffect(() => {
    if (docsError) {
      message.error(docsError);
    }
  }, [docsError]);

  useEffect(() => {
    if (searchResult !== null) {
      setOutputText(searchResult);
    }
  }, [searchResult]);

  const handleSelectDocument = (document: Document) => {
    dispatch(selectDocument(document.id));
  };

  const handleSearch = () => {
    if (selectedDocument?.id) {
      dispatch(searchVecStore(selectedDocument.id, queryText));
    }
  };

  // 查看处理结果
  const handleViewVecStore = () => setModalVisible(true);

  // 检查文档是否可以搜索
  const canSearch = selectedDocument?.status === DocumentStatus.STORED;

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <Spin spinning={docsLoading}>
        <Row gutter={16} style={{ height: '100%' }}>
          {/* 左侧：文档列表 + 搜索区域 */}
          <Col span={12}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* 文档列表 */}
              <div style={{ flex: '0 0 auto', marginBottom: '20px' }}>
                <DocumentList
                  onSelectDocument={handleSelectDocument}
                  selectedId={selectedDocument?.id}
                  showUpload={false}
                />
              </div>

              {/* 搜索区域 */}
              {selectedDocument ? (
                <div style={{ flex: '1 1 auto' }}>
                  <Card title="向量检索" size="small">
                    {!canSearch && (
                      <Alert
                        message="文档尚未完成向量存储处理"
                        description={`当前文档状态：${selectedDocument.status}。请先在右侧进行向量存储处理，完成后才能进行搜索。`}
                        type="warning"
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>输入</div>
                        <TextArea
                          rows={3}
                          value={queryText}
                          onChange={(e) => setQueryText(e.target.value)}
                          placeholder="请输入检索内容"
                          disabled={!canSearch}
                        />
                      </div>
                      <div>
                        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>输出</div>
                        <Paragraph
                          style={{
                            whiteSpace: 'pre-wrap',
                            background: '#f5f5f5',
                            padding: '10px',
                            borderRadius: '4px',
                            minHeight: '80px',
                            margin: 0
                          }}
                          copyable
                        >
                          {outputText || '检索结果将在此显示'}
                        </Paragraph>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          type="primary"
                          onClick={handleSearch}
                          disabled={!queryText.trim() || !canSearch}
                        >
                          检索
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <Card style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Empty description="请先选择一个文档" />
                </Card>
              )}
            </div>
          </Col>

          {/* 右侧：向量存储配置 + 结果 */}
          <Col span={12}>
            {selectedDocument ? (
              <VecStoreConfig
                selectedDocument={selectedDocument}
                processing={loading}
                VecStoreResult={vecStoreResult || undefined}
                onViewVecStore={handleViewVecStore}
              />
            ) : (
              <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty description="请先选择一个文档" />
              </Card>
            )}
          </Col>
        </Row>
      </Spin>
      <VecStoreResult
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        VecStoreResult={vecStoreResult || undefined}
      />
    </div>
  );
};

export default VecStorePage;