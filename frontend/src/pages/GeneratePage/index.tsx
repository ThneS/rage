import React, { useState } from 'react';
import { Row, Col } from 'antd';
import DocumentList from '@/components/Document/DocumentList';
import GenerateConfig from '@/components/Generate/GenerateConfig';
import GenerateResult from '@/components/Generate/GenerateConfig/GenerateResult';
import { useAppSelector } from '@/store';
import type { Document } from '@/types/document';

const GeneratePage: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { result: generateResult, loading } = useAppSelector(state => state.generate);

  // 选中文档时，GenerateConfig 会自动请求配置并渲染
  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  // 查看处理结果
  const handleViewGenerate = () => setModalVisible(true);

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
          <GenerateConfig
            selectedDocument={selectedDocument}
            processing={loading}
            generateResult={generateResult}
            onViewGenerate={handleViewGenerate}
          />
        </Col>
      </Row>
      <GenerateResult
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        generateResult={generateResult}
      />
    </div>
  );
};

export default GeneratePage;