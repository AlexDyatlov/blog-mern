import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';

import { fetchPosts, fetchTags } from '../redux/slices/post';
import { fetchComments } from '../redux/slices/comment';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);
  const [activeTab, setActiveTab] = useState(false);
  let [order, setOrder] = useState({});

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';

  const handleSortPost = (value) => {
    if (value === 'new') {
      setActiveTab((prevValue) => prevValue === 0  ? false : 0)
      setOrder((prevValue) => (prevValue.order === '3' ? '' : { order: '3' }));
    } else if (value === 'popular') {
      setActiveTab(1)
      setOrder((prevValue) => (prevValue.order === '2' ? { order: '1' } : { order: '2' }));
    }
  };

  useEffect(() => {
    dispatch(fetchPosts(order));
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, [order]);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={activeTab}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" onClick={() => handleSortPost('new')} />
        <Tab label="Популярные" onClick={() => handleSortPost('popular')} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.commentsCount}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock items={comments.items} isLoading={isCommentsLoading} />
        </Grid>
      </Grid>
    </>
  );
};
