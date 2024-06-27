import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import api from "../api/axios";
import styles from "./TodayPage.module.css";
import PostCard from "../components/PostCard";
import { Post } from "../types";
import PostCreator from "../components/PostCreator";

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) {
    return "방금 전";
  } else if (diffInMinutes < 60) {
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
      const response = await api.get(`/posts/popular/today`, {
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

  const handleRefresh = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  const renderPosts = () => {
    return posts.map((post) => (
      <PostCard
        key={post.id}
        post={post}
        formatTimeAgo={formatTimeAgo}
        refreshPosts={handleRefresh} // 이 줄을 추가합니다
      />
    ));
  };

  return (
    <div className={styles.mainContainer}>
      <PostCreator />
      {isLoading && <p className={styles.loadingText}>로딩 중...</p>}
      {error && <p className={styles.errorText}>Error: {error}</p>}
      <div className={styles.refreshButtonContainer}>
        <button onClick={handleRefresh} className={styles.refreshButton}>
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
      <div className={styles.postList}>{renderPosts()}</div>
    </div>
  );
};

export default TodayPage;
