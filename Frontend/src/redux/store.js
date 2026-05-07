import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import recruiterProfileReducer from './slices/recruiterProfileSlice';
import jobReducer from './slices/jobSlice';
import applicationReducer from './slices/applicationSlice';
import savedJobReducer from './slices/savedJobSlice';

import dashboardReducer from './slices/dashboardSlice';
import metaReducer from './slices/metaSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    recruiterProfile: recruiterProfileReducer,
    job: jobReducer,
    application: applicationReducer,
    savedJob: savedJobReducer,

    dashboard: dashboardReducer,
    meta: metaReducer,
  },
});
