import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import styles from "./LoginPage.module.css";
import { setUser } from "../store/userSlice";
import FormGroup from "../components/FormGroup";
import Button from "../components/Button";
import validateLoginForm from "../utils/validateLoginForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const validate = async () => {
      const syncErrors = validateLoginForm(values);
      setErrors(syncErrors);
    };

    validate();
  }, [values]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/login`,
        values,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        const { email, nickname, id, profile_image } = response.data.user;
        dispatch(
          setUser({ email, nickname, userId: id, profileImage: profile_image })
        );
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        alert("이메일 & 비밀번호가 틀렸습니다.");
      } else {
        alert("서버 오류가 발생했습니다.");
      }
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const syncErrors = validateLoginForm(values);
    setErrors(syncErrors);

    const isValid = Object.keys(syncErrors).length === 0;
    if (isValid) {
      setIsSubmitting(true);
      await handleLogin();
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        <p className={styles.pageHeader}>로그인</p>
        <form onSubmit={handleFormSubmit} className={styles.loginForm}>
          <FormGroup label="이메일">
            <input
              type="email"
              id="email"
              name="email"
              className={styles.formGroupInput}
              onChange={handleChange}
              value={values.email}
            />
            {errors.email && (
              <p className={styles.helperText}>{errors.email}</p>
            )}
          </FormGroup>
          <FormGroup label="비밀번호">
            <input
              type="password"
              id="password"
              name="password"
              className={styles.formGroupInput}
              onChange={handleChange}
              value={values.password}
            />
            {errors.password && (
              <p className={styles.helperText}>{errors.password}</p>
            )}
          </FormGroup>
          <Button type="submit" disabled={isSubmitting}>
            로그인
          </Button>
        </form>
        <p className={styles.signupLink} onClick={() => navigate("/signup")}>
          회원가입
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
