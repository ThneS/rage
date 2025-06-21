import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DocumentLoader from '@/pages/DocumentLoader';
import ChunkPage from '@/pages/ChunkPage';
import EmbeddingPage from '@/pages/EmbeddingPage';
import VecStorePage from '@/pages/VecStorePage';
import SearchPage from '@/pages/SearchPage';
import GeneratePage from '@/pages/GeneratePage';

export const routes: RouteObject[] = [
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
        path: 'chunk',
        element: <ChunkPage />
      },
      {
        path: 'embedding',
        element: <EmbeddingPage />
      },
      {
        path: 'vec-store',
        element: <VecStorePage />
      },
      {
        path: 'search',
        element: <SearchPage />
      },
      {
        path: 'generate',
        element: <GeneratePage />
      },
      {
        path: '*',
        element: <Navigate to="/document-loader" replace />
      }
    ]
  }
];

export const router = createBrowserRouter(routes);