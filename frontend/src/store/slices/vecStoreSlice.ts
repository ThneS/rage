import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { vecStoreService } from '@/services/vecStoreService';
import type { AppThunk, AppDispatch } from '@/store/types';
import type { LangChainVecStore } from '@/types/vecStore';
import type { ConfigParams } from '@/types/commonConfig';
import {fetchDocuments} from '@/store/slices/documentSlice';
export interface VecStoreState {
  config: ConfigParams | null;
  result: LangChainVecStore[] | null;
  searchResult: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: VecStoreState = {
  config: null,
  result: null,
  searchResult: null,
  loading: false,
  error: null
};

const vecStoreSlice = createSlice({
  name: 'vecStore',
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
    setVecStoreResult: (state, action: PayloadAction<LangChainVecStore[] | null>) => {
      state.result = action.payload;
    },
    setSearchResult: (state, action: PayloadAction<string | null>) => {
      state.searchResult = action.payload;
    },
  },
});

export const { setConfig, setLoading, setError, setVecStoreResult, setSearchResult } = vecStoreSlice.actions;


export const fetchVecStoreConfig = (documentId: number): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const config = await vecStoreService.getVecStoreConfig(documentId);
    dispatch(setConfig(config));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '获取分块配置失败'));
    dispatch(setConfig(null));
  } finally {
    dispatch(setLoading(false));
  }
};

export const processVecStore = (documentId: number, config: ConfigParams): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await vecStoreService.processVecStore(documentId, config);
    dispatch(setVecStoreResult(result));
    dispatch(fetchDocuments());
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '处理文档失败'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const searchVecStore = (documentId: number, query: string): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await vecStoreService.searchVecStore(documentId, query);
    dispatch(setSearchResult(result));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '检索失败'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export default vecStoreSlice.reducer;