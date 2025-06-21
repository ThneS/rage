import React, { useState, useMemo } from 'react';
import { Modal, Tree } from 'antd';
import type {LangChainSearch} from "@/types/search";

interface SearchResultModalProps {
  visible: boolean;
  onCancel: () => void;
  SearchResult: LangChainSearch[] | null;
}

const SearchResultModal: React.FC<SearchResultModalProps> = ({
  visible,
  onCancel,
  SearchResult,
}) => {
  // 计算所有页码
  const pages = useMemo(() => {
    if (!SearchResult) return [];
    const pageSet = new Set<number>();
    SearchResult.forEach(search => {
      if (search.metadata?.page) pageSet.add(search.metadata.page);
    });
    return Array.from(pageSet).sort((a, b) => a - b);
  }, [SearchResult]);

  // 默认选中第一页
  const [selectedPage, setSelectedPage] = useState<number>(pages[0] || 1);

  // 目录树数据
  const treeData = pages.map(page => ({
    title: `页码: ${page}`,
    key: page,
    isLeaf: true,
  }));

  // 当前页的搜索
  const pageSearches = (SearchResult || []).filter(search => search.metadata?.page === selectedPage);

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      title="搜索结果"
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
          {pageSearches.length === 0 ? (
            <div>该页暂无搜索</div>
          ) : (
            pageSearches.map((search) => (
              <div key={search.metadata.chunk_id} style={{ marginBottom: 16 }}>
                <b>分块编号: {search.metadata.chunk_id}</b>
                <div style={{ whiteSpace: 'pre-wrap', background: '#fafafa', padding: 8, borderRadius: 4 }}>
                  {search.page_content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SearchResultModal;