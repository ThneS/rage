import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Popconfirm,
  Tag,
  Typography
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, deleteDocument } from '@/store/slices/documentSlice';
import { searchVecStore } from '@/store/slices/vecStoreSlice';
import type { Document } from '@/types/document';
import { DocumentStatus } from '@/types/commonConfig';
import { documentStatusConfig } from '@/types/commonConfig';

const iconMap = {
  ClockCircleOutlined: ClockCircleOutlined,
  CheckCircleOutlined: CheckCircleOutlined,
  CloseCircleOutlined: CloseCircleOutlined,
};

interface VecStoreListProps {
  onSelectDocument?: (document: Document) => void;
  selectedId?: number;
}

const VecStoreList: React.FC<VecStoreListProps> = ({ onSelectDocument, selectedId }) => {
  const dispatch = useAppDispatch();
  const { documents, loading } = useAppSelector((state) => state.document);
  const searchResult = useAppSelector(state => state.vecStore.searchResult);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [queryText, setQueryText] = useState('');
  const [outputText, setOutputText] = useState('');

  // 只显示已加载的文档
  const loadedDocuments = useMemo(() => {
    // return documents.filter(doc => doc.status === DocumentStatus.LOADED || doc.status === DocumentStatus.CHUNKED);
    return documents;
  }, [documents]);

  // 获取当前选中的文档
  const selectedDocument = useMemo(() => loadedDocuments.find(doc => doc.id === selectedId), [loadedDocuments, selectedId]);

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

  useEffect(() => {
    if (searchResult !== null) {
      setOutputText(searchResult);
    }
  }, [searchResult]);

  const handleDelete = (id: number) => {
    dispatch(deleteDocument(id));
  };

  const handleSearch = () => {
    // setOutputText(''); // 先清空输出框
    if (selectedId) {
      dispatch(searchVecStore(selectedId, queryText));
    }
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
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 0 }}>
      {/* Table 区域 */}
      <Card
        style={{ marginBottom: 32 }}
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
      {/* 输入输出区 */}
      {selectedDocument && selectedDocument.status === DocumentStatus.STORED ? (
        <Card style={{ width: '100%', boxShadow: '0 2px 12px #0001', borderRadius: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="vecstore-query-input" style={{ fontWeight: 500, fontSize: 16 }}>输入</label>
              <textarea
                id="vecstore-query-input"
                style={{ width: '100%', height: 90, marginTop: 8, borderRadius: 14, border: '1.5px solid #bbb', padding: 12, fontSize: 15, boxShadow: '0 1px 6px #0001', resize: 'vertical', background: '#fafbfc', color: '#111' }}
                value={queryText}
                onChange={e => setQueryText(e.target.value)}
                placeholder="请输入检索内容"
              />
            </div>
            <div>
              <label htmlFor="vecstore-query-output" style={{ fontWeight: 500, fontSize: 16 }}>输出</label>
              <Typography.Paragraph
                copyable={{
                  tooltips: false,
                  icon: [
                    <span style={{ fontSize: 18, color: '#888', marginLeft: 8 }} key="copy">📋</span>,
                    <span style={{ fontSize: 18, color: '#52c41a', marginLeft: 8 }} key="copied">✔️</span>
                  ]
                }}
                style={{
                  width: '100%',
                  minHeight: 90,
                  marginTop: 8,
                  borderRadius: 14,
                  border: '1.5px solid #bbb',
                  padding: 12,
                  fontSize: 15,
                  boxShadow: '0 1px 6px #0001',
                  background: '#fafbfc',
                  color: outputText ? '#111' : '#bbb',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  marginBottom: 0,
                  position: 'relative',
                  paddingRight: 40
                }}
              >
                {outputText
                  ? outputText
                  : <span style={{ color: '#bbb', fontStyle: 'italic' }}>检索结果将在此显示</span>
                }
              </Typography.Paragraph>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button type="primary" onClick={handleSearch} disabled={!queryText.trim()} style={{ minWidth: 100 }}>
                检索
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card style={{ width: '100%', textAlign: 'center', color: '#888', fontSize: 18, padding: 40, boxShadow: '0 2px 12px #0001', borderRadius: 16 }}>
          请先选择一个已存储的文档
        </Card>
      )}
    </div>
  );
};

export default VecStoreList;