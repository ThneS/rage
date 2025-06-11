import React, { useState } from 'react';
import { Row, Col, App } from 'antd';
import DocumentList from '@/components/DocumentLoader/DocumentList';
import LoadConfig from '@/components/DocumentLoader/LoadConfig';
import type { Document } from '@/types/document';
import { documentService } from '@/services/documentService';

const DocumentLoader: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [processing, setProcessing] = useState(false);
  const { message } = App.useApp();

  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleProcess = async (config: {
    prompt: string;
    model: string;
    temperature: number;
    maxTokens: number;
  }) => {
    if (!selectedDocument) {
      message.error('请先选择文档');
      return;
    }

    try {
      setProcessing(true);
      const updatedDoc = await documentService.processDocument(selectedDocument.id, config);
      setSelectedDocument(updatedDoc);
      message.success('文档处理成功');
    } catch (error: any) {
      message.error(`处理失败: ${error.response?.data?.detail || error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 h-full bg-gray-50">
      <Row gutter={16} className="h-full">
        <Col span={12} className="h-full">
          <DocumentList
            onSelectDocument={handleSelectDocument}
            processing={processing}
          />
        </Col>
        <Col span={12} className="h-full">
          <LoadConfig
            selectedDocument={selectedDocument}
            onProcess={handleProcess}
            processing={processing}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DocumentLoader;