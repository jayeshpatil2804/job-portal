import api from '../../utils/api'
import {
    setSavedJobs,
    setLoading,
    setError,
    toggleSaveSuccess
} from '../slices/savedJobSlice'

export const getMySavedJobs = (page = 1, limit = 10) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const { data } = await api.get(`/saved-jobs?page=${page}&limit=${limit}`)
        dispatch(setSavedJobs({
            savedJobs: data.savedJobs,
            pagination: data.pagination
        }))
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Failed to fetch saved jobs'))
    } finally {
        dispatch(setLoading(false))
    }
}

export const toggleSaveJob = (jobId) => async (dispatch) => {
    try {
        const { data } = await api.post(`/saved-jobs/toggle/${jobId}`)
        dispatch(toggleSaveSuccess({ jobId, isSaved: data.isSaved }))
        return data.isSaved
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Failed to toggle save job'))
        throw error
    }
}

export const checkIfJobSaved = (jobId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/saved-jobs/check/${jobId}`)
        return data.isSaved
    } catch (error) {
        console.error('Error checking save status:', error)
        return false
    }
}
