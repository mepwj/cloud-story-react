import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import api from "../api/axios";
import styles from "./MainPage.module.css";
import PostCreator from "../components/PostCreator";
import PostCard from "../components/PostCard"; // 분리된 PostCard 컴포넌트를 불러옴
import { Post } from "../types"; // Post 인터페이스를 불러옴

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

// Create a context for refreshing posts
export const PostsRefreshContext = createContext<() => void>(() => {});

const MainPage: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  const limit = 10;
  const sort = "createdAt";
  const direction = "DESC";

  useEffect(() => {
    fetchPosts();
  }, [currentPage, token]);
  const handleRefresh = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<PostsResponse>(`/posts`, {
        params: {
          page: 1,
          limit: limit,
          sort: sort,
          direction: direction,
          lastUpdateTime: lastUpdateTime,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        if (response.data.posts.length > 0) {
          setPosts((prevPosts) => [...response.data.posts, ...prevPosts]);
          setLastUpdateTime(Date.now());
        }
      } else {
        setError("데이터를 새로고침하는데 실패했습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      setError("데이터를 새로고침하는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<PostsResponse>(`/posts`, {
        params: {
          page: currentPage,
          limit: limit,
          sort: sort,
          direction: direction,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPosts(response.data.posts);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
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

  const refreshPosts = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);  

  const renderPosts = () => {
    return posts.map((post) => (
      <PostCard
        key={post.id}
        post={post}
        formatTimeAgo={formatTimeAgo}
        refreshPosts={refreshPosts} // 이 줄을 추가합니다
      />
    ));
  };

  return (
    <PostsRefreshContext.Provider value={refreshPosts}>
      <div className={styles.mainContainer}>
        {isLoading && <p className={styles.loadingText}>로딩 중...</p>}
        {error && <p className={styles.errorText}>Error: {error}</p>}
        <PostCreator />
        <div className={styles.refreshButtonContainer}>
          <button onClick={handleRefresh} className={styles.refreshButton}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
        <div className={styles.postList}>{renderPosts()}</div>
        <div className={styles.paginationContainer}>
          <button
            className={styles.paginationButton}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            이전 페이지
          </button>
          <p className={styles.paginationInfo}>
            페이지 {currentPage} / {totalPages}
          </p>
          <button
            className={styles.paginationButton}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            다음 페이지
          </button>
        </div>
      </div>
    </PostsRefreshContext.Provider>
  );
};

export default MainPage;
