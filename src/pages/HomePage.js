import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const user = useSelector((state) => state.user);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  const handleCreatePostClick = () => {
    navigate("/create-post");
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/posts`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("게시글을 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const renderPosts = () => {
    return posts.map((post) => (
      <div
        key={post.id}
        className={styles.postCard}
        onClick={() => handlePostClick(post.id)}
      >
        <h3 className={styles.postTitle}>{post.title}</h3>
        <div className={styles.postMeta}>
          <span className={styles.likes}>좋아요 {formatCount(post.likes)}</span>
          <span className={styles.comments}>
            댓글수 {formatCount(post.commentsCount)}
          </span>
          <span className={styles.views}>조회수 {formatCount(post.views)}</span>
          <time className={styles.postDate}>{formatDate(post.date)}</time>
        </div>
        <div className={styles.authorInfo}>
          <img
            src={`${apiUrl}/images/profile/${post.author_profile_image}`}
            alt={`${post.author_nickname}의 프로필 이미지`}
            className={styles.authorProfilePicture}
          />
          <span className={styles.authorName}>{post.author_nickname}</span>
        </div>
      </div>
    ));
  };

  const formatCount = (count) => {
    if (count >= 100000) {
      return `${(count / 1000).toFixed(0)}k`;
    } else if (count >= 10000) {
      return `${(count / 1000).toFixed(0)}k`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.welcomeMessage}>
          <p>
            안녕하세요,
            <br />
            아무 말 대잔치 <span>게시판</span>입니다.
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

export default HomePage;
