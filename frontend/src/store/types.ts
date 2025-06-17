import type { ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import documentReducer from './slices/documentSlice';
import chunkReducer from './slices/chunkSlice';
import embeddingReducer from './slices/embeddingSlice';
import type { DocumentState } from './slices/documentSlice';
import type { ChunkState } from './slices/chunkSlice';
import type { EmbeddingState } from './slices/embeddingSlice';

// 定义根 reducer
export const rootReducer = combineReducers({
  document: documentReducer,
  chunk: chunkReducer,
  embedding: embeddingReducer,
  // 其他 reducer 将在这里添加
});


// 定义 Thunk 类型
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  any
>;

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, any>;

// 定义 AppDispatch 类型
export type AppDispatch = AppThunkDispatch;

export interface RootState {
  document: DocumentState;
  chunk: ChunkState;
  embedding: EmbeddingState;
}