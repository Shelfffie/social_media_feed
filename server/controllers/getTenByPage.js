import User from "../userDB.js";

export const setLets = (count, page, totalPage, posts) => {
  const data = {
    total: count,
    page: page,
    totalPage: totalPage,
    posts: posts,
  };

  return data;
};

export const getTenByPage = async (
  req,
  res,
  id,
  isLikes,
  isComments,
  PostOrComment,
  selectedOpt
) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const user = await User.findById(id).select("likes comments");
    const ids = isLikes ? user.likes : user.comments;
    let count = ids.length;
    const paginatedIds = ids.slice(offset, offset + limit);

    let postsDoc = PostOrComment.find({ _id: { $in: paginatedIds } })
      .sort({
        createdAt: -1,
      })
      .select(selectedOpt); //"title content likes"

    if (isComments) {
      postsDoc = postsDoc.populate({ path: "noteId", select: "title content" });
    } else {
      postsDoc = postsDoc.populate({ path: "ownerId", select: "_id name" });
    }

    const gets = await postsDoc;

    if (!gets || gets.length === 0) {
      return res.json(setLets(0, page, 0, []));
    }

    let posts;

    if (isLikes) {
      posts = gets.map((p) => {
        const post = p.toObject();
        post.totalLikes = post.likes?.length || 0;
        post.isLiked = true;
        return post;
      });
    } else {
      posts = gets;
    }

    let totalPage = Math.ceil(count / limit);
    if (page > totalPage) {
      return res.json(setLets(count, page, totalPage, []));
    }

    res.json(setLets(count, page, totalPage, posts));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
