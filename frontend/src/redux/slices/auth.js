import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchLogin = createAsyncThunk('auth/fetchLogin', async (params) => {
  const { data } = await axios.post('/auth/login', params);
  return data;
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
  const { data } = await axios.post('/auth/register', params);
  return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async (params) => {
  const { data } = await axios.get('/auth/me', params);
  return data;
});

const generatePendingReducer = (state) => {
  state.status = 'loading';
  state.data = null;
}

const generateFulfilledReducer = (state, actions) => {
  state.status = 'loaded';
  state.data = actions.payload;
}

const generateRejectedReducer = (state) => {
  state.status = 'error';
  state.data = null;
}

const initialState = {
  data: null,
  status: 'loading'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, generatePendingReducer)
      .addCase(fetchLogin.fulfilled, generateFulfilledReducer)
      .addCase(fetchLogin.rejected, generateRejectedReducer)
      .addCase(fetchAuthMe.pending, generatePendingReducer)
      .addCase(fetchAuthMe.fulfilled, generateFulfilledReducer)
      .addCase(fetchAuthMe.rejected, generateRejectedReducer)
      .addCase(fetchRegister.pending, generatePendingReducer)
      .addCase(fetchRegister.fulfilled, generateFulfilledReducer)
      .addCase(fetchRegister.rejected, generateRejectedReducer)
  }
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const { logout } = authSlice.actions

export const authReducer = authSlice.reducer;
