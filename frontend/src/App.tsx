import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DocumentLoader from './pages/DocumentLoader';
import DocumentSplitter from './pages/DocumentSplitter';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/document-loader" replace />
      },
      {
        path: 'document-loader',
        element: <DocumentLoader />
      },
      {
        path: 'document-splitter',
        element: <DocumentSplitter />
      },
      {
        path: '*',
        element: <Navigate to="/document-loader" replace />
      }
    ]
  }
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
