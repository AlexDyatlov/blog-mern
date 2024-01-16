import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import { fetchCreateComment } from '../../redux/slices/comment';

export const Index = ({ user, postId }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      text: '',
      postId
    },
    mode: 'onChange'
  });

  const onSubmit = async (values) => {
    try {
      await dispatch(fetchCreateComment(values)).unwrap();
      reset();
    } catch (err) {
      if (err[0]?.msg) {
        setError('text', {
          type: 'manual',
          message: err[0].msg
        });
      }

      alert('Ошибка при отправке комментария');
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={user.avatarUrl || '/noavatar.png'}
        />
        <div>
          <p className={styles.name}>{user.fullName}</p>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Написать комментарий"
              variant="outlined"
              maxRows={10}
              multiline
              type="text"
              error={Boolean(errors.text?.message)}
              helperText={errors.text?.message}
              {...register('text', { required: 'Укажите комментарий' })}
              fullWidth
            />
            <Button variant="contained" type="submit" disabled={!isValid}>
              Отправить
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
