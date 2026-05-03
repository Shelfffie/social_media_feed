import Comments from "../schemas/commentsdb.js";
import User from "../schemas/userDB.js";
import Post from "../schemas/noteDB.js";

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content.trim()) {
      return res
        .status(400)
        .json({ message: "Всі поля повинні бути заповнені!" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Пост не знайдено" });
    }
    const user = await User.findById(req.user.id);
    const comment = new Comments({
      content,
      creatorId: req.user.id,
      noteId: id,
    });
    await comment.save();
    post.comments.push(comment._id);
    user.comments.push(comment._id);
    await post.save();
    await user.save();
    await comment.populate({ path: "creatorId", select: "name email" });
    res.json({ comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Пост не знайдено" });
    }
    const comments = await Comments.find({ noteId: id });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
