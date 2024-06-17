import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./CreatePostPage.module.css";
import axios from "axios";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [helperText, setHelperText] =
    useState("*제목, 내용을 모두 작성해주세요");
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (title && content) {
      setIsFormValid(true);
      setHelperText("");
    } else {
      setIsFormValid(false);
    }
  }, [title, content]);

  const handleTitleChange = (e) => {
    if (e.target.value.length <= 26) {
      setTitle(e.target.value);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
            headers: {
              "Content-Type": "multipart/form-data",
            },
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
      title,
      content,
      post_image: uploadedImageName,
      author: {
        email: user.email,
        nickname: user.nickname,
        profile_image: user.profileImage,
      },
    };

    try {
      const response = await axios.post(`${apiUrl}/posts`, postPayload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
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

  return (
    <div className={styles.pageBody}>
      <h3 className={styles.postCreationTitle}>게시글 작성</h3>
      <form
        id="post-form"
        className={styles.formSection}
        onSubmit={handleSubmit}
      >
        <div className={styles.formGroup}>
          <label htmlFor="post-title" className={styles.formLabel}>
            제목*
          </label>
          <input
            type="text"
            id="post-title"
            className={styles.formInput}
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="post-content" className={styles.formLabel}>
            내용*
          </label>
          <textarea
            id="post-content"
            className={styles.formTextarea}
            cols="30"
            rows="10"
            value={content}
            onChange={handleContentChange}
          ></textarea>
        </div>
        <p className={styles.helperText} id="create-helper">
          {helperText}
        </p>
        <div className={styles.formGroup} style={{ marginTop: "5px" }}>
          <label htmlFor="post-image" className={styles.formLabel}>
            이미지
          </label>
          <input
            type="file"
            id="post-image"
            className={styles.formFileInput}
            onChange={handleFileChange}
          />
        </div>
        <div className={styles.submitLink}>
          <button
            type="submit"
            className={styles.submitButton}
            style={{ backgroundColor: isFormValid ? "#7F6AEE" : "#ACAOEB" }}
            disabled={!isFormValid}
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
