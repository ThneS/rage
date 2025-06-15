import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, message } from 'antd';
import ChunkList from '@/components/Chunk/ChunkList';
import ChunkConfig from '@/components/Chunk/ChunkConfig';
import ChunkResult from '@/components/Chunk/ChunkConfig/ChunkResult';
import { useAppSelector } from '@/store';
import type { Document } from '@/types/document';

const ChunkPage: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [processing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const hasAttemptedRef = useRef(false);

  const { result: chunkResult, loading } = useAppSelector(state => state.chunk);

  // 选中文档时，自动获取配置并处理
  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
    hasAttemptedRef.current = false;  // 重置尝试标志
    // 如果文档状态不是 loaded，提示用户
    if (document.status !== 'loaded') {
      message.warning('请先确保文档已加载完成');
      return;
    }
  };

  // 监听处理结果变化自动弹窗
  useEffect(() => {
    if (chunkResult) {
      setModalVisible(true);
    }
  }, [chunkResult]);

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
            processing={processing || loading}
            ChunkResult={chunkResult}
            onViewChunk={handleViewChunk}
          />
        </Col>
      </Row>
      <ChunkResult
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        loadResult={chunkResult}
      />
    </div>
  );
};

export default ChunkPage;