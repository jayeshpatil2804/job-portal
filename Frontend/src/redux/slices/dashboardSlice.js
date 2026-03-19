import { createSlice } from '@reduxjs/toolkit';
import { fetchCandidateStats, fetchRecruiterStats } from '../actions/dashboardActions';

const initialState = {
    candidateStats: {
        stats: null,
        recentApplications: []
    },
    recruiterStats: {
        stats: null,
        recentJobs: []
    },
    loading: false,
    error: null
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Candidate Stats
            .addCase(fetchCandidateStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCandidateStats.fulfilled, (state, action) => {
                state.loading = false;
                state.candidateStats = action.payload;
            })
            .addCase(fetchCandidateStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Recruiter Stats
            .addCase(fetchRecruiterStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecruiterStats.fulfilled, (state, action) => {
                state.loading = false;
                state.recruiterStats = action.payload;
            })
            .addCase(fetchRecruiterStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
