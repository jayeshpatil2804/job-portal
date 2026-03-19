import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const loginCandidate = createAsyncThunk(
  'auth/loginCandidate',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/candidate/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

export const logoutCandidate = createAsyncThunk(
  'auth/logoutCandidate',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/candidate/logout');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Try candidate first
      try {
        const response = await api.get('/candidate/me');
        return response.data.user;
      } catch (e) {
        // Then try recruiter
        const response = await api.get('/recruiter/me');
        return response.data.user;
      }
    } catch (error) {
      return rejectWithValue('Not authenticated');
    }
  }
);
