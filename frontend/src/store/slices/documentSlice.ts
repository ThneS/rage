import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '../types';
import { documentService } from '../../services/documentService';
import type { Document, FileTypeConfigResponse, LangChainDocument } from '../../types/document';
import type { AppDispatch } from '../types';

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  config: FileTypeConfigResponse | null;
  loadResult: LangChainDocument[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  currentDocument: null,
  config: null,
  loadResult: null,
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setDocuments: (state, action: PayloadAction<Document[]>) => {
      state.documents = action.payload;
      state.error = null;
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
    setConfig: (state, action: PayloadAction<FileTypeConfigResponse | null>) => {
      state.config = action.payload;
      state.error = null;
    },
    setLoadResult: (state, action: PayloadAction<LangChainDocument[] | null>) => {
      state.loadResult = action.payload;
    },
  },
});

export const { setDocuments, setCurrentDocument, setLoading, setError, setConfig, setLoadResult } = documentSlice.actions;

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

export const processDocument = (documentId: number, config: any): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await documentService.processDocument(documentId, config);
    dispatch(setLoadResult(result));
    dispatch(fetchDocuments()); // 刷新文档列表
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '处理文档失败'));
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

export default documentSlice.reducer;