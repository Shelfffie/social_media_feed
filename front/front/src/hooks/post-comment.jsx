import axios from "axios";
import { useAuth } from "../auth-hook";
import { useState } from "react";

export function PostCommentHook(setData, setPost) {
  const { isLoggedIn } = useAuth();
  const [comment, setComment] = useState({});

  const handleCommentChange = (postId, value) => {
    setComment((prev) => ({ ...prev, [postId]: value }));
  };

  const addCommentSubmit = async (e, postId) => {
    e.preventDefault();

    if (!isLoggedIn) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/un/note/${postId}/comments`,
        { content: comment[postId] },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("Comment success sended!");
        setComment((prev) => ({ ...prev, [postId]: "" }));
        if (setData) {
          setData((prev) => ({
            ...prev,
            notes: prev.notes.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    comments: [...post.comments, response.data.comment],
                  }
                : post
            ),
          }));
        } else if (setPost) {
          setPost((prev) => ({
            ...prev,
            comments: [response.data.comment, ...(prev.comments || [])],
          }));
        }
      }
    } catch (error) {
      console.log(
        "Server error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return { handleCommentChange, addCommentSubmit, comment, setComment };
}
