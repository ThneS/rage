import React, { useState } from 'react';
import { Row, Col } from 'antd';
import styled from '@emotion/styled';
import DocumentList from '@/components/DocumentLoader/DocumentList';
import LoadConfig from '@/components/DocumentLoader/LoadConfig';
import type { Document } from '@/types/document';

const Container = styled.div`
  padding: 24px;
  height: 100%;
`;

const DocumentLoader: React.FC = () => {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSelectDocument = (document: Document) => {
    setCurrentDocument(document);
  };

  const handleDocumentUpdate = (document: Document) => {
    setCurrentDocument(document);
  };

  return (
    <Container>
      <Row gutter={24} style={{ height: '100%' }}>
        {/* 左侧：文件列表和上传 */}
        <Col span={12}>
          <DocumentList
            onSelectDocument={handleSelectDocument}
            processing={processing}
          />
        </Col>

        {/* 右侧：加载工具配置 */}
        <Col span={12}>
          <LoadConfig
            currentDocument={currentDocument}
            onDocumentUpdate={handleDocumentUpdate}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default DocumentLoader;