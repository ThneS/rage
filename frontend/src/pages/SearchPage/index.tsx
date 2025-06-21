import React, { useState, useEffect } from 'react';
import { Row, Col, Modal } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
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
  const {
    vecStoreConfig,
    preConfig,
    postConfig,
    preProcessResult,
    postProcessResult,
    parseResult,
    loading,
  } = useAppSelector((state) => state.search);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [query, setQuery] = useState('');
  const [vecStoreFormValues, setVecStoreFormValues] = useState<Record<string, any>>({});
  const [preProcessFormValues, setPreProcessFormValues] = useState<Record<string, any>>({});
  const [postProcessFormValues, setPostProcessFormValues] = useState<Record<string, any>>({});

  const handleSelectDocument = (doc: Document) => {
    setSelectedDocument(doc);
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
    <Row gutter={16} style={{ height: '100%' }}>
      <Col span={8}>
        <DocumentList onSelectDocument={handleSelectDocument} selectedId={selectedDocument?.id} />
      </Col>
      <Col span={16}>
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
      </Col>
    </Row>
  );
};

export default SearchPage;