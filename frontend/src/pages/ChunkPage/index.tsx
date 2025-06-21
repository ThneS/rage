import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, message, Card, Empty } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, selectSelectedDocument, selectDocument } from '@/store/slices/documentSlice';
import DocumentList from '@/components/Document/DocumentList';
import ChunkConfig from '@/components/Chunk/ChunkConfig';
import ChunkResult from '@/components/Chunk/ChunkConfig/ChunkResult';
import type { Document } from '@/types/document';

const ChunkPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading: docsLoading, error: docsError } = useAppSelector(state => state.document);
  const { result: chunkResult, loading } = useAppSelector(state => state.chunk);
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
  const handleViewChunk = () => setModalVisible(true);

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

              {/* 空状态 */}
              {!selectedDocument && (
                <Card style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Empty description="请先选择一个文档" />
                </Card>
              )}
            </div>
          </Col>

          {/* 右侧：分块配置 + 结果 */}
          <Col span={12}>
            {selectedDocument ? (
              <ChunkConfig
                selectedDocument={selectedDocument}
                processing={loading}
                ChunkResult={chunkResult}
                onViewChunk={handleViewChunk}
              />
            ) : (
              <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty description="请先选择一个文档" />
              </Card>
            )}
          </Col>
        </Row>
      </Spin>
      <ChunkResult
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        ChunkResult={chunkResult}
      />
    </div>
  );
};

export default ChunkPage;