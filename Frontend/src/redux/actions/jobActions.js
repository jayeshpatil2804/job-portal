import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const createJob = createAsyncThunk(
    'job/createJob',
    async (jobData, { rejectWithValue }) => {
        try {
            const response = await api.post('/jobs', jobData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to post job');
        }
    }
);

export const getMyJobs = createAsyncThunk(
    'job/getMyJobs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/jobs/recruiter/my-jobs');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
        }
    }
);

export const getAllOpenJobs = createAsyncThunk(
    'job/getAllOpenJobs',
    async (queryParams = {}, { rejectWithValue }) => {
        try {
            const queryString = new URLSearchParams(queryParams).toString();
            const response = await api.get(`/jobs${queryString ? `?${queryString}` : ''}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch open jobs');
        }
    }
);

export const getJobById = createAsyncThunk(
    'job/getJobById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/jobs/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch job');
        }
    }
);

export const deleteJob = createAsyncThunk(
    'job/deleteJob',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/jobs/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
        }
    }
);

export const closeJob = createAsyncThunk(
    'job/closeJob',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/jobs/${id}/close`);
            return response.data.job;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to close job');
        }
    }
);

export const updateJob = createAsyncThunk(
    'job/updateJob',
    async ({ id, jobData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/jobs/${id}`, jobData);
            return response.data.job;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update job');
        }
    }
);
export const updateJobStatus = createAsyncThunk(
    'job/updateJobStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/jobs/${id}/status`, { status });
            return response.data.job;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update job status');
        }
    }
);
