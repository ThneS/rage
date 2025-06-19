import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Popconfirm,
  Tag,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, deleteDocument } from '@/store/slices/documentSlice';
import type { Document } from '@/types/document';
import { DocumentStatus } from '@/types/commonConfig';
import { documentStatusConfig } from '@/types/commonConfig';

const iconMap = {
  ClockCircleOutlined: ClockCircleOutlined,
  CheckCircleOutlined: CheckCircleOutlined,
  CloseCircleOutlined: CloseCircleOutlined,
};

interface ChunkListProps {
  onSelectDocument?: (document: Document) => void;
  selectedId?: number;
}

const ChunkList: React.FC<ChunkListProps> = ({ onSelectDocument, selectedId }) => {
  const dispatch = useAppDispatch();
  const { documents, loading } = useAppSelector((state) => state.document);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 只显示已加载的文档
  const loadedDocuments = useMemo(() => {
    // return documents.filter(doc => doc.status === DocumentStatus.LOADED || doc.status === DocumentStatus.CHUNKED);
    return documents;
  }, [documents]);

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
    <Card
      title={
        <div className="flex justify-between items-center">
          <span>已加载文档列表</span>
          <span className="text-sm text-gray-500">
            共 {loadedDocuments.length} 个文档
          </span>
        </div>
      }
    >
      <Table
        style={{ marginTop: 16 }}
        loading={loading}
        rowKey="id"
        columns={columns}
        dataSource={loadedDocuments}
        pagination={false}
        rowSelection={{
          type: 'radio',
          selectedRowKeys,
          onChange: (keys) => {
            setSelectedRowKeys(keys);
            const selectedDoc = loadedDocuments.find(doc => doc.id === keys[0]);
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
        locale={{
          emptyText: '暂无已加载的文档'
        }}
      />
    </Card>
  );
};

export default ChunkList;