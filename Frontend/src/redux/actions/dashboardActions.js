import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchCandidateStats = createAsyncThunk(
    'dashboard/fetchCandidateStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/candidate/stats');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidate stats');
        }
    }
);

export const fetchRecruiterStats = createAsyncThunk(
    'dashboard/fetchRecruiterStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/recruiter/stats');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch recruiter stats');
        }
    }
);
