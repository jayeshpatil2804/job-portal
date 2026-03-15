import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchRecruiterProfileStatus = createAsyncThunk(
  'recruiterProfile/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/recruiter/profile-status');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch status');
    }
  }
);

export const updateRecruiterProfile = createAsyncThunk(
  'recruiterProfile/update',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.post('/recruiter/complete-profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);
