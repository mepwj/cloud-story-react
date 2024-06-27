import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PhotoSlider from "./PhotoSlider";
import usePostDetail from "./usePostDetail";
import {
  fetchComments,
  addComment,
  updateComment,
  deleteComment,
  likePost,
  dislikePost,
  unlikePost,
  undislikePost,
  fetchPostDetail,
} from "../api/api";
import { Comment } from "../types";
import styles from "./PostModal.module.css";
import { RootState } from "../store";
import axios from "axios";

interface PostModalProps {
  postId: number;
  formatTimeAgo: (dateString: string) => string;
  onClose: () => void;
}
const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const textarea = e.target;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
};
const PostModal: React.FC<PostModalProps> = ({
  postId,
  formatTimeAgo,
  onClose,
}) => {
  const { post: initialPost, loading, error } = usePostDetail(postId);
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { token, userId } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (post && token) {
      loadComments();
    }
  }, [post, page, token]);
  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  const loadComments = async () => {
    if (typeof token === "string") {
      try {
        const result = await fetchComments(postId, 1, 10, token);
        setComments(result.comments);
        setHasMore(result.hasMore);
        setPage(1);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Failed to load comments:", error.response?.data);
        } else {
          console.error("Failed to load comments:", error);
        }
      }
    } else {
      console.error("No token available");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof token === "string" && newComment.trim() !== "") {
      try {
        await addComment(postId, newComment, token);
        setNewComment("");
        await loadComments();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Failed to add comment:", error.response?.data);
        } else {
          console.error("Failed to add comment:", error);
        }
      }
    } else {
      console.error("No token available or empty comment");
    }
  };

  const handleCommentEdit = async (commentId: number, content: string) => {
    if (typeof token === "string") {
      try {
        await updateComment(postId, commentId, content, token);
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? { ...comment, content } : comment
          )
        );
        setEditingCommentId(null);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Failed to update comment:", error.response?.data);
        } else {
          console.error("Failed to update comment:", error);
        }
      }
    } else {
      console.error("No token available");
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (typeof token === "string") {
      try {
        await deleteComment(postId, commentId, token);
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Failed to delete comment:", error.response?.data);
        } else {
          console.error("Failed to delete comment:", error);
        }
      }
    } else {
      console.error("No token available");
    }
  };

  const handleLike = async () => {
    if (typeof token === "string") {
      try {
        await likePost(postId, token);
        await loadPost(); // 좋아요 후에 게시글을 다시 로드하여 최신 상태로 업데이트
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 409) {
            await unlikePost(postId, token);
            await loadPost(); // 좋아요 취소 후에 게시글을 다시 로드하여 최신 상태로 업데이트
          } else {
            console.error("Failed to like/unlike post:", error.response?.data);
          }
        } else {
          console.error("Failed to like/unlike post:", error);
        }
      }
    } else {
      console.error("No token available");
    }
  };

  const handleDislike = async () => {
    if (typeof token === "string") {
      try {
        await dislikePost(postId, token);
        await loadPost(); // 싫어요 후에 게시글을 다시 로드하여 최신 상태로 업데이트
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 409) {
            await undislikePost(postId, token);
            await loadPost(); // 싫어요 취소 후에 게시글을 다시 로드하여 최신 상태로 업데이트
          } else {
            console.error(
              "Failed to dislike/undislike post:",
              error.response?.data
            );
          }
        } else {
          console.error("Failed to dislike/undislike post:", error);
        }
      }
    } else {
      console.error("No token available");
    }
  };

  const loadPost = async () => {
    if (typeof token === "string") {
      try {
        const updatedPost = await fetchPostDetail(postId, token);
        setPost(updatedPost.post);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Failed to reload post:", error.response?.data);
        } else {
          console.error("Failed to reload post:", error);
        }
      }
    } else {
      console.error("No token available");
    }
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>에러 발생: {error}</div>;
  if (!post)
    return <div className={styles.error}>게시글을 찾을 수 없습니다.</div>;
  if (!token) return <div className={styles.error}>로그인이 필요합니다.</div>;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.postContainer}>
          <div className={styles.photoContainer}>
            {post.photos && post.photos.length > 0 ? (
              <PhotoSlider photos={post.photos} />
            ) : (
              <div className={styles.noImage}>No Image</div>
            )}
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.postHeader}>
              <img
                src={`${process.env.REACT_APP_API_URL}/files${post.user.profilePictureUrl}`}
                alt={`${post.user.nickname}'s profile`}
                className={styles.authorProfileImg}
              />
              <div className={styles.authorInfo}>
                <p className={styles.authorName}>{post.user.nickname}</p>
                <p className={styles.postTime}>
                  {formatTimeAgo(post.createdAt)}
                </p>
              </div>
              <button className={styles.closeButton} onClick={onClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={styles.closeIcon}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.postContent}>
              <p>{post.content}</p>
            </div>
            <div className={styles.postActions}>
              <button className={styles.actionButton} onClick={handleLike}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={styles.actionIcon}
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
                <span>{post.likeCount}</span>
              </button>
              <button className={styles.actionButton} onClick={handleDislike}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={styles.actionIcon}
                >
                  <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.773c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
                </svg>
                <span>{post.dislikeCount}</span>
              </button>
              <div className={styles.viewCount}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={styles.actionIcon}
                >
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path
                    fillRule="evenodd"
                    d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{post.viewCount}</span>
              </div>
            </div>
            <div className={styles.commentsSection}>
              <div className={styles.commentListContainer}>
                <ul className={styles.commentsList}>
                  {comments.map((comment) => (
                    <li key={comment.id} className={styles.commentItem}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/files${comment.user.profilePictureUrl}`}
                        alt={`${comment.user.nickname}'s profile`}
                        className={styles.commentAuthorImg}
                      />
                      <div className={styles.commentContent}>
                        <span className={styles.commentAuthor}>
                          {comment.user?.nickname || "알 수 없는 사용자"}
                        </span>
                        {editingCommentId === comment.id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleCommentEdit(comment.id, editContent);
                            }}
                          >
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className={styles.editCommentInput}
                            />
                            <div className={styles.editCommentActions}>
                              <button
                                type="submit"
                                className={styles.saveCommentButton}
                              >
                                저장
                              </button>
                              <button
                                onClick={() => setEditingCommentId(null)}
                                className={styles.cancelEditButton}
                              >
                                취소
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <p>{comment.content}</p>
                            <div className={styles.commentMeta}>
                              <span className={styles.commentTime}>
                                {comment.createdAt
                                  ? formatTimeAgo(comment.createdAt)
                                  : "날짜 정보 없음"}
                              </span>
                              {comment.user?.id === userId && (
                                <div className={styles.commentActions}>
                                  <button
                                    onClick={() => {
                                      setEditingCommentId(comment.id);
                                      setEditContent(comment.content);
                                    }}
                                    className={styles.editCommentButton}
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleCommentDelete(comment.id)
                                    }
                                    className={styles.deleteCommentButton}
                                  >
                                    삭제
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {hasMore && (
                  <button
                    onClick={() => setPage((prevPage) => prevPage + 1)}
                    className={styles.loadMoreButton}
                  >
                    댓글 더 보기
                  </button>
                )}
              </div>
              <form
                onSubmit={handleCommentSubmit}
                className={styles.commentForm}
              >
                <textarea
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                    adjustTextareaHeight(e);
                  }}
                  placeholder="댓글을 작성하세요..."
                  className={styles.commentInput}
                />
                <button type="submit" className={styles.commentSubmit}>
                  게시
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
