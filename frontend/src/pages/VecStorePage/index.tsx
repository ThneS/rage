import React, { useState } from 'react';
import { Row, Col } from 'antd';
import VecStoreConfig from '@/components/VecStore/VecStoreConfig';
import VecStoreResult from '@/components/VecStore/VecStoreConfig/VecStoreResult';
import { useAppSelector } from '@/store';
import type { Document } from '@/types/document';
import VecStoreList from '@/components/VecStore/VecStoreList';

const VecStorePage: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { result: vecStoreResult, loading } = useAppSelector(state => state.vecStore);

  // 选中文档时，ChunkConfig 会自动请求配置并渲染
  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  // 查看处理结果
  const handleViewVecStore = () => setModalVisible(true);

  return (
    <div className="p-6 h-full bg-gray-50">
      <Row gutter={16} className="h-full">
        <Col span={12} className="h-full">
          <VecStoreList
            onSelectDocument={handleSelectDocument}
            selectedId={selectedDocument?.id}
          />
        </Col>
        <Col span={12} className="h-full">
          <VecStoreConfig
            selectedDocument={selectedDocument}
            processing={loading}
            VecStoreResult={vecStoreResult}
            onViewVecStore={handleViewVecStore}
          />
        </Col>
      </Row>
      <VecStoreResult
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        VecStoreResult={vecStoreResult}
      />
    </div>
  );
};

export default VecStorePage;