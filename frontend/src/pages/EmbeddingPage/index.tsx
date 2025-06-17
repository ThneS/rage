import React, { useState } from 'react';
import { Row, Col } from 'antd';
import EmbeddingList from '@/components/Embedding/EmbeList';
import EmbeddingConfig from '@/components/Embedding/EmbeConfig';
import EmbeddingResult from '@/components/Embedding/EmbeConfig/EmbeResult';
import { useAppSelector } from '@/store';
import type { Document } from '@/types/document';

const EmbeddingPage: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { result: embeddingResult, loading } = useAppSelector(state => state.embedding);

  // 选中文档时，ChunkConfig 会自动请求配置并渲染
  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  // 查看处理结果
  const handleViewEmbedding = () => setModalVisible(true);

  return (
    <div className="p-6 h-full bg-gray-50">
      <Row gutter={16} className="h-full">
        <Col span={12} className="h-full">
          <EmbeddingList
            onSelectDocument={handleSelectDocument}
            selectedId={selectedDocument?.id}
          />
        </Col>
        <Col span={12} className="h-full">
          <EmbeddingConfig
            selectedDocument={selectedDocument}
            processing={loading}
            EmbeddingResult={embeddingResult}
            onViewEmbedding={handleViewEmbedding}
          />
        </Col>
      </Row>
      <EmbeddingResult
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        EmbeddingResult={embeddingResult}
      />
    </div>
  );
};

export default EmbeddingPage;