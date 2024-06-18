import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format, parseISO } from "date-fns";
import styles from "./PostDetailPage.module.css";
import Modal from "../components/Modal";
import Button from "../components/Button";
import withAuth from "../hocs/withAuth";

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await axios.get(`${apiUrl}/posts/${postId}`, {
          withCredentials: true,
        });
        setPost(postResponse.data);

        await fetchComments();
      } catch (error) {
        console.error("Failed to fetch post or comments", error);
      }
    };

    fetchPost();
  }, [postId, apiUrl]);

  const fetchComments = async () => {
    try {
      const commentsResponse = await axios.get(
        `${apiUrl}/posts/${postId}/comments`,
        {
          withCredentials: true,
        }
      );
      setComments(commentsResponse.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid date";
    const date = parseISO(dateString);
    return format(date, "yyyy-MM-dd HH:mm");
  };

  const gotoEditPost = () => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDelete = () => {
    setIsModalOpen(true);
    setCommentToDelete(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCommentToDelete(null);
  };

  const handleConfirm = async () => {
    try {
      if (commentToDelete) {
        await axios.delete(
          `${apiUrl}/posts/${postId}/comments/${commentToDelete}`,
          {
            withCredentials: true,
          }
        );
        setCommentToDelete(null);
        setIsModalOpen(false);
        await fetchComments();
      } else {
        await axios.delete(`${apiUrl}/posts/${postId}`, {
          withCredentials: true,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to delete post or comment", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    if (isEditing) {
      try {
        const response = await axios.patch(
          `${apiUrl}/posts/${postId}/comments/${editingCommentId}`,
          { content: commentText },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setCommentText("");
          setIsEditing(false);
          setEditingCommentId(null);
          fetchComments();
        }
      } catch (error) {
        console.error("Failed to update comment", error);
      }
    } else {
      try {
        const response = await axios.post(
          `${apiUrl}/posts/${postId}/comments`,
          { content: commentText },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          setCommentText("");
          fetchComments();
        }
      } catch (error) {
        console.error("Failed to submit comment", error);
      }
    }
  };

  const handleCommentDeleteClick = (commentId) => {
    setIsModalOpen(true);
    setCommentToDelete(commentId);
  };

  const handleEditComment = (comment) => {
    setIsEditing(true);
    setCommentText(comment.content);
    setEditingCommentId(comment.id);
  };

  return (
    <>
      <div className={styles.contentContainer}>
        {post && (
          <>
            <div className={styles.titleContainer}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <div className={styles.postAuthor}>
                <img
                  className={styles.profilePicture}
                  src={`${apiUrl}/images/profile/${post.author_profile_image}`}
                ></img>
                <p className={styles.authorName}>{post.author_nickname}</p>
                <span className={styles.postDate}>
                  {formatDate(post.created_at)}
                </span>
                <div className={styles.postBtnContainer}>
                  <button className={styles.editPostBtn} onClick={gotoEditPost}>
                    수정
                  </button>
                  <button
                    className={styles.deletePostBtn}
                    onClick={handleDelete}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.postContent}>
              <div className={styles.imgBox}>
                {post.image && (
                  <img
                    className={styles.postImage}
                    src={`${apiUrl}/images/posts/${post.image}`}
                    alt="Post"
                  />
                )}
              </div>
              <p
                className={styles.postText}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <div className={styles.postInteraction}>
                <button className={styles.viewCountBtn}>
                  {post.view_count} <br />
                  조회수
                </button>
                <button className={styles.commentCountBtn}>
                  {post.comment_count} <br />
                  댓글
                </button>
              </div>
            </div>
            <div className={styles.postComments}>
              <textarea
                placeholder="댓글을 남겨주세요!"
                className={styles.commentTextarea}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <div className={styles.commentsRegisterButtonContainer}>
                <button
                  className={styles.commentsRegisterButton}
                  onClick={handleCommentSubmit}
                >
                  {isEditing ? "수정하기" : "댓글 등록"}
                </button>
              </div>
            </div>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.commentContainer}>
                <img
                  src={`${apiUrl}/images/profile/${comment.author_profile_image}`}
                  alt="댓글 작성자 프로필 사진"
                  className={styles.commentProfilePicture}
                />
                <div className={styles.commentContent}>
                  <div className={styles.commentTopRow}>
                    <span className={styles.commentAuthorName}>
                      {comment.author_nickname}
                    </span>
                    <span className={styles.commentDate}>
                      {formatDate(comment.created_at)}
                    </span>
                    <div className={styles.commentBtnContainer}>
                      <button
                        className={styles.editCommentBtn}
                        data-comment-id={comment.id}
                        onClick={() => handleEditComment(comment)}
                      >
                        수정
                      </button>
                      <button
                        className={styles.deleteCommentBtn}
                        data-comment-id={comment.id}
                        onClick={() => handleCommentDeleteClick(comment.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <div className={styles.commentBody}>
                    <p>{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        title="삭제 확인"
        content="정말로 삭제하시겠습니까?"
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default withAuth(PostDetailPage);
