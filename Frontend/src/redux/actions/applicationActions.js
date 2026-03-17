import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// For Recruiter: Get all applicants for a specific job
export const getJobApplicants = createAsyncThunk(
    'application/getJobApplicants',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/applications/job/${jobId}`);
            return response.data.applicants;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch applicants');
        }
    }
);

// For Recruiter: Update application status (Shortlist/Reject/Viewed)
export const updateApplicationStatus = createAsyncThunk(
    'application/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/applications/${id}/status`, { status });
            return response.data.application;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update application status');
        }
    }
);

// For Candidate: Apply to a job
export const applyToJob = createAsyncThunk(
    'application/apply',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/applications/apply/${jobId}`);
            return response.data.application;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to apply for job');
        }
    }
);

// For Candidate: Get my applications
export const getMyApplications = createAsyncThunk(
    'application/getMyApplications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/applications/candidate/my');
            return response.data.applications;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch your applications');
        }
    }
);
