import { createSlice } from '@reduxjs/toolkit';
import {
    scheduleInterview,
    getMyInterviews
} from '../actions/interviewActions';

const interviewSlice = createSlice({
    name: 'interview',
    initialState: {
        interviews: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        clearInterviewStates: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Schedule Interview
            .addCase(scheduleInterview.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(scheduleInterview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.interviews.push(action.payload);
            })
            .addCase(scheduleInterview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Get My Interviews
            .addCase(getMyInterviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyInterviews.fulfilled, (state, action) => {
                state.loading = false;
                state.interviews = action.payload;
            })
            .addCase(getMyInterviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearInterviewStates } = interviewSlice.actions;
export default interviewSlice.reducer;
