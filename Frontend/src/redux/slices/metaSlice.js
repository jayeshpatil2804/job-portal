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

export const fetchDesignations = createAsyncThunk(
    'meta/fetchDesignations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/designations');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch designations');
        }
    }
);

const initialState = {
    skills: [],
    designations: [],
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
            // Designations
            .addCase(fetchDesignations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDesignations.fulfilled, (state, action) => {
                state.loading = false;
                state.designations = action.payload.designations || [];
                state.fetched = true;
            })
            .addCase(fetchDesignations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMetaError, addSkill } = metaSlice.actions;
export default metaSlice.reducer;
