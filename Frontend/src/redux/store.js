import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import recruiterProfileReducer from './slices/recruiterProfileSlice';
import jobReducer from './slices/jobSlice';
import applicationReducer from './slices/applicationSlice';
import interviewReducer from './slices/interviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    recruiterProfile: recruiterProfileReducer,
    job: jobReducer,
    application: applicationReducer,
    interview: interviewReducer,
  },
});
