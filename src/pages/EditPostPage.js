import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EditPostPage.module.css";
import FormGroup from "../components/FormGroup";
import Button from "../components/Button";
import useFormValidation from "../hooks/useFormValidation";
import validatePost from "../utils/validatePost";
import withAuth from "../hocs/withAuth";

const EditPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [existingImage, setExistingImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [helperText, setHelperText] = useState("");

  const {
    handleChange,
    handleSubmit,
    values,
    setValues,
    errors,
    isSubmitting,
  } = useFormValidation({ title: "", content: "" }, validatePost);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${apiUrl}/posts/${postId}`, {
          withCredentials: true,
        });
        const post = response.data;
        console.log(post);
        setValues({ title: post.title, content: post.content });
        setExistingImage(`${apiUrl}/images/posts/${post.image}`);
      } catch (error) {
        console.error("Failed to fetch post", error);
        setHelperText("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPost();
  }, [postId, apiUrl, setValues]);

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

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      return;
    }

    let uploadedImageName = existingImage.split("/").pop(); // 기존 이미지 이름 추출

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
      const response = await axios.patch(
        `${apiUrl}/posts/${postId}`,
        postPayload,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
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
        </FormGroup>
        <div className={styles.submitLink}>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={handleUpdatePost}
          >
            완료
          </Button>
        </div>
      </form>
    </div>
  );
};

export default withAuth(EditPostPage);
