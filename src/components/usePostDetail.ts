import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Post } from '../types';

import { fetchPostDetail } from '../api/api';

const usePostDetail = (postId: number) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success && response.data.post) {
          setPost(response.data.post);
        } else {
          setError('게시글 데이터를 찾을 수 없습니다.');
        }
        setLoading(false);
      } catch (err) {
        console.error('API error:', err);
        setError('게시글을 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    if (token) {
      fetchPostDetail();
    } else {
      setError('인증 토큰이 없습니다.');
      setLoading(false);
    }
  }, [postId, token]);

  return { post, loading, error, setPost, setLoading, setError };
};

export default usePostDetail;