import React, { useState } from 'react';
import { Row, Col } from 'antd';
import SearchList from '@/components/Search/SearchList';
import SearchConfig from '@/components/Search/SearchConfig';
import SearchResult from '@/components/Search/SearchConfig/SearchResult';
import { useAppSelector } from '@/store';
import type { Document } from '@/types/document';

const SearchPage: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { result: searchResult, loading } = useAppSelector(state => state.search);

  // 选中文档时，ChunkConfig 会自动请求配置并渲染
  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  // 查看处理结果
  const handleViewSearch = () => setModalVisible(true);

  return (
    <div className="p-6 h-full bg-gray-50">
      <Row gutter={16} className="h-full">
        <Col span={12} className="h-full">
          <SearchList
            onSelectDocument={handleSelectDocument}
            selectedId={selectedDocument?.id}
          />
        </Col>
        <Col span={12} className="h-full">
          <SearchConfig
            selectedDocument={selectedDocument}
            processing={loading}
            SearchResult={searchResult}
            onViewSearch={handleViewSearch}
          />
        </Col>
      </Row>
      <SearchResult
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        SearchResult={searchResult}
      />
    </div>
  );
};

export default SearchPage;