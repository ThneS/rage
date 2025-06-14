import React, { useState } from 'react';
import { Row, Col, App, Modal, Button } from 'antd';
import DocumentList from '@/components/Document/DocumentList';
import LoadConfig from '@/components/Document/LoadConfig';
import { documentService } from '@/services/documentService';
import type { Document, DocumentLoadConfig } from '@/types/document';

const DocumentLoader: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loadResult, setLoadResult] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { message } = App.useApp();

  // 选中文档时，LoadConfig 会自动请求 load-config 并渲染
  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
    setLoadResult(null); // 切换文档时清空上次结果
  };

  // 点击"开始加载"按钮
  const handleProcess = async (config: DocumentLoadConfig) => {
    if (!selectedDocument) {
      message.error('请先选择文档');
      return;
    }
    try {
      setProcessing(true);
      // 调用 /parse 接口
      const res = await documentService.processDocument(selectedDocument.id, config);
      setLoadResult(res); // 保存加载结果
      setModalVisible(true); // 自动弹窗
      message.success('文档加载成功');
    } catch (error: any) {
      message.error(`加载失败: ${error.response?.data?.message || error.message}`);
    } finally {
      setProcessing(false);
    }
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
            onProcess={handleProcess}
            processing={processing}
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