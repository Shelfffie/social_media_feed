import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../auth-hook";

export function useLikes(setData, setPost) {
  const { isLoggedIn } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const setUnsetLike = async (id) => {
    if (!isLoggedIn || isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/un/post/${id}/like`,
        {},
        { withCredentials: true }
      );
      const { isLiked, totalLikes } = response.data;
      if (setPost) {
        setPost((post) => ({ ...post, isLiked, totalLikes }));
      } else if (setData) {
        setData((prev) =>
          prev.map((post) =>
            post._id === id ? { ...post, isLiked, totalLikes } : post
          )
        );
      }
    } catch (error) {
      console.log(
        "Server error:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return { setUnsetLike };
}
