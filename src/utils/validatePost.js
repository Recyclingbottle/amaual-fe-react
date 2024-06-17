// src/utils/validatePost.js
export default function validatePost(values) {
  let errors = {};

  if (!values.title) {
    errors.title = "제목을 입력해주세요.";
  } else if (values.title.length > 26) {
    errors.title = "제목은 26자 이하이어야 합니다.";
  }

  if (!values.content) {
    errors.content = "내용을 입력해주세요.";
  }

  return errors;
}
