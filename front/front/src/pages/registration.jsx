import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from "../css/login-register.module.css";

function Registration() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState();

  const navigate = useNavigate();

  const password = watch("password");

  const onValid = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/un/registration",
        data
      );
      console.log("Result:", response);
      if (response.status === 201) {
        alert("Registration success!");
        navigate("/");
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
          {" "}
          <h1>Registration:</h1>
          <h3>Input your email</h3>
          <input
            type="text"
            placeholder="email"
            {...register("email", {
              required: "The field must be filled in!",
              minLength: { value: 4, message: "Must be at least 4 symbols!" },
              pattern: {
                value: /^[\w.]+@[a-z]+\.[a-z]{2,5}$/,
                message: "Incorrect email address!",
              },
            })}
            onChange={() => setErrorMessage("")}
          />
          <p className="errorText">{errors.email?.message}</p>
          <h3>Input your name:</h3>
          <input
            {...register("name", {
              required: "The field must bbu filled in!",
              minLength: { value: 2, message: "Must be at least 2 symbol!" },
            })}
            onChange={() => setErrorMessage("")}
            type="text"
            placeholder="name"
          />
          <p className="errorText">{errors.name?.message}</p>
          <h3>Input your password:</h3>
          <input
            {...register("password", {
              required: "The field must be filled in!",
              minLength: { value: 8, message: "Must be at least 8 symbol!" },
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
          <h3>Repeat your password:</h3>
          <input
            {...register("confirmPassword", {
              required: "Confirm your password!",
              validate: (value) =>
                value === password || "Passwords do not match!",
            })}
            onChange={() => setErrorMessage("")}
            type="password"
            placeholder="Confirm password"
          />
          <p className="errorText"> {errors.confirmPassword?.message}</p>
          <p>{errorMessage}</p>
          <button type="submit">Send form</button>
        </div>{" "}
        <div>
          <div className={styles.dontAcc}>
            {" "}
            <p>You already have account?</p>
            <Link to="/login">
              <p>Log in</p>
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}

export default Registration;
