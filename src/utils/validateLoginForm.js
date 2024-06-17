// src/utils/validateLoginForm.js

const validateLoginForm = (values) => {
  const { email, password } = values;
  let errors = {};
  let helperText = "";
  let isValid = true;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!email) {
    helperText =
      "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)";
    errors.email =
      "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)";
    isValid = false;
  } else if (!validateEmail(email)) {
    helperText =
      "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)";
    errors.email =
      "*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)";
    isValid = false;
  }

  if (!password) {
    helperText = "비밀번호를 입력해주세요";
    errors.password = "비밀번호를 입력해주세요";
    isValid = false;
  } else if (password.length < 8) {
    helperText = "비밀번호가 짧습니다";
    errors.password = "비밀번호가 짧습니다";
    isValid = false;
  } else if (password.length > 20) {
    helperText = "비밀번호가 너무 깁니다";
    errors.password = "비밀번호가 너무 깁니다";
    isValid = false;
  }

  return { errors, helperText, isValid };
};

export default validateLoginForm;
