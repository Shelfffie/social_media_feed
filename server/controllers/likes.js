import Post from "../schemas/noteDB.js";
import User from "../schemas/userDB.js";

export const likeUnlike = async (req, res, id) => {
  try {
    const postId = req.params.id;
    const user = await User.findById(id).select("likes");
    const likedPost = await Post.findById(postId).select("likes");

    if (!likedPost) {
      return res.status(404).json({ message: "Такого поста не існує" });
    }

    let message = "";
    let isLiked;

    if (likedPost.likes.includes(id)) {
      likedPost.likes = likedPost.likes.filter(
        (likeId) => likeId.toString() !== id.toString()
      );
      user.likes = user.likes.filter(
        (userId) => userId.toString() !== postId.toString()
      );
      message = "Вподобайку прибрано";
      isLiked = false;
    } else {
      user.likes.push(postId);
      likedPost.likes.push(id);
      message = "Вподобайку поставлено";
      isLiked = true;
    }

    await user.save();
    await likedPost.save();
    res.json({ message, isLiked, totalLikes: likedPost.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
