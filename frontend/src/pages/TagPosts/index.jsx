import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import styles from './TagPosts.module.scss';

import { Post } from '../../components';

import { fetchPostsForTag } from '../../redux/slices/post';

export const TagPosts = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts } = useSelector((state) => state.posts);
  const { tag } = useParams();

  const isPostsLoading = posts.status === 'loading';

  useEffect(() => {
    dispatch(fetchPostsForTag(tag));
  }, []);

  return (
    <>
      <h1 className={styles.title}>#{tag}</h1>
      <div className={styles.wrapper}>
        {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
          isPostsLoading ? (
            <Post key={index} isLoading={true} />
          ) : (
            <Post
              className={styles.item}
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
      </div>
    </>
  );
};
