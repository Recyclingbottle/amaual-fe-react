import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SignUpPage.module.css";
import addIcon from "../assets/add-icon.png";
import FormGroup from "../components/FormGroup";
import Button from "../components/Button";
import validateAuth from "../utils/validateAuth";

const SignUpPage = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const fileInputRef = useRef(null);
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageHelperText, setProfileImageHelperText] =
    useState("*프로필 사진을 등록해주세요.");
  const [newProfileImageFile, setNewProfileImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const validate = async () => {
      const syncErrors = validateAuth.syncValidate(values, true);
      const asyncErrors = await validateAuth.asyncValidate(values);
      setErrors({ ...syncErrors, ...asyncErrors });
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfileImageFile(file);
      setProfileImage(URL.createObjectURL(file));
      setProfileImageHelperText("");
    } else {
      setNewProfileImageFile(null);
      setProfileImage(null);
      setProfileImageHelperText("*프로필 사진을 등록해주세요.");
    }
  };

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    const validationErrors = validateAuth.syncValidate(values, true);
    const asyncErrors = await validateAuth.asyncValidate(values);
    const allErrors = { ...validationErrors, ...asyncErrors };

    setErrors(allErrors);

    const isValid = Object.keys(allErrors).length === 0;

    if (!isValid || !profileImage) {
      if (!profileImage) {
        setProfileImageHelperText("*프로필 사진을 등록해주세요.");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload the profile image first
      const formData = new FormData();
      formData.append("image", newProfileImageFile);

      const uploadResponse = await axios.post(
        `${apiUrl}/upload/profile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const profileImageFilename = uploadResponse.data.filename;

      // Proceed with the sign-up process using the uploaded profile image filename
      const signUpData = {
        email: values.email,
        password: values.password,
        nickname: values.nickname,
        profile_image: profileImageFilename,
      };

      const signUpResponse = await axios.post(
        `${apiUrl}/users/signup`,
        signUpData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (signUpResponse.status === 201) {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      }
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.signUpContainer}>
        <h2 className={styles.pageHeader}>회원가입</h2>
        <form onSubmit={handleSignUp}>
          <FormGroup label="프로필 사진" helperText={profileImageHelperText}>
            <div className={styles.pbox}>
              <div
                className={styles.profileAddBox}
                onClick={handleProfileClick}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="프로필 이미지"
                    className={styles.profileImage}
                  />
                ) : (
                  <img
                    src={addIcon}
                    alt="추가 아이콘"
                    className={styles.addIcon}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </FormGroup>
          <FormGroup label="이메일*">
            <input
              className={styles.formGroupInput}
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <p className={styles.helperText}>{errors.email}</p>
            )}
          </FormGroup>
          <FormGroup label="비밀번호*">
            <input
              className={styles.formGroupInput}
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className={styles.helperText}>{errors.password}</p>
            )}
          </FormGroup>
          <FormGroup label="비밀번호 확인*">
            <input
              className={styles.formGroupInput}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p className={styles.helperText}>{errors.confirmPassword}</p>
            )}
          </FormGroup>
          <FormGroup label="닉네임*">
            <input
              className={styles.formGroupInput}
              type="text"
              id="nickname"
              name="nickname"
              value={values.nickname}
              onChange={handleChange}
              required
            />
            {errors.nickname && (
              <p className={styles.helperText}>{errors.nickname}</p>
            )}
          </FormGroup>
          <Button
            className={styles.signupButton}
            type="submit"
            disabled={isSubmitting}
          >
            회원가입
          </Button>
        </form>
        <p className={styles.goLogin} onClick={() => navigate("/login")}>
          로그인 하러가기
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
