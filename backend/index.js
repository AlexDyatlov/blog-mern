import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
  registerValidation,
  loginValidation,
  postCreateValidation
} from './validations/validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { UserController, PostController } from './controllers/index.js';

mongoose
  .connect(
    'mongodb+srv://admin:wwwwww6@cluster0.b32tcyn.mongodb.net/blog?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();
// Создание хранилища
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads'); // Сохраняем файлы в папку uploads
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname); // название файла
  }
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());

// запрос на uploads перенаправлять на папку uploads
app.use('/uploads', express.static('uploads')); // get запрос на получение статич. файла

app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${req.file.originalname}` });
});

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
