import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { searchService } from '@/services/searchService';
import { vecStoreService } from '@/services/vecStoreService';
import type { AppThunk, AppDispatch } from '@/store/types';
import type { ConfigParams } from '@/types/commonConfig';

export interface SearchState {
  vecStoreConfig: ConfigParams | null;
  preConfig: ConfigParams | null;
  postConfig: ConfigParams | null;
  preProcessResult: string | null;
  postProcessResult: string | null;
  parseResult: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  vecStoreConfig: null,
  preConfig: null,
  postConfig: null,
  preProcessResult: null,
  postProcessResult: null,
  parseResult: null,
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setVecStoreConfig: (state, action: PayloadAction<ConfigParams | null>) => {
      state.vecStoreConfig = action.payload;
    },
    setPreConfig: (state, action: PayloadAction<ConfigParams | null>) => {
      state.preConfig = action.payload;
    },
    setPostConfig: (state, action: PayloadAction<ConfigParams | null>) => {
      state.postConfig = action.payload;
    },
    setPreProcessResult: (state, action: PayloadAction<string | null>) => {
        state.preProcessResult = action.payload;
    },
    setPostProcessResult: (state, action: PayloadAction<string | null>) => {
        state.postProcessResult = action.payload;
    },
    setParseResult: (state, action: PayloadAction<Record<string, unknown> | null>) => {
        state.parseResult = action.payload;
    }
  },
});

export const {
    setLoading,
    setError,
    setVecStoreConfig,
    setPreConfig,
    setPostConfig,
    setPreProcessResult,
    setPostProcessResult,
    setParseResult
} = searchSlice.actions;

export const fetchVecStoreConfigForSearch = (documentId: number): AppThunk => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const config = await vecStoreService.getVecStoreConfig(documentId);
        dispatch(setVecStoreConfig(config));
    } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : '获取配置失败'));
    } finally {
        dispatch(setLoading(false));
    }
}

export const fetchSearchConfigs = (documentId: number): AppThunk => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const [preConfig, postConfig] = await Promise.all([
            searchService.getPreConfig(documentId),
            searchService.getPostConfig(documentId)
        ]);
        dispatch(setPreConfig(preConfig));
        dispatch(setPostConfig(postConfig));
    } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : '获取配置失败'));
    } finally {
        dispatch(setLoading(false));
    }
};

export const runPreProcess = (documentId: number, query: string, config: Record<string, string | number | boolean>): AppThunk => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const result = await searchService.preProcess(documentId, query, config);
        dispatch(setPreProcessResult(result.content));
    } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : '预处理失败'));
    } finally {
        dispatch(setLoading(false));
    }
};

export const runPostProcess = (documentId: number, content: string, config: Record<string, string | number | boolean>): AppThunk => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const result = await searchService.postProcess(documentId, content, config);
        dispatch(setPostProcessResult(result.content));
    } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : '后处理失败'));
    } finally {
        dispatch(setLoading(false));
    }
}

export const runParse = (documentId: number, content: string): AppThunk => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const result = await searchService.parse(documentId, content);
        dispatch(setParseResult(result.data));
    } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : '解析失败'));
    } finally {
        dispatch(setLoading(false));
    }
}

export default searchSlice.reducer;