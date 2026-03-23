import { createSlice } from '@reduxjs/toolkit';
import { 
  loginCandidate, 
  loginRecruiter, 
  loginAdmin, 
  logoutCandidate, 
  logoutAdmin, 
  checkAuth,
  verifyCandidateOtp,
  verifyRecruiterOtp 
} from '../actions/authActions';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isCheckingAuth: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Candidate Login
      .addCase(loginCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Recruiter Login
      .addCase(loginRecruiter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginRecruiter.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginRecruiter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // OTP Verification (Candidate)
      .addCase(verifyCandidateOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCandidateOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(verifyCandidateOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // OTP Verification (Recruiter)
      .addCase(verifyRecruiterOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRecruiterOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(verifyRecruiterOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutCandidate.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});


export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
