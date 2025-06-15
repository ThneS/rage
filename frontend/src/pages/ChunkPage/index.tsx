import React, { useState } from 'react';
import { Row, Col } from 'antd';
import ChunkList from '@/components/Chunk/ChunkList';
import ChunkConfig from '@/components/Chunk/ChunkConfig';
import ChunkResult from '@/components/Chunk/ChunkConfig/ChunkResult';
import { useAppSelector } from '@/store';
import type { Document } from '@/types/document';

const ChunkPage: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { result: chunkResult, loading } = useAppSelector(state => state.chunk);

  // 选中文档时，ChunkConfig 会自动请求配置并渲染
  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  // 查看处理结果
  const handleViewChunk = () => setModalVisible(true);

  return (
    <div className="p-6 h-full bg-gray-50">
      <Row gutter={16} className="h-full">
        <Col span={12} className="h-full">
          <ChunkList
            onSelectDocument={handleSelectDocument}
            selectedId={selectedDocument?.id}
          />
        </Col>
        <Col span={12} className="h-full">
          <ChunkConfig
            selectedDocument={selectedDocument}
            processing={loading}
            ChunkResult={chunkResult}
            onViewChunk={handleViewChunk}
          />
        </Col>
      </Row>
      <ChunkResult
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        ChunkResult={chunkResult}
      />
    </div>
  );
};

export default ChunkPage;