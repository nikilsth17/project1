import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  numberOfProjects: 0,
  numberOfModules: 0,
  numberOfTestCases: 0,
  numberOfPendingTestCases: 0,
  numberOfFailedTestCases: 0,
  numberOfUsers: 0,
  numberOfUsersByRole: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDashboardDataSuccess: (state, action) => {
      state.loading = false;
      // Update state with the API response data
      Object.assign(state, action.payload);
    },
    fetchDashboardDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDashboardDataRequest,
  fetchDashboardDataSuccess,
  fetchDashboardDataFailure,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
