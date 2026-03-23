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

export const loginRecruiter = createAsyncThunk(
  'auth/loginRecruiter',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/recruiter/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Recruiter login failed' });
    }
  }
);

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/admin/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Admin login failed' });
    }
  }
);

export const verifyCandidateOtp = createAsyncThunk(
  'auth/verifyCandidateOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/candidate/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Verification failed' });
    }
  }
);

export const verifyRecruiterOtp = createAsyncThunk(
  'auth/verifyRecruiterOtp',
  async ({ workEmail, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/recruiter/verify-otp', { workEmail, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Verification failed' });
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

export const logoutAdmin = createAsyncThunk(
  'auth/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/admin/logout');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Admin logout failed');
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
        try {
          const response = await api.get('/recruiter/me');
          return response.data.user;
        } catch (e2) {
          // Finally try admin
          const response = await api.get('/auth/admin/me');
          return response.data.user;
        }
      }
    } catch (error) {
      return rejectWithValue('Not authenticated');
    }
  }
);

