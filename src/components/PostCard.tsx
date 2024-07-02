import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import PhotoSlider from "./PhotoSlider";
import PostModal from "./PostModal";
import EditPostModal from "./EditPostModal";
import { Post } from "../types";
import styles from "./PostCard.module.css";
import Icon from "./Icon";
import axios from "../api/axios";
import API_URL from "../api/api";

interface PostCardProps {
  post: Post;
  formatTimeAgo: (dateString: string) => string;
  refreshPosts: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  formatTimeAgo,
  refreshPosts,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { userId, token } = useSelector((state: RootState) => state.auth);

  const handlePostClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleMoreClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = () => {
    if (userId !== post.user.id) {
      alert("글 수정 권한이 없습니다.");
      return;
    }
    setIsEditModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleDelete = async () => {
    if (userId !== post.user.id) {
      alert("글 삭제 권한이 없습니다.");
      return;
    }

    const confirmDelete = window.confirm(
      "게시글을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/posts/${post.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        alert("게시글이 삭제되었습니다.");
        refreshPosts();
      } else {
        alert("게시글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("게시글 삭제에 실패했습니다.");
    }

    setIsMenuOpen(false);
  };

  return (
    <>
      <div className={styles.postCard}>
        <div className={styles.postHeader}>
          <img
            src={`${API_URL}/files${post.user.profilePictureUrl}`}
            alt={`${post.user.nickname}'s profile`}
            className={styles.authorProfileImg}
          />
          <div className={styles.authorInfo}>
            <p className={styles.authorName}>{post.user.nickname}</p>
            <p className={styles.postTime}>{formatTimeAgo(post.createdAt)}</p>
          </div>
          <button className={styles.moreButton} onClick={handleMoreClick}>
            ⋯
          </button>
          {isMenuOpen && (
            <div className={styles.moreMenu}>
              <button onClick={handleEdit}>수정</button>
              <button onClick={handleDelete}>삭제</button>
            </div>
          )}
        </div>
        <div>
          <p onClick={handlePostClick} className={styles.postContent}>
            {post.content}
          </p>
          {post.photos.length > 0 && <PhotoSlider photos={post.photos} />}
        </div>
        <div className={styles.postMeta}>
          <div className={styles.metaItem}>
            <Icon name="like" className={styles.metaIcon} />
            <span className={styles.metaCount}>{post.likeCount}</span>
          </div>
          <div className={styles.metaItem}>
            <Icon name="dislike" className={styles.metaIcon} />
            <span className={styles.metaCount}>{post.dislikeCount}</span>
          </div>
          <div className={styles.metaItem}>
            <Icon name="view" className={styles.metaIcon} />
            <span className={styles.metaCount}>{post.viewCount}</span>
          </div>
          <div className={styles.metaItem}>
            <Icon name="comment" className={styles.metaIcon} />
            <span className={styles.metaCount}>{post.commentCount}</span>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <PostModal
          postId={post.id}
          formatTimeAgo={formatTimeAgo}
          onClose={handleCloseModal}
        />
      )}
      {isEditModalOpen && (
        <EditPostModal
          post={post}
          onClose={() => setIsEditModalOpen(false)}
          refreshPosts={refreshPosts}
        />
      )}
    </>
  );
};

export default PostCard;
