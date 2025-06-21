import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { chunkService } from '@/services/chunkService';
import type { AppThunk, AppDispatch } from '@/store/types';
import type { LangChainSearch } from '@/types/search';
import type { ConfigParams } from '@/types/commonConfig';
import {fetchDocuments} from '@/store/slices/documentSlice';
export interface SearchState {
  config: ConfigParams | null;
  result: LangChainSearch[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  config: null,
  result: null,
  loading: false,
  error: null
};

const searchSlice = createSlice({
  name: 'search',
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
    setSearchResult: (state, action: PayloadAction<LangChainSearch[] | null>) => {
      state.result = action.payload;
    },
  },
});

export const { setConfig, setLoading, setError, setSearchResult } = searchSlice.actions;


export const fetchSearchConfig = (documentId: number): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const config = await searchService.getSearchConfig(documentId);
    dispatch(setConfig(config));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '获取分块配置失败'));
    dispatch(setConfig(null));
  } finally {
    dispatch(setLoading(false));
  }
};

export const processSearch = (documentId: number, config: ConfigParams): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await searchService.processSearch(documentId, config);
    dispatch(setSearchResult(result));
    dispatch(fetchDocuments());
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '处理文档失败'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export default searchSlice.reducer;