import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { documentService } from '@/services/documentService';
import type { Document } from '@/types/document';
import type { AppThunk, AppDispatch, RootState } from '../types';
import type { ConfigParams } from '@/types/commonConfig';
import { DocumentStatus } from '@/types/commonConfig';

export interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  config: ConfigParams | null;
  loadResult: LangChainDocument[] | null;
  loading: boolean;
  error: string | null;
  selectedId: number | null;
}

const initialState: DocumentState = {
  documents: [],
  currentDocument: null,
  config: null,
  loadResult: null,
  loading: false,
  error: null,
  selectedId: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setDocuments: (state, action: PayloadAction<Document[]>) => {
      state.documents = action.payload;
      state.error = null;
      state.loading = false;
    },
    setCurrentDocument: (state, action: PayloadAction<Document | null>) => {
      state.currentDocument = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setConfig: (state, action: PayloadAction<ConfigParams | null>) => {
      state.config = action.payload;
      state.error = null;
    },
    setLoadResult: (state, action: PayloadAction<LangChainDocument[] | null>) => {
      state.loadResult = action.payload;
    },
    selectDocument: (state, action: PayloadAction<number | null>) => {
      state.selectedId = action.payload;
    },
  },
});

export const { setDocuments, setCurrentDocument, setLoading, setError, setConfig, setLoadResult, selectDocument } = documentSlice.actions;

// Thunks
export const fetchDocuments = (): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const documents = await documentService.getDocuments();
    dispatch(setDocuments(documents));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '获取文档列表失败'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const uploadDocument = (file: File): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const document = await documentService.uploadDocument(file);
    dispatch(setCurrentDocument(document));
    dispatch(fetchDocuments()); // 刷新文档列表
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '上传文档失败'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const processDocument = (documentId: number, config: ConfigParams): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await documentService.processDocument(documentId, config);
    dispatch(setLoadResult(result));
    await dispatch(fetchDocuments());
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '处理文档失败'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteDocument = (documentId: number): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    await documentService.deleteDocument(documentId);
    dispatch(fetchDocuments()); // 删除后刷新文档列表
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '删除文档失败'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchLoadConfig = (documentId: number): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const config = await documentService.getLoadConfig(documentId);
    dispatch(setConfig(config));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '获取文档配置失败'));
    dispatch(setConfig(null));
  } finally {
    dispatch(setLoading(false));
  }
};

export const pollDocumentStatus = (documentId: number): AppThunk => async (dispatch: AppDispatch) => {
  const pollInterval = 2000; // 每2秒轮询一次
  const maxAttempts = 30; // 最多轮询30次（1分钟）
  let attempts = 0;

  const poll = async () => {
    try {
      const documents = await documentService.getDocuments();
      const document = documents.find(doc => doc.id === documentId);

      if (document) {
        // 如果文档状态是处理中，继续轮询
        if (document.status === DocumentStatus.PENDING && attempts < maxAttempts) {
          attempts++;
          dispatch(setDocuments(documents));
          setTimeout(poll, pollInterval);
        } else {
          // 状态已改变或达到最大尝试次数，更新文档列表
          dispatch(setDocuments(documents));
        }
      }
    } catch (error) {
      console.error('轮询文档状态失败:', error);
    }
  };

  // 开始轮询
  poll();
};

export default documentSlice.reducer;

export const selectSelectedDocument = (state: RootState) => {
    const { documents, selectedId } = state.document;
    return documents.find(doc => doc.id === selectedId) || null;
}