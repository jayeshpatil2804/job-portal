import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProfileStatus = createAsyncThunk(
  'profile/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/candidate/profile-status');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('401');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch status');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/candidate/profile');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('401');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateCandidateProfile = createAsyncThunk(
  'profile/updateCandidate',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/candidate/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
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
