import React, { useState } from 'react';
import { Row, Col, Modal } from 'antd';
import DocumentList from '@/components/Document/DocumentList';
import LoadConfig from '@/components/Document/LoadConfig';
import { useAppSelector } from '@/store';
import type { Document } from '@/types/document';

const DocumentLoader: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const loadResult = useAppSelector(state => state.document.loadResult);
  const [modalVisible, setModalVisible] = useState(false);

  // 选中文档时，LoadConfig 会自动请求 load-config 并渲染
  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  // 监听 loadResult 变化自动弹窗
  React.useEffect(() => {
    if (loadResult) {
      setModalVisible(true);
    }
  }, [loadResult]);

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
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        title="加载结果"
      >
        <pre style={{ maxHeight: 500, overflow: 'auto' }}>
          {loadResult ? JSON.stringify(loadResult, null, 2) : '暂无结果'}
        </pre>
      </Modal>
    </div>
  );
};

export default DocumentLoader;