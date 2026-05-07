import { createSlice } from '@reduxjs/toolkit'

const savedJobSlice = createSlice({
    name: 'savedJob',
    initialState: {
        savedJobs: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        },
        loading: false,
        error: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setSavedJobs: (state, action) => {
            state.savedJobs = action.payload.savedJobs
            state.pagination = action.payload.pagination
            state.loading = false
        },
        setError: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        toggleSaveSuccess: (state, action) => {
            const { jobId, isSaved } = action.payload
            if (!isSaved) {
                state.savedJobs = state.savedJobs.filter(job => job.id !== jobId)
            }
            // If saved, we might need to fetch the job details or just update a flag elsewhere
            // For the saved jobs list, we usually fetch fresh data
        }
    }
})

export const {
    setLoading,
    setSavedJobs,
    setError,
    toggleSaveSuccess
} = savedJobSlice.actions

export default savedJobSlice.reducer
