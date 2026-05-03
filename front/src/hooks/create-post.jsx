import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "../alertContext";

export function useCreatePost() {
  const [newPost, setNewPost] = useState();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { confirm, alert } = useConfirm();
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const ok = await confirm({ title: "Створити пост?" });
    if (ok) {
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
          const ok = await alert({ title: "Пост створено!" });
          if (ok) {
            const newPost = response.data.post;
            setNewPost(newPost);
            navigate(`/post/${newPost._id}`);
          }
        }
      } catch (error) {
        console.log(
          "Server error:",
          error.response ? error.response.data : error.message
        );
        setErrorMsg(error.response ? error.response.data.error : error.message);
      }
    }
  };

  return { newPost, register, handleSubmit, onSubmit, watch, errors, errorMsg };
}
