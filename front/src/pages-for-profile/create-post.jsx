import { useCreatePost } from "../hooks/create-post";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../css/createPost.module.css";
import PhotoModal from "../components/photo-displayer";

function CreatePostPage() {
  const { register, handleSubmit, onSubmit, watch, errors, errorMsg } =
    useCreatePost();
  const [showPhoto, setShowPhoto] = useState(false);
  const [urlPhoto, setUrlPhoto] = useState(null);
  const navigate = useNavigate();
  const watchImages = watch("images");

  const previewImages = watchImages
    ? Array.from(watchImages).map((file) => URL.createObjectURL(file))
    : [];

  useEffect(() => {
    return () => {
      if (previewImages.length > 0) {
        previewImages.forEach((src) => URL.revokeObjectURL(src));
      }
    };
  }, [watchImages]);

  return (
    <div className={styles.createPage}>
      <p onClick={() => navigate(-1)} className="navigate">
        Повернутися
      </p>

      <h1 className="titleForProfilePages">Опублікувати пост:</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className={styles.sendForm}
      >
        <p>Title:</p>
        <input
          {...register("title", {
            required: "Поле повинно бути заповненим!",
            minLength: { value: 1, message: "Повинен бути хочаби 1 символ!" },
            validate: (value) =>
              value.trim() !== "" || "Поле повинно містити символи!",
          })}
          type="text"
          placeholder="Заголовок"
          className={styles.infoInput}
        />
        <p className="errorText">{errors.title?.message}</p>
        <p>Content:</p>
        <textarea
          {...register("content", {
            required: "Поле повинно бути заповненим!",
            minLength: { value: 3, message: "Повинно бути хочаби 3 символи!" },
            validate: (value) =>
              value.trim() !== "" || "Поле повинно містити символи!",
          })}
          cols="30"
          rows="10"
          placeholder="Вміст"
          className={styles.infoInput}
        ></textarea>
        <p className="errorText">{errors.content?.message}</p>
        <input
          {...register("images", {
            validate: {
              fileSize: (files) =>
                !files?.length ||
                Array.from(files).every((file) => file.size <= 5_000_000) ||
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
          multiple
        />
        {previewImages?.length > 0 && (
          <div className={styles.imageContainer}>
            {previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                className="photo-click"
                onClick={() => {
                  setShowPhoto(true);
                  setUrlPhoto(src);
                }}
              />
            ))}
          </div>
        )}
        <button
          onClick={() => document.getElementById("fileInput").click()}
          className={`${styles.inputFileButton} ${styles.formButton}`}
          type="button"
        >
          Завантажити фото
        </button>

        <p className="errorText">{errors.images?.message}</p>
        {showPhoto && (
          <PhotoModal photoUrl={urlPhoto} setShowPhoto={setShowPhoto} />
        )}
        <button
          type="submit"
          style={{ border: "none" }}
          className={styles.formButton}
        >
          Створити
        </button>
        <p className="errorText">{errorMsg}</p>
      </form>
    </div>
  );
}

export default CreatePostPage;
