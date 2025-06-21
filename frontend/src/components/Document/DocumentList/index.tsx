import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Upload,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import {
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, RcFile } from 'antd/es/upload';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, uploadDocument, deleteDocument } from '@/store/slices/documentSlice';
import type { Document } from '@/types/document';
import { documentStatusConfig, type DocumentStatus } from '@/types/commonConfig';

const { Dragger } = Upload;

const iconMap = {
  ClockCircleOutlined: ClockCircleOutlined,
  CheckCircleOutlined: CheckCircleOutlined,
  CloseCircleOutlined: CloseCircleOutlined,
};

interface DocumentListProps {
  onSelectDocument?: (document: Document) => void;
  selectedId?: number;
  showUpload?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({ onSelectDocument, selectedId, showUpload = false }) => {
  const dispatch = useAppDispatch();
  const { documents, loading } = useAppSelector((state) => state.document);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  useEffect(() => {
    if (selectedId) {
      setSelectedRowKeys([selectedId]);
    } else {
      setSelectedRowKeys([]);
    }
  }, [selectedId]);

  const handleUpload = async (file: RcFile) => {
    try {
      await dispatch(uploadDocument(file));
      message.success('上传成功');
      setFileList([]);
    } catch (error) {
      message.error('上传失败');
    }
    return false;
  };

  const handleDelete = (id: number) => {
    dispatch(deleteDocument(id));
  };

  const columns: ColumnsType<Document> = [
    {
      title: '名称',
      dataIndex: 'filename',
      key: 'filename',
      render: (text: string, record: Document) => (
        <a onClick={() => onSelectDocument?.(record)}>{text}</a>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: DocumentStatus) => {
        const config = documentStatusConfig[status];
        const Icon = iconMap[config.iconType as keyof typeof iconMap];
        return (
          <Tag color={config.color} icon={<Icon />}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Popconfirm
          title="确定删除该文档？"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type="link" danger>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card title="文档列表">
      {showUpload && (
        <Dragger
          fileList={fileList}
          beforeUpload={handleUpload}
          onChange={({ fileList }) => setFileList(fileList)}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        </Dragger>
      )}
      <Table
        style={{ marginTop: showUpload ? 16 : 0 }}
        loading={loading}
        rowKey="id"
        columns={columns}
        dataSource={documents}
        pagination={false}
        rowSelection={{
          type: 'radio',
          selectedRowKeys,
          onChange: (keys) => {
            setSelectedRowKeys(keys);
            const selectedDoc = documents.find(doc => doc.id === keys[0]);
            if (selectedDoc) {
              onSelectDocument?.(selectedDoc);
            }
          },
        }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedRowKeys([record.id]);
            onSelectDocument?.(record);
          },
        })}
      />
    </Card>
  );
};

export default DocumentList;