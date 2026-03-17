import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// For Recruiter: Schedule an interview
export const scheduleInterview = createAsyncThunk(
    'interview/schedule',
    async (interviewData, { rejectWithValue }) => {
        try {
            const response = await api.post('/interviews/schedule', interviewData);
            return response.data.interview;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to schedule interview');
        }
    }
);

// For both: Get my interviews
export const getMyInterviews = createAsyncThunk(
    'interview/getMyInterviews',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/interviews/my');
            return response.data.interviews;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch interviews');
        }
    }
);
