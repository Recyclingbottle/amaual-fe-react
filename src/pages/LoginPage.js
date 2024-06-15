import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./LoginPage.module.css";

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [helperText, setHelperText] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();

  // 이메일 입력 시 유효성 검사하는 함수
  const emailValidate = (email) => {
    // 이메일 input 이 입력될 때 마다 실행
    // 이메일 형식이 너무 짧은 경우, 입력하지 않은 경우, 유효하지 않은 경우 : helpertext 를 "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)"
    // 구글에 "이메일 검사 레거시" 검색하면 나옴
    const regex = /\S+@\S+\.\S+/;
    if (!email) {
      setHelperText(
        "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)"
      );
      setIsEmailValid(false);
    } else if (!regex.test(email)) {
      setHelperText(
        "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)"
      );
      setIsEmailValid(false);
    } else {
      setHelperText("");
      setIsEmailValid(true);
    }
  };

  // 비밀번호 입력 시 유효성 검사하는 함수
  const passwordValidate = (password) => {
    // 비밀번호 비었을겨 경우 helpertext 를 "비밀번호를 입력해주세요."
    // 8자 이하일 경우 helpertext 를 "비밀번호가 너무 짧습니다."
    if (!password) {
      setHelperText("비밀번호를 입력해주세요.");
      setIsPasswordValid(false);
    } else if (password.length <= 8) {
      setHelperText("비밀번호가 너무 짧습니다.");
      setIsPasswordValid(false);
    } else {
      setHelperText("");
      setIsPasswordValid(true);
    }
  };

  useEffect(() => {
    //비동기 문제를 해결하는 방법 중 가장 많이 씀
    //여기에 적절한 유효성 검사 함수 호출 하면됨.
    emailValidate(email);
  }, [email]);
  // useEffect(() => {
  //   //비동기 문제를 해결하는 방법 중 가장 많이 씀
  //   //여기에 적절한 유효성 검사 함수 호출 하면됨.
  //   passwordValidate(password);
  // }, [password]);
  // 이메일 마운트 -> 패스워드 마운트 되기에 초기 상태가
  // "비밀번호 입력해주세요" 임 이를 방지하도록 변경
  useEffect(() => {
    if (email && isEmailValid) {
      passwordValidate(password);
    }
  }, [password, email, isEmailValid]);

  // 로그인 form 제출 시 서버와 통신하는 함수
  const Login = async (e) => {
    //서버와 통신하는 부분
    // 로그인 API 통신, props 로 받은 setIsLoggedIn 를 호출하여 state를 true 로 변경해주어야함
    // 성공 시, "/" 로 페이지 이동 시켜주어야함
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const response = await axios.post(
        `${apiUrl}/users/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        props.setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setHelperText(error.response.data.message || "로그인에 실패했습니다.");
        console.error("로그인 실패:", error.response.data);
      } else {
        setHelperText("로그인 중 오류가 발생했습니다.");
        console.error("로그인 중 오류 발생:", error);
      }
    }
  };
  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        <p className={styles.pageHeader}>로그인</p>
        <form onSubmit={Login} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.formGroupInput}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.formGroupInput}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <p className={styles.helperText}>{helperText}</p>
          {/* 유효성 검사 통과 시 활성화 */}
          <button
            className={styles.loginButton}
            type="submit"
            disabled={!isEmailValid || !isPasswordValid}
            style={{
              backgroundColor:
                isEmailValid && isPasswordValid ? "#7E6AEE" : "#ACA0EB",
            }}
          >
            로그인
          </button>
        </form>
        <p className={styles.signupLink}>회원가입</p>
      </div>
    </div>
  );
};

export default LoginPage;
