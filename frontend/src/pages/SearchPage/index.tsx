import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Spin, message, Card, Empty } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, selectSelectedDocument, selectDocument } from '@/store/slices/documentSlice';
import {
  fetchSearchConfigs,
  fetchVecStoreConfigForSearch,
  runPreProcess,
  runPostProcess,
  runParse,
} from '@/store/slices/searchSlice';
import DocumentList from '@/components/Document/DocumentList';
import SearchProcessing from '@/components/Search/SearchProcessing';
import type { Document } from '@/types/document';

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading: docsLoading, error: docsError } = useAppSelector(state => state.document);
  const {
    vecStoreConfig,
    preConfig,
    postConfig,
    preProcessResult,
    postProcessResult,
    parseResult,
    loading,
  } = useAppSelector((state) => state.search);

  const selectedDocument = useAppSelector(selectSelectedDocument);
  const [currentStep, setCurrentStep] = useState(0);
  const [query, setQuery] = useState('');
  const [vecStoreFormValues, setVecStoreFormValues] = useState<Record<string, any>>({});
  const [preProcessFormValues, setPreProcessFormValues] = useState<Record<string, any>>({});
  const [postProcessFormValues, setPostProcessFormValues] = useState<Record<string, any>>({});

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

  const handleSelectDocument = (doc: Document) => {
    dispatch(selectDocument(doc.id));
    dispatch(fetchSearchConfigs(doc.id));
    dispatch(fetchVecStoreConfigForSearch(doc.id));
    setCurrentStep(0);
    setVecStoreFormValues(vecStoreConfig?.default_config || {});
    setPreProcessFormValues(preConfig?.default_config || {});
    setPostProcessFormValues(postConfig?.default_config || {});
  };

  const handlePreProcess = () => {
    if (selectedDocument) {
      dispatch(runPreProcess(selectedDocument.id, query, vecStoreFormValues));
      setCurrentStep(1);
    }
  };

  const handlePostProcess = (content: string) => {
    if (selectedDocument) {
      dispatch(runPostProcess(selectedDocument.id, content, preProcessFormValues));
      setCurrentStep(2);
    }
  };

  const handleParse = (content: string) => {
    if (selectedDocument) {
      dispatch(runParse(selectedDocument.id, content));
    }
  };

  useEffect(() => {
    if (parseResult) {
        Modal.success({
            title: '解析结果',
            content: <pre>{JSON.stringify(parseResult, null, 2)}</pre>,
            width: '60%',
        });
    }
  }, [parseResult]);

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

          {/* 右侧：搜索处理配置 + 结果 */}
          <Col span={12}>
            {selectedDocument ? (
              <SearchProcessing
                currentStep={currentStep}
                selectedDocument={selectedDocument}
                vecStoreConfig={vecStoreConfig}
                vecStoreFormValues={vecStoreFormValues}
                onVecStoreFormValuesChange={setVecStoreFormValues}
                preConfig={preConfig}
                postConfig={postConfig}
                preProcessFormValues={preProcessFormValues}
                onPreProcessFormValuesChange={setPreProcessFormValues}
                postProcessFormValues={postProcessFormValues}
                onPostProcessFormValuesChange={setPostProcessFormValues}
                preProcessResult={preProcessResult}
                postProcessResult={postProcessResult}
                query={query}
                onQueryChange={setQuery}
                onPreProcess={handlePreProcess}
                onPostProcess={handlePostProcess}
                onParse={handleParse}
                onStepChange={setCurrentStep}
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

export default SearchPage;