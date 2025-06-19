import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk, AppDispatch } from '@/store/types';
import type { LangChainEmbedding } from '@/types/embedding';
import type { ConfigParams } from '@/types/commonConfig';
import {fetchDocuments} from '@/store/slices/documentSlice';
import { embeddingService } from '@/services/embeddingService';

export interface EmbeddingState {
  config: ConfigParams | null;
  result: LangChainEmbedding[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmbeddingState = {
  config: null,
  result: null,
  loading: false,
  error: null
};

const embeddingSlice = createSlice({
  name: 'embedding',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<ConfigParams | null>) => {
      state.config = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setEmbeddingResult: (state, action: PayloadAction<LangChainEmbedding[] | null>) => {
      state.result = action.payload;
    },
  },
});

export const { setConfig, setLoading, setError, setEmbeddingResult } = embeddingSlice.actions;


export const fetchEmbeddingConfig = (documentId: number): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const config = await embeddingService.getEmbeddingConfig(documentId);
    dispatch(setConfig(config));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '获取分块配置失败'));
    dispatch(setConfig(null));
  } finally {
    dispatch(setLoading(false));
  }
};

export const processEmbedding = (documentId: number, config: ConfigParams): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await embeddingService.processEmbedding(documentId, config);
    dispatch(setEmbeddingResult(result));
    dispatch(fetchDocuments());
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '处理文档失败'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export default embeddingSlice.reducer;