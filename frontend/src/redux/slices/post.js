import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params) => {
    const { data } = await axios.get('/posts', { params });
    return data;
  }
);

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', (id) =>
  axios.delete(`/posts/${id}`)
);

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});

export const fetchPostsForTag = createAsyncThunk(
  'posts/fetchPostsForTag',
  async (tag) => {
    const { data } = await axios.get(`/tags/${tag}`);
    return data;
  }
);

const generatePendingReducer =
  (stateSlice = 'posts') =>
  (state) => {
    state[stateSlice].items = [];
    state[stateSlice].status = 'loading';
  };

const generateFulfilledReducer =
  (stateSlice = 'posts') =>
  (state, actions) => {
    state[stateSlice].items = actions.payload;
    state[stateSlice].status = 'loaded';
  };

const generateRejectedReducer =
  (stateSlice = 'posts') =>
  (state) => {
    state[stateSlice].items = [];
    state[stateSlice].status = 'error';
  };

const initialState = {
  posts: {
    items: [],
    status: 'loading'
  },
  tags: {
    items: [],
    status: 'loading'
  }
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Получение постов
      .addCase(fetchPosts.pending, generatePendingReducer())
      .addCase(fetchPosts.fulfilled, generateFulfilledReducer())
      .addCase(fetchPosts.rejected, generateRejectedReducer())
      // Получение постов по тегу
      .addCase(fetchPostsForTag.pending, generatePendingReducer())
      .addCase(fetchPostsForTag.fulfilled, generateFulfilledReducer())
      .addCase(fetchPostsForTag.rejected, generateRejectedReducer())
      // Получение тегов
      .addCase(fetchTags.pending, generatePendingReducer('tags'))
      .addCase(fetchTags.fulfilled, generateFulfilledReducer('tags'))
      .addCase(fetchTags.rejected, generateRejectedReducer('tags'))
      // Удаление постов
      .addCase(fetchRemovePost.pending, (state, actions) => {
        state.posts.items = state.posts.items.filter(
          (obj) => obj._id !== actions.meta.arg
        );
      });
  }
});

export const postsReducer = postSlice.reducer;
