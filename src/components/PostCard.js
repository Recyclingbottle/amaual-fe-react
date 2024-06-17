// src/components/PostCard.js
import React from "react";
import styles from "./PostCard.module.css";

const PostCard = ({ post, onClick }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

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
    <div className={styles.postCard} onClick={onClick}>
      <h3 className={styles.postTitle}>{post.title}</h3>
      <div className={styles.postMeta}>
        <span className={styles.likes}>좋아요 {formatCount(post.likes)}</span>
        <span className={styles.comments}>
          댓글 {formatCount(post.commentsCount)}
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
  );
};

export default PostCard;
