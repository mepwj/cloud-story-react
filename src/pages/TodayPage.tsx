import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import api from "../api/axios";
import styles from "./MainPage.module.css";
interface Photo {
  id: number;
  url: string;
  photoOrder: number;
}

interface User {
  id: number;
  email: string;
  nickname: string;
  profilePictureUrl: string;
}

interface Post {
  id: number;
  user: User;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  dislikeCount: number;
  viewCount: number;
  commentCount: number;
  photos: Photo[];
}

interface PostsResponse {
  posts: Post[];
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}달 전`;
  } else {
    return `${diffInYears}년 전`;
  }
};

interface ModalProps {
  imageUrl: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Full size" className={styles.modalImage} />
      </div>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

const PhotoSlider = ({ photos }: { photos: Photo[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const nextPhoto = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };
  const openModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
  };

  const closeModal = () => {
    setModalImageUrl(null);
  };
  return (
    <div className={styles.photoSlider}>
      <div
        className={styles.photoSliderInner}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={`${process.env.REACT_APP_API_URL}/files${photo.url}`}
            alt={`Post photo ${photo.photoOrder}`}
            className={styles.postPhoto}
            onClick={() =>
              openModal(`${process.env.REACT_APP_API_URL}/files${photo.url}`)
            }
          />
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <button
            className={`${styles.sliderButton} ${styles.prevButton}`}
            onClick={prevPhoto}
          >
            &#10094;
          </button>
          <button
            className={`${styles.sliderButton} ${styles.nextButton}`}
            onClick={nextPhoto}
          >
            &#10095;
          </button>
          <div className={styles.photoIndicator}>
            {photos.map((_, index) => (
              <div
                key={index}
                className={`${styles.indicatorDot} ${
                  index === currentIndex ? styles.active : ""
                }`}
              />
            ))}
          </div>
        </>
      )}
      {modalImageUrl && <Modal imageUrl={modalImageUrl} onClose={closeModal} />}
    </div>
  );
};

const TodayPage: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const fetchPosts = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<PostsResponse>(`/posts/popular/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPosts(response.data.posts.slice(0, 5)); // 상위 5개 게시글만 사용
      } else {
        setError("데이터를 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPosts = () => {
    return posts.map((post) => (
      <div key={post.id} className={styles.postCard}>
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
    ));
  };

  return (
    <div className={styles.mainContainer}>
      {isLoading && <p className={styles.loadingText}>로딩 중...</p>}
      {error && <p className={styles.errorText}>Error: {error}</p>}
      <div className={styles.postList}>{renderPosts()}</div>
    </div>
  );
};

export default TodayPage;
