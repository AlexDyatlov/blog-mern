import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export const create = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    const id = req.body.postId;

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const doc = new CommentModel({
      text: req.body.text,
      postId: id,
      user
    });

    PostModel.findOneAndUpdate(
      { _id: id },
      { $inc: { commentsCount: 1 } },
      { returnDocument: 'after' }
    )
      .then(() => {})
      .catch((err) => console.log(err));

    const comment = await doc.save();

    const populatedComment = await CommentModel.findById(comment._id).populate(
      'user',
      'fullName avatarUrl'
    );

    res.json(populatedComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось создать комментарий' });
  }
};

export const remove = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await CommentModel.findOneAndDelete({ postId: commentId });

    if (!comment) {
      res.status(500).json({ message: 'Не удалось удалить комментарии' });
    }

    res.json({
      success: true
    });
  } catch (err) {
    console.log('err ошибка', err);
    res.status(500).json({ message: 'Не удалось удалить комментарии' });
  }
};

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .populate('user', 'fullName avatarUrl')
      .exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось получить комментарии' });
  }
};

export const getOnlyPostAll = async (req, res) => {
  try {
    const id = req.params.id;
    const comments = await CommentModel.find({ postId: id })
      .populate('user', 'fullName avatarUrl')
      .exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось получить комментарии' });
  }
};
