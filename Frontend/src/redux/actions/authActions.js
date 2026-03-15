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
