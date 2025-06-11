import type { ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import documentReducer from './slices/documentSlice';

// 定义根 reducer
export const rootReducer = combineReducers({
  document: documentReducer,
  // 其他 reducer 将在这里添加
});

// 定义 RootState 类型
export type RootState = ReturnType<typeof rootReducer>;

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