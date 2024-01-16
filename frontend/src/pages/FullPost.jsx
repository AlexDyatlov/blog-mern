import React, { useEffect, useState } from 'react';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';

import axios from '../axios';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';

import { fetchOnlyPostComments } from '../redux/slices/comment';

export const FullPost = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const userData = useSelector((state) => state.auth.data)
  const { comments } = useSelector((state) => state.comments);
  const { id } = useParams();

  const isCommentsLoading = comments.status === 'loading';

  useEffect(() => {
    dispatch(fetchOnlyPostComments(id));

    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении поста');
      });
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.commentsCount}
        tags={data.tags}
        isFullPost
      >
        <Markdown children={data.text} />
      </Post>
      <CommentsBlock items={comments.items} isLoading={isCommentsLoading}>
        <Index user={userData} postId={id} />
      </CommentsBlock>
    </>
  );
};
