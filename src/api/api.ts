import axios from 'axios';

const API_URL = "/api";

export const fetchComments = async (postId: number, page: number, limit: number, token: string) => {
  const response = await axios.get(`${API_URL}/posts/${postId}/comments?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addComment = async (postId: number, content: string, token: string) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { content }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateComment = async (postId: number, commentId: number, content: string, token: string) => {
  const response = await axios.put(`${API_URL}/posts/${postId}/comments/${commentId}`, { content }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteComment = async (postId: number, commentId: number, token: string) => {
  await axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const likePost = async (postId: number, token: string) => {
  await axios.post(`${API_URL}/posts/${postId}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const dislikePost = async  (postId: number, token: string) => {
  await axios.post(`${API_URL}/posts/${postId}/dislike`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const unlikePost = async  (postId: number, token: string) => {
  await axios.delete(`${API_URL}/posts/${postId}/like`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const undislikePost = async  (postId: number, token: string) => {
  await axios.delete(`${API_URL}/posts/${postId}/dislike`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchPostDetail = async (postId: number, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch post details: ${error.response?.data}`);
    } else {
      throw new Error('Failed to fetch post details');
    }
  }
};