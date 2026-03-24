import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const createPaymentOrder = createAsyncThunk(
  'payment/createOrder',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/payment/create-order');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verify',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payment/verify-payment', paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
    }
  }
);
