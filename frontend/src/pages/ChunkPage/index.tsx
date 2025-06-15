import React, { useState, useEffect } from 'react';
import { Row, Col, message } from 'antd';
import ChunkList from '@/components/Chunk/ChunkList';
import ChunkConfig from '@/components/Chunk/ChunkConfig';
import ChunkResult from '@/components/Chunk/ChunkConfig/ChunkResult';
import { useAppDispatch, useAppSelector } from '@/store';
import { processChunk } from '@/store/slices/chunkSlice';
import type { Document } from '@/types/document';

const ChunkPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [processing, setProcessing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { result: chunkResult, config, loading } = useAppSelector(state => state.chunk);

  // 选中文档时，自动获取配置并处理
  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
    // 如果文档状态不是 loaded，提示用户
    if (document.status !== 'loaded') {
      message.warning('请先确保文档已加载完成');
      return;
    }
  };

  // 监听配置变化，自动开始处理
  useEffect(() => {
    const startProcessing = async () => {
      if (config && selectedDocument && !processing && !chunkResult) {
        try {
          setProcessing(true);
          await dispatch(processChunk(selectedDocument.id, config));
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : '处理失败';
          message.error(errorMessage);
        } finally {
          setProcessing(false);
        }
      }
    };

    startProcessing();
  }, [config, selectedDocument, processing, chunkResult, dispatch]);

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