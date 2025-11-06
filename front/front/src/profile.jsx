import { useAuth } from "./auth-hook";
import { Link } from "react-router-dom";
import { useUserInfo } from "./hooks/getUserHook";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./css/profile.module.css";

function Profile() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { loading, LogOut } = useAuth();
  const { data, setData } = useUserInfo();
  const defaultImage = "/346569.png";
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const watchAvatar = watch("avatar");

  const saveChangeData = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/un/change-profile-data",
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("Профіль успішно оновлено!");
        console.log(response.data.user);

        setData(response.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.log(
        "Server error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const editChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div className={styles.profilePage}>
        <div className={styles.infoBox}>
          <div className={styles.nameetc}>
            <h1>Ваш профіль:</h1>
            <img
              src={
                watchAvatar && watchAvatar.length > 0
                  ? URL.createObjectURL(watchAvatar[0])
                  : data?.avatar
                  ? `http://localhost:5000${data.avatar}`
                  : defaultImage
              }
              alt="avatar"
              className={styles.profileAvatar}
            />
            {isEditing && (
              <>
                {" "}
                <input
                  {...register("avatar", {
                    validate: {
                      fileSize: (files) =>
                        !files?.length ||
                        Array.from(files).every(
                          (file) => file.size <= 5_000_000
                        ) ||
                        "Файл занадто великий!",
                      fileType: (files) =>
                        Array.from(files).every((file) =>
                          ["image/jpeg", "image/png"].includes(file.type)
                        ) || "Дозволені типи: JPG або PNG!",
                    },
                  })}
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                />
                <button
                  onClick={() => document.getElementById("fileInput").click()}
                  type="button"
                >
                  Завантажити фото
                </button>
              </>
            )}

            <div>
              <p>Email-адреса:</p>
              {isEditing ? (
                <>
                  <input
                    {...register("email", {
                      required: "Поле повинно бути заповненим!",
                      minLength: {
                        value: 4,
                        message: "Не менше 4 символів!",
                      },
                      pattern: {
                        value: /^[\w.]+@[a-z]+\.[a-z]{2,5}$/,
                        message: "Невірна email-адреса!",
                      },
                    })}
                    type="text"
                    placeholder="email"
                    onChange={editChange}
                    value={editedData.email}
                  />
                  <p className="errorText">{errors.email?.message}</p>
                </>
              ) : (
                <>
                  <strong>{data?.email}</strong>
                </>
              )}
            </div>
            <div>
              <p>Ім'я:</p>
              {isEditing ? (
                <>
                  <input
                    {...register("name", {
                      required: "Поле не може бути пустим!",
                      minLength: {
                        value: 1,
                        message: "Повинен бути хочаби 1 символ!",
                      },
                      validate: (value) =>
                        value.trim() !== "" || "Поле повинно містити символи!",
                    })}
                    type="text"
                    placeholder="Ім'я"
                    onChange={editChange}
                    value={editedData.name}
                  />
                  <p className="errorText">{errors.name?.message}</p>
                </>
              ) : (
                <>
                  <strong>{data?.name}</strong>
                </>
              )}
            </div>
            {isEditing ? (
              <>
                <button onClick={handleSubmit(saveChangeData)}>
                  Зберегти зміни
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedData({});
                  }}
                >
                  Відмінити
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditedData({
                      name: data?.name || "",
                      email: data?.email || "",
                    });
                    setIsEditing(true);
                  }}
                >
                  Редагувати
                </button>
                <button onClick={() => LogOut()}>Logout</button>
              </>
            )}
          </div>
          <nav className={styles.nav}>
            <Link to="/my-friends">Friend's list</Link>
            <Link to="/my-posts">Post's list</Link>
            <Link to="/liked-posts">Liked posts</Link>
            <Link to="/commented-posts">Comments</Link>
            <Link to="/create-post">Create new post</Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Profile;
