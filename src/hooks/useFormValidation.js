import { useState, useEffect } from "react";

const useFormValidation = (initialState, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    }
  }, [errors, isSubmitting]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });

    // 입력 필드의 값이 변경될 때마다 유효성 검사를 수행
    const validationErrors = validate({ ...values, [name]: value });
    setErrors(validationErrors);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
    return Object.keys(validationErrors).length === 0; // 유효성 검사 결과 반환
  };

  return {
    handleChange,
    handleSubmit,
    values,
    setValues, // setValues 추가
    errors,
    isSubmitting,
  };
};

export default useFormValidation;
