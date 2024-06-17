import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  return passwordRegex.test(password);
};

const validateNickname = (nickname) => {
  const nicknameRegex = /^[^\s]{1,10}$/;
  return nicknameRegex.test(nickname);
};

const checkEmailDuplicate = async (email) => {
  try {
    const response = await axios.get(`${apiUrl}/users/check-email`, {
      params: { email },
    });
    return response.data.message;
  } catch (error) {
    return "이메일 중복 체크 중 오류가 발생했습니다.";
  }
};

const checkNicknameDuplicate = async (nickname) => {
  try {
    const response = await axios.get(`${apiUrl}/users/check-nickname`, {
      params: { nickname },
    });
    return response.data.message;
  } catch (error) {
    return "닉네임 중복 체크 중 오류가 발생했습니다.";
  }
};

const syncValidate = (values, isSignUp = false) => {
  let errors = {};

  if (!values.email) {
    errors.email = "이메일을 입력해주세요.";
  } else if (!validateEmail(values.email)) {
    errors.email =
      "올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
  }

  if (!values.password) {
    errors.password = "비밀번호를 입력해주세요.";
  } else if (!validatePassword(values.password)) {
    errors.password =
      "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  }

  if (isSignUp) {
    if (!values.confirmPassword) {
      errors.confirmPassword = "비밀번호를 한번 더 입력해주세요.";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "비밀번호가 다릅니다.";
    }

    if (!values.nickname) {
      errors.nickname = "닉네임을 입력해주세요.";
    } else if (!validateNickname(values.nickname)) {
      if (values.nickname.length > 10) {
        errors.nickname = "닉네임은 최대 10자까지 작성 가능합니다.";
      } else {
        errors.nickname = "닉네임에는 띄어쓰기를 사용할 수 없습니다.";
      }
    }
  }

  return errors;
};

const asyncValidate = async (values) => {
  let errors = {};

  if (values.email) {
    const emailCheckMessage = await checkEmailDuplicate(values.email);
    if (emailCheckMessage !== "사용 가능한 이메일입니다.") {
      errors.email = emailCheckMessage;
    }
  }

  if (values.nickname) {
    const nicknameCheckMessage = await checkNicknameDuplicate(values.nickname);
    if (nicknameCheckMessage !== "사용 가능한 닉네임입니다.") {
      errors.nickname = nicknameCheckMessage;
    }
  }

  return errors;
};

export default {
  syncValidate,
  asyncValidate,
};
