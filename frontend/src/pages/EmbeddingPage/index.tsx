import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, message, Card, Empty } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, selectSelectedDocument, selectDocument } from '@/store/slices/documentSlice';
import DocumentList from '@/components/Document/DocumentList';
import EmbeddingConfig from '@/components/Embedding/EmbeConfig';
import EmbeddingResult from '@/components/Embedding/EmbeConfig/EmbeResult';
import type { Document } from '@/types/document';

const EmbeddingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading: docsLoading, error: docsError } = useAppSelector(state => state.document);
  const { result: embeddingResult, loading } = useAppSelector(state => state.embedding);
  const selectedDocument = useAppSelector(selectSelectedDocument);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleSelectDocument = (document: Document) => {
    dispatch(selectDocument(document.id));
  };

  // 查看处理结果
  const handleViewEmbedding = () => setModalVisible(true);

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <Spin spinning={docsLoading}>
        <Row gutter={16} style={{ height: '100%' }}>
          {/* 左侧：文档列表 */}
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

              {/* 提示区域 */}
              {!selectedDocument && (
                <Card style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Empty description="请先选择一个文档" />
                </Card>
              )}
            </div>
          </Col>

          {/* 右侧：嵌入配置 + 结果 */}
          <Col span={12}>
            {selectedDocument ? (
              <EmbeddingConfig
                selectedDocument={selectedDocument}
                processing={loading}
                EmbeddingResult={embeddingResult}
                onViewEmbedding={handleViewEmbedding}
              />
            ) : (
              <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty description="请先选择一个文档" />
              </Card>
            )}
          </Col>
        </Row>
      </Spin>
      <EmbeddingResult
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        EmbeddingResult={embeddingResult}
      />
    </div>
  );
};

export default EmbeddingPage;