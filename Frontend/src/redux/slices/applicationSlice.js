import { createSlice } from '@reduxjs/toolkit';
import {
    getJobApplicants,
    updateApplicationStatus,
    applyToJob
} from '../actions/applicationActions';

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applicants: [], // For recruiter viewing a specific job's applicants
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        clearApplicationStates: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Job Applicants
            .addCase(getJobApplicants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobApplicants.fulfilled, (state, action) => {
                state.loading = false;
                state.applicants = action.payload;
            })
            .addCase(getJobApplicants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Application Status
            .addCase(updateApplicationStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.applicants.findIndex(app => app.id === action.payload.id);
                if (index !== -1) {
                    state.applicants[index] = { ...state.applicants[index], ...action.payload };
                }
            })
            .addCase(updateApplicationStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Apply to Job
            .addCase(applyToJob.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(applyToJob.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(applyToJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    }
});

export const { clearApplicationStates } = applicationSlice.actions;
export default applicationSlice.reducer;
