import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { chunkService } from '@/services/chunkService';
import type { ChunkConfigResponse } from '@/types/chunk';
import type { AppThunk, AppDispatch } from '@/store/types';
import type { LangChainChunk } from '@/types/chunk';

export interface ChunkState {
  config: ChunkConfigResponse | null;
  result: any;
  loading: boolean;
  error: string | null;
}

const initialState: ChunkState = {
  config: null,
  result: null,
  loading: false,
  error: null
};

const chunkSlice = createSlice({
  name: 'chunk',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<ChunkConfigResponse | null>) => {
      state.config = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setChunkResult: (state, action: PayloadAction<LangChainChunk[] | null>) => {
      state.result = action.payload;
    },
  },
});

export const { setConfig, setLoading, setError, setChunkResult } = chunkSlice.actions;


export const fetchChunkConfig = (documentId: number): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const config = await chunkService.getChunkConfig(documentId);
    dispatch(setConfig(config));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '获取分块配置失败'));
    dispatch(setConfig(null));
  } finally {
    dispatch(setLoading(false));
  }
};

export const processChunk = (documentId: number, config: any): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await chunkService.processChunk(documentId, config);
    dispatch(setChunkResult(result));
    await dispatch(fetchChunkConfig(documentId));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '处理文档失败'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export default chunkSlice.reducer;