import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SignUpPage.module.css";
import addIcon from "../assets/add-icon.png";

const SignUpPage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageHelperText, setProfileImageHelperText] =
    useState("*프로필 사진을 등록해주세요.");
  const [email, setEmail] = useState("");
  const [emailHelperText, setEmailHelperText] =
    useState("이메일을 입력해주세요");
  const [password, setPassword] = useState("");
  const [passwordHelperText, setPasswordHelperText] =
    useState("비밀번호를 입력해주세요");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    useState("비밀번호를 한번 더 입력해주세요");
  const [nickname, setNickname] = useState("");
  const [nicknameHelperText, setNicknameHelperText] =
    useState("닉네임을 입력해주세요");
  const [isFormValid, setIsFormValid] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setProfileImageHelperText("");
    } else {
      setProfileImage(null);
      setProfileImageHelperText("*프로필 사진을 등록해주세요.");
    }
  };

  const handleProfileClick = () => {
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  const validateEmail = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailHelperText("*이메일을 입력해주세요.");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailHelperText(
        "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)"
      );
      return false;
    }

    try {
      const response = await axios.get(`${apiUrl}/users/check-email`, {
        params: { email },
      });
      if (
        response.status === 200 &&
        response.data.message === "이미 사용 중인 이메일입니다."
      ) {
        setEmailHelperText("*중복된 이메일입니다.");
        return false;
      }
      setEmailHelperText("");
      return true;
    } catch (error) {
      setEmailHelperText("*이메일 중복 확인 중 오류가 발생했습니다.");
      return false;
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;
    if (!password) {
      setPasswordHelperText("*비밀번호를 입력해주세요.");
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordHelperText(
        "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다."
      );
      return false;
    }
    setPasswordHelperText("");
    return true;
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      setConfirmPasswordHelperText("*비밀번호를 한번 더 입력해주세요");
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordHelperText("*비밀번호가 다릅니다.");
      return false;
    }
    setConfirmPasswordHelperText("");
    return true;
  };

  const validateNickname = async (nickname) => {
    const nicknameRegex = /^[^\s]{1,10}$/;
    if (!nickname) {
      setNicknameHelperText("*닉네임을 입력해주세요.");
      return false;
    } else if (!nicknameRegex.test(nickname)) {
      if (/\s/.test(nickname)) {
        setNicknameHelperText("*띄어쓰기를 없애주세요.");
      } else if (nickname.length > 10) {
        setNicknameHelperText("*닉네임은 최대 10자까지 작성 가능합니다.");
      }
      return false;
    }

    try {
      const response = await axios.get(`${apiUrl}/users/check-nickname`, {
        params: { nickname },
      });
      if (
        response.status === 200 &&
        response.data.message === "이미 사용 중인 닉네임입니다."
      ) {
        setNicknameHelperText("*중복된 닉네임입니다.");
        return false;
      }
      setNicknameHelperText("");
      return true;
    } catch (error) {
      setNicknameHelperText("*닉네임 중복 확인 중 오류가 발생했습니다.");
      return false;
    }
  };

  useEffect(() => {
    const isFormValid = async () => {
      const isProfileImageValid = profileImage !== null;
      const isEmailValid = await validateEmail(email);
      const isPasswordValid = validatePassword(password);
      const isConfirmPasswordValid = validateConfirmPassword(
        confirmPassword,
        password
      );
      const isNicknameValid = await validateNickname(nickname);

      setIsFormValid(
        isProfileImageValid &&
          isEmailValid &&
          isPasswordValid &&
          isConfirmPasswordValid &&
          isNicknameValid
      );
    };

    isFormValid();
  }, [profileImage, email, password, confirmPassword, nickname]);

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    let filename = "";

    // 1. 프로필 사진 업로드
    if (profileImage) {
      try {
        const formData = new FormData();
        formData.append("image", fileInputRef.current.files[0]);

        const uploadResponse = await axios.post(
          `${apiUrl}/upload/profile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (
          uploadResponse.status === 200 &&
          uploadResponse.data.message === "File uploaded successfully"
        ) {
          filename = uploadResponse.data.filename;
        } else {
          setProfileImageHelperText("사진 업로드 실패. 다시 시도해주세요.");
          return;
        }
      } catch (error) {
        setProfileImageHelperText("사진 업로드 중 오류가 발생했습니다.");
        return;
      }
    }

    // 2. 회원가입 요청
    try {
      const signupResponse = await axios.post(
        `${apiUrl}/users/signup`,
        {
          email: email,
          password: password,
          nickname: nickname,
          profile_image: filename,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        signupResponse.status === 201 &&
        signupResponse.data.message === "회원가입이 완료되었습니다."
      ) {
        navigate("/login");
      } else {
        setNicknameHelperText(signupResponse.data.message);
      }
    } catch (error) {
      setNicknameHelperText("회원가입 중 오류가 발생했습니다.");
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.signUpContainer}>
        <p className={styles.pageHeader}>회원가입</p>
        <div className={styles.uploadContainer}>
          <label className={styles.profileLabel}>프로필 사진</label>
          <p className={styles.helperText}>{profileImageHelperText}</p>
          <div className={styles.profileAddBox} onClick={handleProfileClick}>
            <input
              type="file"
              className={styles.fileInput}
              ref={fileInputRef}
              onClick={(e) => {
                e.target.value = null;
                setProfileImage(null);
              }}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <img
              src={profileImage || addIcon}
              alt="Profile"
              className={profileImage ? styles.profileImage : styles.addIcon}
            />
          </div>
        </div>
        <form onSubmit={handleSignUp}>
          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="email">
              이메일*
            </label>
            <input
              className={styles.formGroupInput}
              type="email"
              id="email"
              name="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onBlur={(e) => validateEmail(e.target.value)}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className={styles.helperText} id="email-helper">
              {emailHelperText}
            </p>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="password">
              비밀번호*
            </label>
            <input
              className={styles.formGroupInput}
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onBlur={(e) => validatePassword(e.target.value)}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className={styles.helperText} id="password-helper">
              {passwordHelperText}
            </p>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="confirm-password">
              비밀번호 확인*
            </label>
            <input
              className={styles.formGroupInput}
              type="password"
              id="confirm-password"
              name="confirm_password"
              placeholder="비밀번호를 한번 더 입력하세요"
              value={confirmPassword}
              onBlur={(e) => validateConfirmPassword(e.target.value, password)}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <p className={styles.helperText} id="confirm-password-helper">
              {confirmPasswordHelperText}
            </p>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="nickname">
              닉네임*
            </label>
            <input
              className={styles.formGroupInput}
              type="text"
              id="nickname"
              name="nickname"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onBlur={(e) => validateNickname(e.target.value)}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            <p className={styles.helperText} id="nickname-helper">
              {nicknameHelperText}
            </p>
          </div>
          <button
            className={styles.signupButton}
            id="signup-button"
            type="submit"
            style={{
              marginTop: "10px",
              backgroundColor: isFormValid ? "#7F6AEE" : "#ACA0EB",
            }}
            disabled={!isFormValid}
          >
            회원가입
          </button>
        </form>
        <p className={styles.goLogin} onClick={goToLogin}>
          로그인 하러가기
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
