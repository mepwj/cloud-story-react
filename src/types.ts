export interface Photo {
  id: number;
  url: string;
  photoOrder: number;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  profilePictureUrl: string;
}

export interface Post {
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

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    nickname: string;
    profilePictureUrl: string;
  };
}
