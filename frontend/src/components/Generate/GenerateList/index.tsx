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
import { fetchGenerateList, deleteGenerate } from '@/store/slices/generateSlice';
import type { Generate } from '@/types/generate';
import { GenerateStatus } from '@/types/commonConfig';
import { generateStatusConfig } from '@/types/commonConfig';

const iconMap = {
  ClockCircleOutlined: ClockCircleOutlined,
  CheckCircleOutlined: CheckCircleOutlined,
  CloseCircleOutlined: CloseCircleOutlined,
};

interface GenerateListProps {
  onSelectGenerate?: (generate: Generate) => void;
  selectedId?: number;
}

const GenerateList: React.FC<GenerateListProps> = ({ onSelectGenerate, selectedId }) => {
  const dispatch = useAppDispatch();
  const { generateList, loading } = useAppSelector((state) => state.generate);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 只显示已生成的记录
  const loadedGenerates = useMemo(() => {
    // return generateList.filter(gen => gen.status === GenerateStatus.COMPLETED || gen.status === GenerateStatus.PROCESSING);
    return generateList;
  }, [generateList]);

  useEffect(() => {
    dispatch(fetchGenerateList());
  }, [dispatch]);

  useEffect(() => {
    if (selectedId) {
      setSelectedRowKeys([selectedId]);
    } else {
      setSelectedRowKeys([]);
    }
  }, [selectedId]);

  const handleDelete = (id: number) => {
    dispatch(deleteGenerate(id));
  };

  const columns: ColumnsType<Generate> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Generate) => (
        <a onClick={() => onSelectGenerate?.(record)}>{text}</a>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: GenerateStatus) => {
        const config = generateStatusConfig[status];
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
          title="确定删除该生成记录？"
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
          <span>生成记录列表</span>
          <span className="text-sm text-gray-500">
            共 {loadedGenerates.length} 条记录
          </span>
        </div>
      }
    >
      <Table
        style={{ marginTop: 16 }}
        loading={loading}
        rowKey="id"
        columns={columns}
        dataSource={loadedGenerates}
        pagination={false}
        rowSelection={{
          type: 'radio',
          selectedRowKeys,
          onChange: (keys) => {
            setSelectedRowKeys(keys);
            const selectedGen = loadedGenerates.find(gen => gen.id === keys[0]);
            if (selectedGen) {
              onSelectGenerate?.(selectedGen);
            }
          },
        }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedRowKeys([record.id]);
            onSelectGenerate?.(record);
          },
        })}
        locale={{
          emptyText: '暂无生成记录'
        }}
      />
    </Card>
  );
};

export default GenerateList;