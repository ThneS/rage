import React, { useState, useMemo } from 'react';
import { Modal, Tree } from 'antd';
import type {LangChainGenerate} from "@/types/generate";

interface GenerateResultModalProps {
  visible: boolean;
  onCancel: () => void;
  GenerateResult: LangChainGenerate[] | null;
}

const GenerateResultModal: React.FC<GenerateResultModalProps> = ({
  visible,
  onCancel,
  GenerateResult,
}) => {
  // 计算所有页码
  const pages = useMemo(() => {
    if (!GenerateResult) return [];
    const pageSet = new Set<number>();
    GenerateResult.forEach(generate => {
      if (generate.metadata?.page) pageSet.add(generate.metadata.page);
    });
    return Array.from(pageSet).sort((a, b) => a - b);
  }, [GenerateResult]);

  // 默认选中第一页
  const [selectedPage, setSelectedPage] = useState<number>(pages[0] || 1);

  // 目录树数据
  const treeData = pages.map(page => ({
    title: `页码: ${page}`,
    key: page,
    isLeaf: true,
  }));

  // 当前页的分块
  const pageGenerates = (GenerateResult || []).filter(generate => generate.metadata?.page === selectedPage);

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
          {pageGenerates.length === 0 ? (
            <div>该页暂无分块</div>
          ) : (
            pageGenerates.map((generate) => (
              <div key={generate.metadata.generate_id} style={{ marginBottom: 16 }}>
                <b>分块编号: {generate.metadata.generate_id}</b>
                <div style={{ whiteSpace: 'pre-wrap', background: '#fafafa', padding: 8, borderRadius: 4 }}>
                  {generate.page_content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default GenerateResultModal;