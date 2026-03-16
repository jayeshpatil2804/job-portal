import { createSlice } from '@reduxjs/toolkit';
import { createJob, getMyJobs, getAllOpenJobs, getJobById, deleteJob, closeJob, updateJob, updateJobStatus } from '../actions/jobActions';

const initialState = {
    jobs: [],
    myJobs: [],
    selectedJob: null,
    loading: false,
    error: null,
    success: false,
};

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        clearJobState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        clearSelectedJob: (state) => {
            state.selectedJob = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Job
            .addCase(createJob.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.myJobs.unshift(action.payload.job);
            })
            .addCase(createJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get My Jobs
            .addCase(getMyJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.myJobs = action.payload.jobs;
            })
            .addCase(getMyJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get All Open Jobs
            .addCase(getAllOpenJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllOpenJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload.jobs;
            })
            .addCase(getAllOpenJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Job By ID
            .addCase(getJobById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedJob = action.payload.job;
            })
            .addCase(getJobById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Job
            .addCase(deleteJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.loading = false;
                state.myJobs = state.myJobs.filter(job => job.id !== action.payload);
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Close Job
            .addCase(closeJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(closeJob.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.myJobs.findIndex(job => job.id === action.payload.id);
                if (index !== -1) {
                    state.myJobs[index] = action.payload;
                }
            })
            .addCase(closeJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Job
            .addCase(updateJob.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.myJobs.findIndex(job => job.id === action.payload.id);
                if (index !== -1) {
                    state.myJobs[index] = action.payload;
                }
            })
            .addCase(updateJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Job Status
            .addCase(updateJobStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateJobStatus.fulfilled, (state, action) => {
                state.loading = false;
                // Update in myJobs
                const myIndex = state.myJobs.findIndex(job => job.id === action.payload.id);
                if (myIndex !== -1) {
                    state.myJobs[myIndex].status = action.payload.status;
                }
                // Update in selectedJob if it's the same job
                if (state.selectedJob && state.selectedJob.id === action.payload.id) {
                    state.selectedJob.status = action.payload.status;
                }
            })
            .addCase(updateJobStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearJobState, clearSelectedJob } = jobSlice.actions;
export default jobSlice.reducer;
