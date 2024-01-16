import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from '../../axios';

export const fetchCreateComment = createAsyncThunk(
  'comments/fetchCreateComment',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post('/comments', params);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async () => {
    const { data } = await axios.get('/comments');
    return data;
  }
);

export const fetchOnlyPostComments = createAsyncThunk(
  'comments/fetchOnlyPostComments',
  async (id) => {
    const { data } = await axios.get(`/comments/${id}`);
    return data;
  }
);

export const fetchRemoveComments = createAsyncThunk(
  'posts/fetchRemoveComments',
  (id) => axios.delete(`/comments/${id}`)
);

const initialState = {
  comments: {
    items: [],
    status: 'loading'
  }
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: {
    // Создание комментария
    [fetchCreateComment.fulfilled]: (state, action) => {
      if (action.payload && typeof action.payload !== 'string') {
        state.comments.items.push(action.payload);
        state.comments.status = 'loaded';
      } else {
        state.comments.status = 'error';
      }
    },
    [fetchCreateComment.rejected]: (state) => {
      state.comments.status = 'error';
    },
    // Получение комментариев
    [fetchComments.pending]: (state) => {
      state.comments.items = [];
      state.comments.status = 'loading';
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = 'loaded';
    },
    [fetchComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = 'error';
    },
    // Получение комментариев в посте
    [fetchOnlyPostComments.pending]: (state) => {
      state.comments.items = [];
      state.comments.status = 'loading';
    },
    [fetchOnlyPostComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = 'loaded';
    },
    [fetchOnlyPostComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = 'error';
    },
     // Удаление комментариев
     [fetchRemoveComments.pending]: (state, actions) => {
      state.comments.items = state.comments.items.filter(
        (comment) => comment.postId !== actions.meta.arg
      );
    }
  }
});

export const commentsReducer = commentSlice.reducer;
