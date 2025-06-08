import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DocumentLoader from './pages/DocumentLoader';
import DocumentSplitter from './pages/DocumentSplitter';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/document-loader" replace />} />
          <Route path="document-loader" element={<DocumentLoader />} />
          <Route path="document-splitter" element={<DocumentSplitter />} />
          {/* 其他路由将在后续添加 */}
          <Route path="*" element={<Navigate to="/document-loader" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
