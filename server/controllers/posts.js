import Post from "../schemas/noteDB.js";
import User from "../schemas/userDB.js";

import mongoose from "mongoose";
import { setLets } from "./getTenByPage.js";

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  //Захищає регулярний вираз від ін'єкцій (наприклад, від користувача, який введе .* або [] )
}

export const getPostsTenAndFilter = async (req, res, id) => {
  const title = req.query.title;
  const page = parseInt(req.query.page) || 1;
  let limit = 10;
  const offset = (page - 1) * limit;
  let filter = {};

  if (id) {
    filter = { ownerId: id };
  }

  if (title) {
    const safe = escapeRegex(title);
    filter.title = { $regex: safe, $options: "i" };
  }

  const count = await Post.countDocuments(filter);
  const postsDoc = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate({ path: "ownerId", select: "name" })
    .populate({
      path: "comments",
      populate: { path: "creatorId", select: "name email" },
    });

  if (!postsDoc) {
    return res.json(setLets(0, page, 0, []));
  }

  const posts = postsDoc.map((p) => {
    const post = p.toObject();
    post.totalLikes = post.likes.length;

    if (req.signedCookies?.user) {
      post.isLiked = post.likes.some(
        (likeId) => likeId.toString() === req.user?.id
      );
    }
    return post;
  });

  let totalPage = Math.ceil(count / limit);
  if (page > totalPage) {
    return res.json(setLets(count, page, totalPage, []));
  }

  res.json(setLets(count, page, totalPage, posts));
};

export const getPostById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID." });
    }
    const postDoc = await Post.findById(id)
      .populate({ path: "ownerId", select: "name _id" })
      .populate({
        path: "comments",
        select: "content",
        populate: { path: "creatorId", select: "name" },
      });

    if (!postDoc) {
      return res.status(404).json({ message: "Post not found." });
    }

    const post = postDoc.toObject();
    let isLiked = false;

    const cookiesUser = req.user?.id;

    if (cookiesUser) {
      isLiked = post.likes.some(
        (likeId) => likeId.toString() === cookiesUser.toString()
      );
    }

    post.isLiked = isLiked;
    post.totalLikes = post.likes.length;

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Всі поля повинні бути заповнені!" });
    }

    const images = req.files.map((file) => `/` + file.path.replace(/\\/g, "/"));
    const ownerId = req.user.id;
    const post = new Post({ title, content, ownerId, images });
    const user = await User.findById(ownerId);
    await post.save();
    user.posts.push(post._id);
    await user.save();
    res.status(201).json({ message: "Нотатку створено!", post: post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const editePost = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    if (!newData) {
      return res.status(400).json({ message: "Не надано даних для зміни" });
    }
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Пост не знайдено" });
    }
    if (post.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Немає доступу" });
    }

    if (newData.title) post.title = newData.title;
    if (newData.content) post.content = newData.content;

    await post.save();
    res.json({ message: "Пост оновлено!", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Пост не знайдено" });
    }
    if (post.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Немає доступу" });
    }
    await post.deleteOne();
    res.json({ message: "Пост видалено!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
