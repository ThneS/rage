import type { ThunkAction, ThunkDispatch, Action } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import documentReducer from './slices/documentSlice';
import chunkReducer from './slices/chunkSlice';
import embeddingReducer from './slices/embeddingSlice';
import type { DocumentState } from './slices/documentSlice';
import type { ChunkState } from './slices/chunkSlice';
import type { EmbeddingState } from './slices/embeddingSlice';
import type { VecStoreState } from './slices/vecStoreSlice';
import vecStoreReducer from './slices/vecStoreSlice';
import type { SearchState } from './slices/searchSlice';
import searchReducer from './slices/searchSlice';
import type {GenerateState} from "./slices/generateSlice"
import generateReducer from "./slices/generateSlice"
import type { ConfigState } from './slices/configSlice';
import configReducer from './slices/configSlice';

// 定义根 reducer
export const rootReducer = combineReducers({
  document: documentReducer,
  chunk: chunkReducer,
  embedding: embeddingReducer,
  vecStore: vecStoreReducer,
  search: searchReducer,
  generate: generateReducer,
  config: configReducer,
  // 其他 reducer 将在这里添加
});


// 定义 Thunk 类型
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, Action<string>>;

// 定义 AppDispatch 类型
export type AppDispatch = AppThunkDispatch;

export interface RootState {
  document: DocumentState;
  chunk: ChunkState;
  embedding: EmbeddingState;
  vecStore: VecStoreState;
  search: SearchState;
  generate: GenerateState;
  config: ConfigState;
}