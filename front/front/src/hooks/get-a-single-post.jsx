import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function usePostInfo(id) {
  const [post, setPost] = useState();
  const [isLoading, setIsLoading] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    setIsLoading(true);
    const getPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/un/post/${id}`,
          { withCredentials: true }
        );
        setPost(response.data);
      } catch (error) {
        if (error.response.status === 404 || error.response.status === 400) {
          navigate("/post/invalid");
        } else {
          console.log(
            "Server error",
            error.response ? error.response.data : error.message
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    getPost();
  }, [id, navigate]);

  return { post, setPost, isLoading };
}
