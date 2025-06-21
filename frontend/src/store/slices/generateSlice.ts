import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { generateService } from '@/services/generateService';
import type { AppThunk, AppDispatch } from '@/store/types';
import type { ConfigParams } from '@/types/commonConfig';

export interface GenerateState {
  config: ConfigParams | null;
  result: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: GenerateState = {
  config: null,
  result: null,
  loading: false,
  error: null,
};

const generateSlice = createSlice({
  name: 'generate',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setConfig: (state, action: PayloadAction<ConfigParams | null>) => {
      state.config = action.payload;
    },
    setResult: (state, action: PayloadAction<string | null>) => {
      state.result = action.payload;
    },
  },
});

export const { setLoading, setError, setConfig, setResult } = generateSlice.actions;

export const fetchGenerateConfig = (documentId: number): AppThunk => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const config = await generateService.getGenerateConfig(documentId);
        dispatch(setConfig(config));
    } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : '获取配置失败'));
    } finally {
        dispatch(setLoading(false));
    }
};

export const runGenerate = (documentId: number, config: Record<string, string | number | boolean>): AppThunk => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const result = await generateService.generate(documentId, config);
        dispatch(setResult(result.text));
    } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : '生成失败'));
    } finally {
        dispatch(setLoading(false));
    }
}

export default generateSlice.reducer;