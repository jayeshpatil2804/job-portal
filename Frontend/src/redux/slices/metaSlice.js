import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchSkills = createAsyncThunk(
    'meta/fetchSkills',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/skills');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch skills');
        }
    }
);

export const fetchDepartments = createAsyncThunk(
    'meta/fetchDepartments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/departments');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
        }
    }
);

const initialState = {
    skills: [],
    departments: [],
    loading: false,
    error: null,
    fetched: false, // Flag to prevent re-fetching
};

const metaSlice = createSlice({
    name: 'meta',
    initialState,
    reducers: {
        clearMetaError: (state) => {
            state.error = null;
        },
        addSkill: (state, action) => {
            state.skills.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Skills
            .addCase(fetchSkills.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.loading = false;
                state.skills = action.payload.skills || [];
                state.fetched = true;
            })
            .addCase(fetchSkills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Departments
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload.departments || [];
                state.fetched = true;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMetaError, addSkill } = metaSlice.actions;
export default metaSlice.reducer;
