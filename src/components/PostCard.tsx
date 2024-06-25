import React from "react";
import PhotoSlider from "./PhotoSlider";
import { Post } from "../types"; // Post 인터페이스를 별도의 파일로 분리하는 것이 좋습니다.
import styles from "./PostCard.module.css"; // 필요한 스타일을 새 CSS 모듈 파일로 분리

interface PostCardProps {
  post: Post;
  formatTimeAgo: (dateString: string) => string;
}

const PostCard: React.FC<PostCardProps> = ({ post, formatTimeAgo }) => {
  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <img
          src={`${process.env.REACT_APP_API_URL}/files${post.user.profilePictureUrl}`}
          alt={`${post.user.nickname}'s profile`}
          className={styles.authorProfileImg}
        />
        <div className={styles.authorInfo}>
          <p className={styles.authorName}>{post.user.nickname}</p>
          <p className={styles.postTime}>{formatTimeAgo(post.createdAt)}</p>
        </div>
        <button className={styles.moreButton}>⋯</button>
      </div>
      {post.title && <p className={styles.postContent}>{post.title}</p>}
      <p className={styles.postContent}>{post.content}</p>
      {post.photos.length > 0 && <PhotoSlider photos={post.photos} />}
      <div className={styles.postMeta}>
        👍 {post.likeCount} 👎 {post.dislikeCount} 👁 {post.viewCount} 💬{" "}
        {post.commentCount}
      </div>
    </div>
  );
};

export default PostCard;
