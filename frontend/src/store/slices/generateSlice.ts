import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { generateService } from '@/services/generateService';
import type { AppThunk, AppDispatch } from '@/store/types';
import type { LangChainGenerate } from '@/types/generate';
import type { ConfigParams } from '@/types/commonConfig';
import {fetchDocuments} from '@/store/slices/documentSlice';

export interface GenerateState {
  config: ConfigParams | null;
  result: LangChainGenerate[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: GenerateState = {
  config: null,
  result: null,
  loading: false,
  error: null
};

const generateSlice = createSlice({
  name: 'generate',
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
    setGenerateResult: (state, action: PayloadAction<LangChainGenerate[] | null>) => {
      state.result = action.payload;
    },
  },
});

export const { setConfig, setLoading, setError, setGenerateResult } = generateSlice.actions;

export const fetchGenerateConfig = (documentId: number): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const config = await generateService.getGenerateConfig(documentId);
    dispatch(setConfig(config));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '获取生成配置失败'));
    dispatch(setConfig(null));
  } finally {
    dispatch(setLoading(false));
  }
};

export const processGenerate = (documentId: number, config: ConfigParams): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await generateService.processGenerate(documentId, config);
    dispatch(setGenerateResult(result));
    dispatch(fetchDocuments());
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '处理文档失败'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export default generateSlice.reducer;