import { useEffect, useState } from 'react';
import { Row, Col, Spin, message, Card, Empty } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, selectSelectedDocument, selectDocument } from '@/store/slices/documentSlice';
import DocumentList from '@/components/Document/DocumentList';
import ProcessingColumn from '@/components/Generate/ProcessingColumn';
import GenerateColumn from '@/components/Generate/GenerateColumn';
import type { GenerateState } from '@/store/slices/generateSlice';
import type { Document } from '@/types/document';

const GeneratePage = () => {
  const dispatch = useAppDispatch();
  const { loading: docsLoading, error: docsError } = useAppSelector(state => state.document);
  const { loading: generateLoading, error: generateError, config, result } = useAppSelector(state => state.generate as GenerateState);
  const selectedDocument = useAppSelector(selectSelectedDocument);

  const [formValues, setFormValues] = useState<Record<string, any>>({});

  useEffect(() => {
    dispatch(fetchDocuments());
    // 确保页面加载时清除任何已选择的文档
    dispatch(selectDocument(null));
  }, [dispatch]);

  useEffect(() => {
    console.log('GeneratePage: selectedDocument 变化:', selectedDocument);
  }, [selectedDocument]);

  useEffect(() => {
    console.log('GeneratePage: config 变化:', config);
  }, [config]);

  useEffect(() => {
    if (docsError) {
      message.error(docsError);
    }
    if (generateError) {
      message.error(generateError);
    }
  }, [docsError, generateError]);

  const handleSelectDocument = (document: Document) => {
    console.log('GeneratePage: 选择文档:', document);
    dispatch(selectDocument(document.id));
  };

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <Spin spinning={docsLoading}>
        <Row gutter={16} style={{ height: '100%' }}>
          {/* 左侧：文档列表 + 处理流程 */}
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

              {/* 处理流程 */}
              {selectedDocument ? (
                <div style={{ flex: '1 1 auto' }}>
                  <Card title="文档信息" size="small" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <div style={{
                          background: '#f5f5f5',
                          padding: '10px',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}>
                          <div><strong>文件名：</strong>{selectedDocument.filename}</div>
                          <div><strong>状态：</strong>{selectedDocument.status}</div>
                          <div><strong>大小：</strong>{selectedDocument.file_size} bytes</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          选择文档后可在右侧配置生成参数
                        </div>
                      </div>
                    </div>
                  </Card>
                  <ProcessingColumn
                    documentId={selectedDocument.id}
                    config={config}
                    onFormValuesChange={setFormValues}
                  />
                </div>
              ) : (
                <Card style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Empty description="请先选择一个文档" />
                </Card>
              )}
            </div>
          </Col>

          {/* 右侧：生成配置 + 结果 */}
          <Col span={12}>
            {selectedDocument ? (
              <GenerateColumn
                documentId={selectedDocument.id}
                config={config}
                formValues={formValues}
                result={result}
                processing={generateLoading}
              />
            ) : (
              <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty description="请先选择一个文档" />
              </Card>
            )}
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default GeneratePage;