import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format, parseISO } from "date-fns";
import styles from "./PostDetailPage.module.css";

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isRegistering, setIsRegistering] = useState(true);
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
        await fetchComments();
        setCommentToDelete(null);
      } else {
        await axios.delete(`${apiUrl}/posts/${postId}`, {
          withCredentials: true,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      if (isRegistering) {
        const response = await axios.post(
          `${apiUrl}/posts/${postId}/comments`,
          {
            content: commentText,
          },
          { withCredentials: true }
        );
        if (response.status === 201) {
          await fetchComments();
          setCommentText("");
        } else {
          throw new Error("Failed to add comment");
        }
      } else {
        const response = await axios.patch(
          `${apiUrl}/posts/${postId}/comments/${commentToDelete}`,
          {
            content: commentText,
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          await fetchComments();
          setCommentText("");
          setIsRegistering(true);
          setCommentToDelete(null);
        } else {
          throw new Error("Failed to edit comment");
        }
      }
    } catch (error) {
      console.error("Failed to submit comment", error);
    }
  };

  const handleEditComment = (comment) => {
    setCommentText(comment.content);
    setIsRegistering(false);
    setCommentToDelete(comment.id);
  };

  const handleCommentDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setIsModalOpen(true);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className={styles.contentContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <div className={styles.postAuthor}>
          <img
            className={styles.postProfilePic}
            src={`${apiUrl}/images/profile/${post.author_profile_image}`}
            alt="프로필 이미지"
          />
          <p className={styles.authorName}>{post.author_nickname}</p>
          <span className={styles.postDate}>{formatDate(post.created_at)}</span>
          <div className={styles.postBtnContainer}>
            <button className={styles.editPostBtn} onClick={gotoEditPost}>
              수정
            </button>
            <button className={styles.deletePostBtn} onClick={handleDelete}>
              삭제
            </button>
            {isModalOpen && (
              <div className={styles.modal} style={{ display: "block" }}>
                <div className={styles.modalContent}>
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                      {commentToDelete
                        ? "댓글을 삭제하시겠습니까?"
                        : "게시글을 삭제하시겠습니까?"}
                    </h2>
                  </div>
                  <div className={styles.modalBody}>
                    <p className={styles.modalText}>
                      삭제한 {commentToDelete ? "댓글" : "게시글"}은 다시 복구
                      할 수 없습니다.
                    </p>
                  </div>
                  <div className={styles.modalFooter}>
                    <button
                      className={`${styles.btn} ${styles.cancel}`}
                      onClick={handleCancel}
                    >
                      취소
                    </button>
                    <button
                      className={`${styles.btn} ${styles.confirm}`}
                      onClick={handleConfirm}
                    >
                      확인
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.postContent}>
        <div className={styles.imgBox}>
          {post.image && (
            <img
              className={styles.postImage}
              src={`${apiUrl}/images/posts/${post.image}`}
              alt="게시글 이미지"
            />
          )}
        </div>
        <p
          className={styles.postText}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className={styles.postInteraction}>
          <button className={styles.viewCountBtn}>
            {post.view_count}
            <br />
            조회수
          </button>
          <button className={styles.commentCountBtn}>
            {post.comment_count}
            <br />
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
            {isRegistering ? "댓글 등록" : "수정하기"}
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
    </div>
  );
};

export default PostDetailPage;
