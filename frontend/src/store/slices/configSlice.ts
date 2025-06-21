import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { configService } from '@/services/configService';
import type { AppThunk, AppDispatch } from '@/store/types';
import type { AllConfig, ModelConfig, ConnectionConfig, SystemConfig, FrontendConfig } from '@/types/config';
import { defaultFrontendConfig } from '@/types/config';

export interface ConfigState {
  // 后端配置
  backendConfig: AllConfig | null;
  // 前端配置
  frontendConfig: FrontendConfig;
  loading: boolean;
  error: string | null;
}

const initialState: ConfigState = {
  backendConfig: null,
  frontendConfig: defaultFrontendConfig,
  loading: false,
  error: null,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setBackendConfig: (state, action: PayloadAction<AllConfig>) => {
      state.backendConfig = action.payload;
    },
    setFrontendConfig: (state, action: PayloadAction<FrontendConfig>) => {
      state.frontendConfig = action.payload;
    },
    updateModelConfig: (state, action: PayloadAction<ModelConfig>) => {
      if (state.backendConfig) {
        state.backendConfig.model = action.payload;
      }
    },
    updateConnectionConfig: (state, action: PayloadAction<ConnectionConfig>) => {
      if (state.backendConfig) {
        state.backendConfig.connection = action.payload;
      }
    },
    updateSystemConfig: (state, action: PayloadAction<SystemConfig>) => {
      if (state.backendConfig) {
        state.backendConfig.system = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setBackendConfig,
  setFrontendConfig,
  updateModelConfig,
  updateConnectionConfig,
  updateSystemConfig,
} = configSlice.actions;

// Thunk actions
export const fetchBackendConfig = (): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const config = await configService.getAllConfig();
    dispatch(setBackendConfig(config));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '获取后端配置失败'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateBackendConfig = (config: AllConfig): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    await configService.updateAllConfig(config);
    dispatch(setBackendConfig(config));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '更新后端配置失败'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateBackendModelConfig = (config: ModelConfig): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    await configService.updateModelConfig(config);
    dispatch(updateModelConfig(config));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '更新模型配置失败'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateBackendConnectionConfig = (config: ConnectionConfig): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    await configService.updateConnectionConfig(config);
    dispatch(updateConnectionConfig(config));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '更新连接配置失败'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateBackendSystemConfig = (config: SystemConfig): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    await configService.updateSystemConfig(config);
    dispatch(updateSystemConfig(config));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '更新系统配置失败'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const initDefaultConfigs = (): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    await configService.initDefaultConfigs();
    // 重新获取配置
    await dispatch(fetchBackendConfig());
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '初始化默认配置失败'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loadFrontendConfig = (): AppThunk => async (dispatch: AppDispatch) => {
  try {
    const config = configService.getFrontendConfig();
    if (config) {
      dispatch(setFrontendConfig(config));
    }
  } catch (error) {
    console.error('加载前端配置失败:', error);
  }
};

export const saveFrontendConfig = (config: FrontendConfig): AppThunk => async (dispatch: AppDispatch) => {
  try {
    const success = configService.setFrontendConfig(config);
    if (success) {
      dispatch(setFrontendConfig(config));
    } else {
      dispatch(setError('保存前端配置失败'));
    }
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : '保存前端配置失败'));
  }
};

export default configSlice.reducer;