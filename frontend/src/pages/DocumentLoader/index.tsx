import React, { useState } from 'react';
import { Row, Col } from 'antd';
import DocumentList from '@/components/Document/DocumentList';
import LoadConfig from '@/components/Document/LoadConfig';
import { useAppSelector } from '@/store';
import type { Document, LangChainDocument } from '@/types/document';
import LoadResult from '@/components/Document/LoadConfig/LoadResult';

const DocumentLoader: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const loadResult = useAppSelector(state => state.document.loadResult) as LangChainDocument[] | null;
  const [modalVisible, setModalVisible] = useState(false);

  // 选中文档时，LoadConfig 会自动请求 load-config 并渲染
  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  // 查看加载结果
  const handleViewLoad = () => setModalVisible(true);

  return (
    <div className="p-6 h-full bg-gray-50">
      <Row gutter={16} className="h-full">
        <Col span={12} className="h-full">
          <DocumentList
            onSelectDocument={handleSelectDocument}
            selectedId={selectedDocument?.id}
          />
        </Col>
        <Col span={12} className="h-full">
          <LoadConfig
            selectedDocument={selectedDocument}
            processing={false}
            loadResult={loadResult}
            onViewLoad={handleViewLoad}
          />
        </Col>
      </Row>
      <LoadResult
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        loadResult={loadResult}
      />
    </div>
  );
};

export default DocumentLoader;