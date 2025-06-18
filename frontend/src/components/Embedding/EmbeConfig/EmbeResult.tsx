import React, { useState, useMemo } from 'react';
import { Modal, Tree } from 'antd';
import type {LangChainEmbedding} from "@/types/embedding";

interface EmbeddingResultModalProps {
  visible: boolean;
  onCancel: () => void;
  EmbeddingResult: LangChainEmbedding[] | null;
}

const EmbeddingResultModal: React.FC<EmbeddingResultModalProps> = ({
  visible,
  onCancel,
  EmbeddingResult,
}) => {
  // 计算所有页码
  const pages = useMemo(() => {
    if (!EmbeddingResult) return [];
    const pageSet = new Set<number>();
    EmbeddingResult.forEach(embedding => {
      if (embedding.metadata?.page) pageSet.add(embedding.metadata.page);
    });
    return Array.from(pageSet).sort((a, b) => a - b);
  }, [EmbeddingResult]);

  // 默认选中第一页
  const [selectedPage, setSelectedPage] = useState<number>(pages[0] || 1);

  // 目录树数据
  const treeData = pages.map(page => ({
    title: `页码: ${page}`,
    key: page,
    isLeaf: true,
  }));

  // 当前页的嵌入的数据
  const pageEmbeddings = (EmbeddingResult || []).filter(embedding => embedding.metadata?.page === selectedPage);

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      title="嵌入结果"
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
        {/* 右侧内容 */}
        <div style={{ flex: 2, overflow: 'auto', paddingLeft: 16 }}>
          {pageEmbeddings.length === 0 ? (
            <div>该页暂无结果</div>
          ) : (
            pageEmbeddings.map((embedding) => (
              <div key={embedding.metadata.embedding_id} style={{ marginBottom: 16 }}>
                <b>编号: {embedding.metadata.embedding_id}</b>
                <div style={{ whiteSpace: 'pre-wrap', background: '#fafafa', padding: 8, borderRadius: 4 }}>
                  {embedding.embedding}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EmbeddingResultModal;