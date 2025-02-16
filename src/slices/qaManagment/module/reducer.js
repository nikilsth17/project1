import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  module: [],
  loading: false,
  error: null,
};

const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    fetchModulesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchModulesSuccess: (state, action) => {
      state.loading = false;
      state.module = action.payload;
    },
    fetchModulesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchsubModulesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchsubModulesSuccess: (state, action) => {
      state.loading = false;
      state.module = action.payload;
    },
    fetchsubModulesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addModule: (state, action) => {
      state.module.push(action.payload);
    },
    updateModule: (state, action) => {
      const updatedModule = action.payload;
      state.module = state.module.map(module =>
        module.id === updatedModule.editedEntity.id ? { ...module, ...updatedModule.editedEntity } : module
      );
    },
    deleteModule: (state, action) => {
      const id = action.payload;
      state.module = state.module.filter(m => m.id !== id);
    }
  },
});

export const { fetchModulesRequest, fetchModulesSuccess, fetchModulesFailure, addModule, updateModule,deleteModule, fetchsubModulesRequest, fetchsubModulesSuccess, fet } = moduleSlice.actions;

export default moduleSlice.reducer;

