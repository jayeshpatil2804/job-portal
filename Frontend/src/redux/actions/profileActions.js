import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProfileStatus = createAsyncThunk(
  'profile/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/candidate/profile-status');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch status');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.post('/candidate/complete-profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);
