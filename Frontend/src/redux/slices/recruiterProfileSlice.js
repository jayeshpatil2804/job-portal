import { createSlice } from '@reduxjs/toolkit';
import { fetchRecruiterProfileStatus, updateRecruiterProfile } from '../actions/recruiterProfileActions';

const initialState = {
  data: null,
  currentStep: 1,
  isProfileCompleted: false,
  isPaid: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  loading: false,
  error: null,
};

const recruiterProfileSlice = createSlice({
  name: 'recruiterProfile',
  initialState,
  reducers: {
    setRecruiterStep: (state, action) => {
      state.currentStep = action.payload;
    },
    resetRecruiterProfile: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Status
      .addCase(fetchRecruiterProfileStatus.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchRecruiterProfileStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.currentStep = action.payload.currentStep;
        state.isProfileCompleted = action.payload.isProfileCompleted;
        state.isPaid = action.payload.isPaid;
        state.data = action.payload.data;
      })
      .addCase(fetchRecruiterProfileStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateRecruiterProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRecruiterProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStep = action.payload.currentStep;
        state.isProfileCompleted = action.payload.isProfileCompleted;
        state.isPaid = action.payload.isPaid;
        state.data = action.payload.profile;
      })
      .addCase(updateRecruiterProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setRecruiterStep, resetRecruiterProfile } = recruiterProfileSlice.actions;
export default recruiterProfileSlice.reducer;
