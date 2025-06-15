import React, { useState, useMemo } from 'react';
import { Modal, Tree } from 'antd';
import type {LangChainChunk} from "@/types/chunk";

interface ChunkResultModalProps {
  visible: boolean;
  onCancel: () => void;
  ChunkResult: LangChainChunk[] | null;
}

const ChunkResultModal: React.FC<ChunkResultModalProps> = ({
  visible,
  onCancel,
  ChunkResult,
}) => {
  // 计算所有页码
  const pages = useMemo(() => {
    if (!ChunkResult) return [];
    const pageSet = new Set<number>();
    ChunkResult.forEach(chunk => {
      if (chunk.metadata?.page) pageSet.add(chunk.metadata.page);
    });
    return Array.from(pageSet).sort((a, b) => a - b);
  }, [ChunkResult]);

  // 默认选中第一页
  const [selectedPage, setSelectedPage] = useState<number>(pages[0] || 1);

  // 目录树数据
  const treeData = pages.map(page => ({
    title: `页码: ${page}`,
    key: page,
    isLeaf: true,
  }));

  // 当前页的分块
  const pageChunks = (ChunkResult || []).filter(chunk => chunk.metadata?.page === selectedPage);

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      title="分块结果"
    >
      <div style={{ display: 'flex', height: 500 }}>
        {/* 左侧目录树 */}
        <div style={{ flex: 1, overflow: 'auto', borderRight: '1px solid #eee', paddingRight: 16 }}>
          <Tree
            treeData={treeData}
            defaultExpandAll
            selectedKeys={[selectedPage]}
            onSelect={(keys) => {
              const page = Number(keys[0]);
              if (!isNaN(page)) setSelectedPage(page);
            }}
          />
        </div>
        {/* 右侧分块内容 */}
        <div style={{ flex: 2, overflow: 'auto', paddingLeft: 16 }}>
          {pageChunks.length === 0 ? (
            <div>该页暂无分块</div>
          ) : (
            pageChunks.map((chunk) => (
              <div key={chunk.metadata.chunk_id} style={{ marginBottom: 16 }}>
                <b>分块编号: {chunk.metadata.chunk_id}</b>
                <div style={{ whiteSpace: 'pre-wrap', background: '#fafafa', padding: 8, borderRadius: 4 }}>
                  {chunk.page_content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ChunkResultModal;