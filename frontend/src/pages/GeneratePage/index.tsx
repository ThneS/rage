import { useEffect, useState } from 'react';
import { Row, Col, Spin, message, Card, Empty } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, selectSelectedDocument, selectDocument } from '@/store/slices/documentSlice';
import { setConfig, setResult } from '@/store/slices/generateSlice';
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

  const [formValues, setFormValues] = useState<Record<string, string | number | boolean>>({});

  useEffect(() => {
    dispatch(fetchDocuments());
    // 确保页面加载时清除任何已选择的文档
    dispatch(selectDocument(null));
    // 清除生成配置和结果
    dispatch(setConfig(null));
    dispatch(setResult(null));
  }, [dispatch]);

  useEffect(() => {
    if (docsError) {
      message.error(docsError);
    }
    if (generateError) {
      message.error(generateError);
    }
  }, [docsError, generateError]);

  const handleSelectDocument = (document: Document) => {
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
                selectedDocument={selectedDocument}
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