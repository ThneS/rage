import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './types';
import documentReducer from './slices/documentSlice';
import chunkReducer from './slices/chunkSlice';
import embeddingReducer from './slices/embeddingSlice';
import searchReducer from './slices/searchSlice';
import vecStoreReducer from './slices/vecStoreSlice';
import generateReducer from './slices/generateSlice';
import configReducer from './slices/configSlice';

// 创建 store
export const store = configureStore({
  reducer: {
    document: documentReducer,
    chunk: chunkReducer,
    embedding: embeddingReducer,
    search: searchReducer,
    vecStore: vecStoreReducer,
    generate: generateReducer,
    config: configReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 使用 TypeScript 的类型推断
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;