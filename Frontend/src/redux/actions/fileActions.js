import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const uploadResume = createAsyncThunk(
  'file/uploadResume',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await api.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'file/delete',
  async (fileId, { rejectWithValue }) => {
    try {
      await api.delete(`/file/${fileId}`);
      return fileId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  }
);
