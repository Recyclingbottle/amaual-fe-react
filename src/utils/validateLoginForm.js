const validateLoginForm = (values) => {
  const { email, password } = values;
  let errors = {};

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!email) {
    errors.email =
      "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
  } else if (!validateEmail(email)) {
    errors.email =
      "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
  }

  if (!password) {
    errors.password = "*비밀번호를 입력해주세요.";
  } else if (password.length < 8) {
    errors.password = "*비밀번호는 8자 이상이어야 합니다.";
  } else if (password.length > 20) {
    errors.password = "*비밀번호는 20자 이하이어야 합니다.";
  }

  return errors;
};

export default validateLoginForm;
