import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec(); // у последних 5-ти
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 4); // последние 5-ть тегов
    res.json(tags);
  } catch (err) {
    console.log('err', err);
    res.status(500).json({
      message: 'Не удалось получить теги'
    });
  }
};

export const getPostsForTag = async (req, res) => {
  try {
    const tag = req.params.tag;
    const posts = await PostModel.find({ tags: tag }).populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось получить посты по тегу' });
  }
};

export const getAll = async (req, res) => {
  try {
    const sortQuery = req.query;
    let sort = {}; 

    if (sortQuery.order === '2') {
      sort = { viewsCount: "desc" }
    } else if (sortQuery.order === '1') {
      sort = { viewsCount: "asc" }
    } else if (sortQuery.order === '3') {
      sort = {createdAt: "desc"}
    } else {
      sort = null;
    }
    
    const posts = await PostModel.find().sort(sort).populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log('err', err);
    res.status(500).json({
      message: 'Не удалось получить посты'
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    // const post = await PostModel.findById(postId);

    // Получить статью и обновить колич. просмотров
    PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } }, // обновить viewsCount на 1
      { returnDocument: 'after' } // После обовления вернуть актуал. докум.
    )
      .populate('user')
      .then((post) => {
        if (!post) {
          return res.status(404).json({
            message: 'Пост не найден'
          });
        }

        res.json(post);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось получить посты' });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({ _id: postId }).then((post) => {
      if (!post) {
        res.status(500).json({ message: 'Не удалось удалить пост' });
      }
    });

    res.json({
      success: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось удалить пост' });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(',').map(tag => tag.trim()),
      user: req.userId
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось создать пост' });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(','),
        user: req.userId
      }
    );

    res.json({
      success: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось обновить пост' });
  }
};
