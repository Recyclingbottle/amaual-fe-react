// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./HomePage.module.css";
import Button from "../components/Button";
import PostCard from "../components/PostCard";
import withAuth from "../hocs/withAuth";
import withLoading from "../hocs/withLoading";

const HomePage = ({ data: posts }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleCreatePostClick = () => {
    navigate("/create-post");
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const renderPosts = () => {
    return posts.map((post) => (
      <PostCard
        key={post.id}
        post={post}
        onClick={() => handlePostClick(post.id)}
      />
    ));
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.welcomeMessage}>
          <p className={styles.welcomeMessage}>
            안녕하세요,
            <br />
            아무 말 대잔치{" "}
            <span className={styles.welcomeMessageSpan}>게시판</span>입니다.
          </p>
        </div>
        <div className={styles.postsContainer}>
          <div className={styles.buttonRightAlign}>
            <button
              className={styles.postCreateBtn}
              onClick={handleCreatePostClick}
            >
              게시글 작성
            </button>
          </div>
          <div className={styles.postsContainer}>{renderPosts()}</div>
        </div>
      </div>
    </div>
  );
};

const fetchPosts = async () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const response = await axios.get(`${apiUrl}/posts`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export default withAuth(withLoading(HomePage, fetchPosts));
