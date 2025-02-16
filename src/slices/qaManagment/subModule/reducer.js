import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subModule: [],
  loading: false,
  error: null,
};

const subModuleSlice = createSlice({
  name: 'subModule',
  initialState,
  reducers: {
    fetchsubModulesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchsubModulesSuccess: (state, action) => {
      state.loading = false;
      state.subModule = action.payload; // Update "state.module" to "state.subModule"
    },
    fetchsubModulesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addSubModule: (state, action) => {
      state.subModule.push(action.payload);
    },
    updateSubModule: (state, action) => {
      const updatedModule = action.payload;
      state.subModule = state.subModule.map((module) =>
        module.id === updatedModule.editedEntity.id
          ? { ...module, ...updatedModule.editedEntity }
          : module
      );
    },

    deleteSubModule: (state, action) => {
      const id = action.payload;
      state.subModule = state.subModule.filter((module) => module.id !== id);
    },
  },
});

export const {
  addSubModule,
  updateSubModule,
  deleteSubModule,
  fetchsubModulesRequest,
  fetchsubModulesSuccess,
  fetchsubModulesFailure,
} = subModuleSlice.actions;

export default subModuleSlice.reducer;
