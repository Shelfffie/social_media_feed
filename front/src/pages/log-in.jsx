import { useForm } from "react-hook-form";
import { useAuth } from "../auth-hook";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from "../css/login-register.module.css";
import { useConfirm } from "../alertContext";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState();
  const { alert } = useConfirm();

  const navigate = useNavigate();

  const onValid = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/un/login",
        data,
        { withCredentials: true }
      );
      if (response.status === 200) {
        const ok = await alert({ title: "Вхід успішний!" });
        if (ok) {
          setUser(response.data.payload);
          navigate("/");
        }
      }
    } catch (error) {
      console.log(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage(
        error.response.data.message || "Something went wrong, try again later."
      );
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onValid)} className={styles.formPage}>
        <div className={styles.stylesForm}>
          <h1>Login</h1>
          <h3>Enter your email:</h3>
          <input
            {...register("email", {
              required: "The field must be filled in!",
              minLength: { value: 4, message: "Must be at least 4 symbols!" },
              pattern: {
                value: /^[\w.]+@[a-z]+\.[a-z]{2,5}$/,
                message: "Incorrect email address!",
              },
            })}
            onChange={() => setErrorMessage("")}
            type="text"
            placeholder="email"
          />
          <p className="errorText">{errors.email?.message}</p>

          <h3>Input your password:</h3>
          <input
            {...register("password", {
              required: "The field must be filled in!",
              minLength: {
                value: 8,
                message: "Password can't be less than 8 symbols!",
              },
              pattern: {
                value: /^(?=.*[а-яa-zA-Z])(?=.*\d).{8,}$/,
                message: "Incorrect password!",
              },
            })}
            onChange={() => setErrorMessage("")}
            type="password"
            placeholder="password"
          />
          <p className="errorText">{errors.password?.message}</p>
          <p className="errorText">{errorMessage}</p>
          <button type="submit">Send form</button>
        </div>{" "}
        <div className={styles.dontAcc}>
          <p>Ще не маєте облікового запису??</p>
          <Link to="/registration">
            <p>Зареєструватися</p>
          </Link>
        </div>
      </form>
    </>
  );
}

export default Login;
