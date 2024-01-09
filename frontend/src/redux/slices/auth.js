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
  extraReducers: {
    [fetchLogin.pending]: (state) => {
      state.status = 'loading';
      state.data = null;
    },
    [fetchLogin.fulfilled]: (state, actions) => {
      state.status = 'loaded';
      state.data = actions.payload;
    },
    [fetchLogin.rejected]: (state) => {
      state.status = 'error';
      state.data = null;
    },
    [fetchAuthMe.pending]: (state) => {
      state.status = 'loading';
      state.data = null;
    },
    [fetchAuthMe.fulfilled]: (state, actions) => {
      state.status = 'loaded';
      state.data = actions.payload;
    },
    [fetchAuthMe.rejected]: (state) => {
      state.status = 'error';
      state.data = null;
    },
    [fetchRegister.pending]: (state) => {
      state.status = 'loading';
      state.data = null;
    },
    [fetchRegister.fulfilled]: (state, actions) => {
      state.status = 'loaded';
      state.data = actions.payload;
    },
    [fetchRegister.rejected]: (state) => {
      state.status = 'error';
      state.data = null;
    }
  }
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const { logout } = authSlice.actions

export const authReducer = authSlice.reducer;
