import { createSlice } from '@reduxjs/toolkit';
import { fetchProfileStatus, updateProfile, fetchProfile, updateCandidateProfile } from '../actions/profileActions';

const initialState = {
  data: {},
  currentStep: 1,
  isProfileCompleted: false,
  loading: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLocalData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    setStep: (state, action) => {
      state.currentStep = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileStatus.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchProfileStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.currentStep = action.payload.currentStep;
        state.isProfileCompleted = action.payload.isProfileCompleted;
        state.data = action.payload.data;
      })
      .addCase(fetchProfileStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload.profile };
        
        if (action.payload.onboardingStep) {
          state.currentStep = action.payload.onboardingStep;
        }
        
        if (action.payload.isProfileCompleted !== undefined) {
          state.isProfileCompleted = action.payload.isProfileCompleted;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCandidateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload.profile };
      })
      .addCase(updateCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase('auth/logoutCandidate/fulfilled', (state) => {
        state.data = {};
        state.currentStep = 1;
        state.isProfileCompleted = false;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { setLocalData, setStep } = profileSlice.actions;
export default profileSlice.reducer;
