import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "./EditPostPage.module.css";

const EditPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [helperText, setHelperText] =
    useState("*제목, 내용을 모두 작성해주세요");

  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${apiUrl}/posts/${postId}`, {
          withCredentials: true,
        });
        const post = response.data;
        setTitle(post.title);
        setContent(post.content);
        setExistingImage(`${apiUrl}/images/posts/${post.image}`);
      } catch (error) {
        console.error("Failed to fetch post", error);
        setHelperText("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPost();
  }, [postId, apiUrl]);

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
    const file = e.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setExistingImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImageName = existingImage;

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
        console.log(uploadResponse);
        if (uploadResponse.data.message === "File uploaded successfully") {
          uploadedImageName = uploadResponse.data.filename;
          console.log(uploadedImageName);
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
      uploadedImageName,
    };

    try {
      const response = await axios.patch(
        `${apiUrl}/posts/${postId}`,
        postPayload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        navigate(`/posts/${postId}`);
      } else {
        setHelperText("게시글 수정에 실패했습니다.");
      }
    } catch (error) {
      setHelperText("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.pageBody}>
      <h3 className={styles.postCreationTitle}>게시글 수정</h3>
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
          {existingImage && (
            <div className={styles.existingImageContainer}>
              <img
                src={existingImage}
                alt="게시글 이미지"
                className={styles.existingImage}
              />
            </div>
          )}
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

export default EditPostPage;
