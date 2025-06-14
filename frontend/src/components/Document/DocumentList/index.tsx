import React, { useState, useEffect } from 'react';
import {
  Card,
  Upload,
  Button,
  Table,
  Popconfirm,
  Spin,
} from 'antd';
import {
  InboxOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, uploadDocument, deleteDocument } from '@/store/slices/documentSlice';
import type { Document } from '@/types/document';

const { Dragger } = Upload;

interface DocumentListProps {
  onSelectDocument: (document: Document) => void;
  selectedId?: number;
}

const DocumentList: React.FC<DocumentListProps> = ({ onSelectDocument, selectedId }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const dispatch = useAppDispatch();
  const serverFiles = useAppSelector(state => state.document.documents);
  const loading = useAppSelector(state => state.document.loading);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleUpload = async (file: RcFile) => {
    dispatch(uploadDocument(file));
    return false; // 阻止默认上传行为
  };

  const handleDelete = (id: number) => {
    dispatch(deleteDocument(id));
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'filename',
      key: 'filename',
      render: (text: string, record: Document) => (
        <span style={{ color: record.filename.endsWith('.pdf') ? 'red' : undefined }}>
          {text}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Document) => (
        <Popconfirm
          title="确定删除该文档？"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type="link" icon={<DeleteOutlined />} danger>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card
      title="文档列表"
      className="h-full flex flex-col"
      styles={{
        body: {
          height: 'calc(100% - 57px)',
          overflowY: 'auto'
        }
      }}
    >
      <div className="mb-4">
        <Dragger
          fileList={fileList}
          onChange={info => setFileList(info.fileList)}
          beforeUpload={handleUpload}
          maxCount={1}
          accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.md,.html"
          showUploadList={false}
          className="bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors duration-300"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-4xl text-blue-500" />
          </p>
          <p className="ant-upload-text text-base font-medium">
            点击或拖拽文件到此区域上传
          </p>
          <p className="ant-upload-hint text-sm text-gray-500">
            支持 PDF、DOCX、CSV、MD、HTML、TXT 等格式
          </p>
        </Dragger>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Spin spinning={loading}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={serverFiles}
            pagination={false}
            rowClassName={record => (record.id === selectedId ? 'ant-table-row-selected' : '')}
            onRow={record => ({
              onClick: () => onSelectDocument(record),
              style: { cursor: 'pointer' },
            })}
          />
        </Spin>
      </div>
    </Card>
  );
};

export default DocumentList;