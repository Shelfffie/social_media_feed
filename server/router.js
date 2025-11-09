import express from "express";
import Post from "./noteDB.js";
import User from "./userDB.js";
import { createUploader } from "./multer-upload.js";
import Comments from "./commentsdb.js";
import {
  getPostsTenAndFilter,
  getPostById,
  createPost,
  editePost,
  deletePost,
} from "./controllers/posts.js";
import { likeUnlike } from "./controllers/likes.js";
import { getTenByPage } from "./controllers/getTenByPage.js";
import {
  registration,
  login,
  authStatus,
  cookieGetId,
  logout,
  getCookieAndVerify,
} from "./controllers/login-registration.js";
import { getUserById } from "./controllers/users-controller.js";
import {
  friendAddDeleteControll,
  getFriendsAndRequests,
} from "./controllers/friends-controller.js";
import {
  addComment,
  getCommentsByPost,
} from "./controllers/comments-controller.js";
import { changeProfileInfo } from "./controllers/profile-controller.js";

const router = express.Router();

router.post("/registration", registration);

router.post("/login", login);

router.get("/auth-status", authStatus);

router.post("/logout", cookieGetId, logout);

router.get("/user", cookieGetId, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await getUserById(req, res, id, false);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/users", cookieGetId, async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const uploadPosts = createUploader("post-uploads");
router.post(
  "/create-post",
  cookieGetId,
  uploadPosts.array("images"),
  createPost
);

router.put("/post/:id", cookieGetId, editePost);

router.delete("/post/:id", cookieGetId, deletePost);

const uploadAvatar = createUploader("avatars");
router.put(
  "/change-profile-data",
  cookieGetId,
  uploadAvatar.single("avatar"),
  changeProfileInfo
);

router.get("/users/notes", cookieGetId, async (req, res) => {
  try {
    const id = req.user.id;
    await getPostsTenAndFilter(req, res, id);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/users/:id/notes", getCookieAndVerify, async (req, res) => {
  try {
    const { id } = req.params;
    await getPostsTenAndFilter(req, res, id);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/users/:id", getCookieAndVerify, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user?.id === req.params.id) {
      return res.json({});
    }
    const user = await getUserById(req, res, id, true);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/users/friends-control/:id", cookieGetId, friendAddDeleteControll);

router.get("/user/friends", cookieGetId, async (req, res) => {
  getFriendsAndRequests(req, res, "friends");
});

router.get("/user/received-requests", cookieGetId, async (req, res) => {
  getFriendsAndRequests(req, res, "friendsRequestfromUsers");
});

router.get("/user/sended-requests", cookieGetId, async (req, res) => {
  getFriendsAndRequests(req, res, "friendsRequest");
});

router.get("/user/:id/friends", cookieGetId, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getFrindsById(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/note/:id/comments", cookieGetId, addComment);

router.get("/note/:id/comments", getCommentsByPost);

router.get("/all-notes", getCookieAndVerify, async (req, res) => {
  await getPostsTenAndFilter(req, res);
});

router.get("/post/:id", getCookieAndVerify, getPostById);

router.get("/user/:id/comments", async (req, res) => {
  const { id } = req.params;
  await getTenByPage(
    req,
    res,
    null,
    Comments,
    Comments,
    null,
    { creatorId: id },
    {
      path: "noteId",
      select: "title",
    }
  );
});

router.get("/my-comments", cookieGetId, async (req, res) => {
  const id = req.user.id;
  await getTenByPage(req, res, id, false, true, Comments, "content noteId");
});

router.get("/posts-that-i-liked", cookieGetId, async (req, res) => {
  const id = req.user.id;
  await getTenByPage(
    req,
    res,
    id,
    true,
    false,
    Post,
    "title content likes images ownerId"
  );
});

router.put("/post/:id/like", cookieGetId, async (req, res) => {
  const id = req.user.id;
  await likeUnlike(req, res, id);
});

export default router;
