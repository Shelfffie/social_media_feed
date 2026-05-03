import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "../alertContext";

export function usePostChanger(id, post, setPosts, user) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { title: "", content: "" } });
  const { confirm, alert } = useConfirm();
  const navigate = useNavigate();

  const saveEditPost = async (data, id) => {
    if (post && post?.ownerId._id.toString() !== user.toString()) return;
    const ok = await confirm({
      title: "Зберегти пост?",
      message: "Цю дію не можна буде відмінити",
    });

    if (ok) {
      try {
        const response = await axios.put(
          `http://localhost:5000/un/post/${id}`,
          data,
          { withCredentials: true }
        );
        if (response.status === 200) {
          const ok = await alert({ title: "Пост збережено" });
          if (ok) {
            setPosts(response.data.post);
            navigate(`/post/${id}`);
          }
        }
      } catch (error) {
        console.log(
          "Server error:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const deletePost = async (id) => {
    if (post && post?.ownerId._id.toString() !== user.toString()) return;
    const ok = await confirm({
      title: "Зберегти пост?",
      message: "Його не можна буде повернути",
    });

    if (ok) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/un/post/${id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          const ok = await alert({ title: "Пост видалено" });
          if (ok) {
            navigate(`/`);
          }
        }
      } catch (error) {
        console.log(
          "Server error:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  return { register, handleSubmit, errors, saveEditPost, deletePost, setValue };
}
