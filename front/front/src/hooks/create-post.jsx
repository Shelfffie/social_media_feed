import axios from "axios";
import { useAuth } from "../auth-hook";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function useCreatePost() {
  const [newPost, setNewPost] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((file) => {
        formData.append("images", file);
      });
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/un/create-post",
        formData,
        { withCredentials: true }
      );
      if (response.status === 201) {
        alert("Post created!");
        const newPost = response.data.post;
        setNewPost(newPost);
        navigate(`/post/${newPost._id}`);
      }
    } catch (error) {
      console.log(
        "Server error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return { newPost, register, handleSubmit, onSubmit, errors };
}
