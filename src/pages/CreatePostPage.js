import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CreatePostPage.module.css";
import FormGroup from "../components/FormGroup";
import Button from "../components/Button";
import useFormValidation from "../hooks/useFormValidation";
import validatePost from "../utils/validatePost";
import withAuth from "../hocs/withAuth";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [imageFile, setImageFile] = useState(null);
  const [helperText, setHelperText] = useState("");

  const { handleChange, handleSubmit, values, errors, isSubmitting } =
    useFormValidation({ title: "", content: "" }, validatePost);

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleCreatePost = async () => {
    let uploadedImageName = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const uploadResponse = await axios.post(
          `${apiUrl}/upload/post`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (uploadResponse.status === 200) {
          uploadedImageName = uploadResponse.data.filename;
        } else {
          setHelperText("이미지 업로드에 실패했습니다.");
          return;
        }
      } catch (error) {
        setHelperText("이미지 업로드 중 오류가 발생했습니다.");
        return;
      }
    }

    const postPayload = {
      title: values.title,
      content: values.content,
      post_image: uploadedImageName,
    };

    try {
      const response = await axios.post(`${apiUrl}/posts`, postPayload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        navigate("/");
      } else {
        setHelperText("게시글 작성에 실패했습니다.");
      }
    } catch (error) {
      setHelperText("게시글 작성 중 오류가 발생했습니다.");
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const isValid = handleSubmit(event);
    if (isValid) {
      handleCreatePost();
    }
  };

  return (
    <div className={styles.pageBody}>
      <h3 className={styles.postCreationTitle}>게시글 작성</h3>
      <form
        id="post-form"
        className={styles.formSection}
        onSubmit={handleFormSubmit}
      >
        <FormGroup label="제목*" helperText={errors.title}>
          <input
            type="text"
            id="post-title"
            name="title"
            className={styles.formInput}
            value={values.title}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup label="내용*" helperText={errors.content}>
          <textarea
            id="post-content"
            name="content"
            className={styles.formTextarea}
            cols="30"
            rows="10"
            value={values.content}
            onChange={handleChange}
          ></textarea>
        </FormGroup>
        <p className={styles.helperText} id="create-helper">
          {helperText}
        </p>
        <FormGroup label="이미지" helperText="">
          <input
            type="file"
            id="post-image"
            className={styles.formFileInput}
            onChange={handleFileChange}
          />
        </FormGroup>
        <div className={styles.submitLink}>
          <Button type="submit" disabled={isSubmitting}>
            완료
          </Button>
        </div>
      </form>
    </div>
  );
};

export default withAuth(CreatePostPage);
