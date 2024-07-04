# ☁️ 커뮤니티 사이트, 뜬 구름 프론트엔드

- **프로젝트 배포 링크:**
- AWS 의 EC2 로 배포하였습니다.
- [[링크]](http://ec2-3-38-152-113.ap-northeast-2.compute.amazonaws.com/)
- 가입 하기 귀찮다면, 
   아이디 : test@test.com
   비밀번호 : asdf1234!
  로 로그인 하시면 됩니다.
- 도메인 미정

## 프로젝트 소개

- **프로젝트 명:** 뜬 구름
- **프로젝트 목적:** 커뮤니티 사이트
- **개발 기간:** 2024-06-03 ~ 2024-06-27
- **개발 인원:** 1명 (프론트엔드/백엔드 모두 담당)
- **백엔드**: [Repo 링크](https://github.com/Recyclingbottle/cloud-story-be)
- **사용 언어:** TypeScript, React

### 프로젝트 개요

"뜬 구름"은 사용자들이 서로 소통하고 정보를 공유할 수 있는 커뮤니티 사이트입니다. React와 TypeScript를 사용하여 프론트엔드를 구현하였으며, Redux를 통해 상태 관리를 효과적으로 수행하였습니다.

## 기술 스택 및 도구

- **프론트엔드:** React, TypeScript
- **상태 관리:** Redux Toolkit
- **HTTP 클라이언트:** Axios
- **스타일링:** CSS Modules

## 주요 기능

- 사용자 인증 (로그인/회원가입)
- 게시물 작성, 수정, 삭제
- 댓글 작성, 수정, 삭제
- 사용자 프로필 관리
- 사진 슬라이더 및 모달

## 프로젝트 구조

프로젝트의 파일 및 디렉토리 구조는 다음과 같습니다:

```
cloud-story-react/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── App.tsx
│   ├── global.d.ts
│   ├── index.css
│   ├── index.tsx
│   ├── types.ts
│   ├── api/
│   │   ├── api.ts
│   │   └── axios.ts
│   ├── assets/
│   │   ├── cloud-story-logo.png
│   │   └── default-profile.png
│   ├── components/
│   │   ├── EditPostModal.module.css
│   │   ├── EditPostModal.tsx
│   │   ├── Icon.tsx
│   │   ├── ImageModal.module.css
│   │   ├── ImageModal.tsx
│   │   ├── Navbar.module.css
│   │   ├── Navbar.tsx
│   │   ├── PhotoSlider.module.css
│   │   ├── PhotoSlider.tsx
│   │   ├── PostCard.module.css
│   │   ├── PostCard.tsx
│   │   ├── PostCreator.module.css
│   │   ├── PostCreator.tsx
│   │   ├── PostModal.module.css
│   │   ├── PostModal.tsx
│   │   ├── PrivateRoute.tsx
│   │   ├── usePostDetail.ts
│   │   ├── SignUp/
│   │   │   ├── Step1/
│   │   │   │   ├── index.ts
│   │   │   │   └── Step1.tsx
│   │   │   ├── Step2/
│   │   │   │   ├── index.ts
│   │   │   │   └── Step2.tsx
│   │   │   ├── Step3/
│   │   │   │   ├── index.ts
│   │   │   │   └── Step3.tsx
│   │   │   ├── Step4/
│   │   │   │   ├── index.ts
│   │   │   │   └── Step4.tsx
│   ├── features/
│   │   └── auth/
│   │       └── authSlice.ts
│   ├── pages/
│   │   ├── CreateAccountPage.module.css
│   │   ├── CreateAccountPage.tsx
│   │   ├── LoginPage.module.css
│   │   ├── LoginPage.tsx
│   │   ├── MainPage.module.css
│   │   ├── MainPage.tsx
│   │   ├── ProfilePage.module.css
│   │   ├── ProfilePage.tsx
│   │   ├── TodayPage.module.css
│   │   ├── TodayPage.tsx
│   │   ├── WeekPage.tsx
│   └── store/
│       └── index.ts
```

### 주요 파일 및 코드 설명

1. **App.tsx**

   - 프로젝트의 메인 컴포넌트로, 라우팅 및 전역 설정을 담당합니다.
   - `React Router`를 사용하여 페이지 간의 라우팅을 설정하고, `PrivateRoute` 컴포넌트를 사용하여 인증된 사용자만 접근할 수 있는 경로를 보호합니다.

   ```typescript
   import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
   import PrivateRoute from './components/PrivateRoute';
   import MainPage from './pages/MainPage';
   import LoginPage from './pages/LoginPage';

   function App() {
       return (
           <Router>
               <Switch>
                   <Route path="/login" component={LoginPage} />
                   <PrivateRoute path="/" component={MainPage} />
               </Switch>
           </Router>
       );
   }

   export default App;
   ```

2. **authSlice.ts**

   - `Redux Toolkit`을 사용하여 사용자 인증 상태를 관리합니다.
   - `createSlice`를 통해 간단하게 상태와 액션을 정의할 수 있습니다.

   ```typescript
   import { createSlice, PayloadAction } from '@reduxjs/toolkit';

   interface AuthState {
       user: string | null;
       token: string | null;
   }

   const initialState: AuthState = {
       user: null,
       token: null,
   };

   const authSlice = createSlice({
       name: 'auth',
       initialState,
       reducers: {
           login: (state, action: PayloadAction<{ user: string; token: string }>) => {
               state.user = action.payload.user;
               state.token = action.payload.token;
           },
           logout: (state) => {
               state.user = null;
               state.token = null;
           },
       },
   });

   export const { login, logout } = authSlice.actions;
   export default authSlice.reducer;
   ```

3. **api.ts 및 axios.ts**

   - 서버와의 HTTP 통신을 위한 API 설정이 포함되어 있습니다.
   - `axios` 인스턴스를 생성하고, 필요한 인터셉터를 설정하여 요청과 응답을 처리합니다.

   ```typescript
   // src/api/axios.ts
   import axios from 'axios';

   const axiosInstance = axios.create({
       baseURL: 'https://api.example.com',
       timeout: 1000,
   });

   axiosInstance.interceptors.request.use(
       (config) => {
           // Do something before request is sent
           return config;
       },
       (error) => {
           // Do something with request error
           return Promise.reject(error);
       }
   );

   axiosInstance.interceptors.response.use(
       (response) => {
           // Do something with response data
           return response;
       },
       (error) => {
           // Do something with response error
           return Promise.reject(error);
       }
   );

   export default axiosInstance;
   ```

   ```typescript
   // src/api/api.ts
   import axiosInstance from './axios';

   export const fetchPosts = async () => {
       try {
           const response = await axiosInstance.get('/posts');
           return response.data;
       } catch (error) {
           throw error;
       }
   };

   export const createPost = async (post: any) => {
       try {
           const response = await axiosInstance.post('/posts', post);
           return response.data;
       } catch (error) {
           throw error;
       }
   };
   ```
   
4. **index.tsx**
   - 프로젝트의 진입점 파일로, ReactDOM을 사용하여 React 컴포넌트를 렌더링합니다.
   - `StrictMode`와 `Provider`를 사용하여 전체 애플리케이션에 Redux 스토어를 적용합니다.

   ```typescript
   import React from 'react';
   import ReactDOM from 'react-dom';
   import './index.css';
   import App from './App';
   import { Provider } from 'react-redux';
   import store from './store';

   ReactDOM.render(
     <React.StrictMode>
       <Provider store={store}>
         <App />
       </Provider>
     </React.StrictMode>,
     document.getElementById('root')
   );
   ```

5. **types.ts**
   - 프로젝트에서 사용되는 타입 정의 파일로, TypeScript의 강력한 타입 시스템을 활용하여 코드의 안전성을 높입니다.
   - 예를 들어, `Post`와 `User`와 같은 주요 객체의 타입을 정의합니다.

   ```typescript
   export interface Post {
       id: string;
       title: string;
       content: string;
       author: string;
       createdAt: Date;
       updatedAt: Date;
   }



   export interface User {
       id: string;
       username: string;
       email: string;
       profilePicture: string;
   }
   ```

6. **PostCard.tsx**
   - 개별 게시물을 표시하는 카드 컴포넌트입니다.
   - 게시물의 제목, 내용, 작성자 및 작성 날짜를 표시하며, 게시물 클릭 시 상세 페이지로 이동합니다.

   ```typescript
   import React from 'react';
   import { Post } from '../types';

   interface PostCardProps {
       post: Post;
   }

   const PostCard: React.FC<PostCardProps> = ({ post }) => {
       return (
           <div className="post-card">
               <h2>{post.title}</h2>
               <p>{post.content}</p>
               <p>By {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
           </div>
       );
   };

   export default PostCard;
   ```

7. **Navbar.tsx**
   - 네비게이션 바 컴포넌트로, 사용자가 사이트 내에서 쉽게 이동할 수 있도록 도와줍니다.
   - 로그인 상태에 따라 다른 메뉴를 표시하며, 프로필 페이지와 로그아웃 기능을 제공합니다.

   ```typescript
   import React from 'react';
   import { useDispatch, useSelector } from 'react-redux';
   import { logout } from '../features/auth/authSlice';

   const Navbar: React.FC = () => {
       const dispatch = useDispatch();
       const user = useSelector((state: any) => state.auth.user);

       return (
           <nav className="navbar">
               <div className="navbar-logo">뜬 구름</div>
               {user ? (
                   <div className="navbar-menu">
                       <span>{user.username}</span>
                       <button onClick={() => dispatch(logout())}>Logout</button>
                   </div>
               ) : (
                   <div className="navbar-menu">
                       <a href="/login">Login</a>
                       <a href="/signup">Sign Up</a>
                   </div>
               )}
           </nav>
       );
   };

   export default Navbar;
   ```

8. **PostCreator.tsx**
   - 새로운 게시물을 작성할 수 있는 컴포넌트입니다.
   - 사용자가 제목과 내용을 입력하고 제출 버튼을 누르면 게시물이 생성됩니다.

   ```typescript
   import React, { useState } from 'react';
   import { useDispatch } from 'react-redux';
   import { createPost } from '../api/api';

   const PostCreator: React.FC = () => {
       const [title, setTitle] = useState('');
       const [content, setContent] = useState('');
       const dispatch = useDispatch();

       const handleSubmit = async (e: React.FormEvent) => {
           e.preventDefault();
           try {
               await createPost({ title, content });
               // 추가적인 로직
           } catch (error) {
               console.error('Failed to create post:', error);
           }
       };

       return (
           <form onSubmit={handleSubmit}>
               <input
                   type="text"
                   placeholder="Title"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
               />
               <textarea
                   placeholder="Content"
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
               />
               <button type="submit">Create Post</button>
           </form>
       );
   };

   export default PostCreator;
   ```

9. **ImageModal.tsx**
   - 이미지를 확대하여 보여주는 모달 컴포넌트입니다.
   - 게시물에 첨부된 이미지를 클릭하면 큰 화면으로 이미지를 볼 수 있습니다.

   ```typescript
   import React from 'react';
   import './ImageModal.module.css';

   interface ImageModalProps {
       imageUrl: string;
       onClose: () => void;
   }

   const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
       return (
           <div className="image-modal" onClick={onClose}>
               <img src={imageUrl} alt="Modal" />
           </div>
       );
   };

   export default ImageModal;
   ```

10. **MainPage.tsx**
   - 메인 페이지 컴포넌트로, 최신 게시물 목록을 표시합니다.
   - 사용자는 이 페이지에서 게시물을 클릭하여 상세 페이지로 이동할 수 있습니다.

   ```typescript
   import React, { useEffect, useState } from 'react';
   import { fetchPosts } from '../api/api';
   import PostCard from '../components/PostCard';
   import { Post } from '../types';

   const MainPage: React.FC = () => {
       const [posts, setPosts] = useState<Post[]>([]);

       useEffect(() => {
           const loadPosts = async () => {
               try {
                   const data = await fetchPosts();
                   setPosts(data);
               } catch (error) {
                   console.error('Failed to fetch posts:', error);
               }
           };

           loadPosts();
       }, []);

       return (
           <div className="main-page">
               {posts.map((post) => (
                   <PostCard key={post.id} post={post} />
               ))}
           </div>
       );
   };

   export default MainPage;
   ```

## 페이지 별 기능

### 초기화면
서비스 접속 초기화면으로, 사용자가 처음 방문했을 때 나타나는 페이지입니다.
- **로그인이 되어 있지 않은 경우:** 로그인 페이지로 리디렉션됩니다.
- **로그인이 되어 있는 경우:** 메인 페이지로 리디렉션됩니다.

![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/4c9f7ce6-8dc3-47d0-9c42-c18ea2775dd1)

### 로그인 페이지
사용자가 이메일과 비밀번호를 입력하여 로그인할 수 있는 페이지입니다.
- **기능:** 
  - 이메일과 비밀번호 입력
  - 이메일과 비밀번호 저장
  - 로그인 버튼 클릭 시 인증 처리
  - 로그인 실패 시 오류 메시지 표시

![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/58a91cd7-e0cf-4523-8fa5-812a26baab53)

### 회원가입 페이지
새로운 사용자가 이메일과 비밀번호를 입력하여 회원가입할 수 있는 페이지입니다.
- **기능:** 
  - 이메일과 비밀번호 입력
  - 입력된 정보에 대한 유효성 검사
  - 이메일 중복 검사 및 인증 코드 발송
  - 유효성 검사 실패 시 경고 문구 표시
  - 유효성 검사 통과 시 다음 버튼 활성화

![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/691a93ba-918f-4889-abfc-e7f5d24f34c2)
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/fa5f473e-aa59-4318-b33d-bb1b48681a15)
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/a975e925-7439-4020-be1d-2a15ebb8e14c)
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/ab48c612-8bc7-4c79-a80e-9f02fdbb33df)
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/06bf4e18-68f3-4296-b7a8-c98acd0a19f0)

### 메인 페이지
사용자가 커뮤니티의 최신 게시물을 볼 수 있는 메인 페이지입니다.
- **기능:** 
  - 최신 게시물 목록 표시
  - 게시글을 작성할 수 있는 게시글 작성 섹션
  - 게시글을 새로 고침(재랜더링) 할 수 있는 버튼
  - 게시물 클릭 시 상세 모달 On
  
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/ad808d91-1698-4e2c-8925-5a3f9df2ce6d)
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/c06fed37-13ea-4fb0-ae94-4a2dc381fb82)
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/c4dd6979-dc07-4d18-a57d-b1c5fa5c3d29)
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/1cb6694c-7e12-4b82-b87e-b67d03476ceb)

### 프로필 페이지
사용자의 프로필 정보를 표시하고 편집할 수 있는 페이지입니다.
- **기능:** 
  - 프로필 사진, 사용자 닉네임, 이메일 등 정보 표시
  - 프로필 정보(닉네임, 프로필 사진) 수정 가능
  - 비밀번호 수정 가능
    
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/2f0beefc-e9af-490f-953c-b181a8d68e9a)
![image](https://github.com/Re

cyclingbottle/cloud-story-react/assets/101244968/7a257b39-e717-43f3-b57f-40f20c6756b9)

### 게시물 작성 컴포넌트
메인 페이지, 오늘의 인기글 페이지, 이번 주의 인기글 페이지 상단에 위치하며, 새로운 게시물을 작성할 수 있는 컴포넌트입니다.
- **기능:** 
  - 텍스트 입력 섹션을 클릭하면 컴포넌트가 열리고 여러 버튼(사진 등록, 취소, 작성)이 숨김 상태에서 사용자에게 보이게 됩니다.
  - 사진을 등록할 수 있습니다. 최대 20장을 등록할 수 있습니다.
  - 사진을 제거할 수 있습니다.
  - 순서는 변경할 수 없습니다. 

![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/a2a3370c-d045-4b65-9d8f-baed2ce358de)
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/570de456-0f29-450d-8e7e-0565840fd4ef)
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/d04da3ac-e996-47a3-84c1-0e45b09c83dc)
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/e6c43d5b-4533-4ffa-b33d-cd59b47348af)

### 게시물 상세 보기 모달
선택한 게시물의 상세 내용을 볼 수 있는 모달입니다.
- **기능:** 
  - 게시물 내용, 작성자, 작성일 표시
  - 게시글의 메타 정보인 좋아요, 싫어요, 댓글, 조회 수 표시
  - 댓글 목록과 함께 댓글 작성 및 수정, 삭제 기능 제공

![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/573f32cc-48b3-4c1c-834b-f2d798d5bb7b)
![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/c45c6002-3f51-424c-b147-95fce7db3403)

### 오늘의 인기글 게시물 페이지
오늘 작성된 게시물 중 인기를 판별하는 수식을 통해 필터링하여 표시하는 페이지입니다.
- **기능:** 
  - 오늘 작성된 게시물 중 인기 있는 5개 글을 순서대로 표시
  - 게시물 클릭 시 상세 모달 열기
  - 게시글 상세 보기 모달과 동일

![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/e18c99d0-1538-4d43-a6ea-18e733a07b53)

### 이번 주의 인기글 페이지
한 주의 인기글을 모아 순서대로 표시하는 페이지입니다.
- **기능:** 
  - 이번 주 작성된 인기글 목록 표시
  - 게시물 클릭 시 상세 모달 열기
  - 게시글 상세 보기 모달과 동일

![image](https://github.com/Recyclingbottle/cloud-story-react/assets/101244968/0e215976-7ccd-4aff-8d64-9d99576eed3d)

## 프로젝트 후기
이번에 처음으로 리액트에서 자바스크립트가 아닌 타입스크립트를 사용하면서 정적 타입에 대한 이해도와 자바스크립트를 더 깊게 이해할 수 있는 기회가 되었습니다. 새로운 시도에 대해 프로젝트를 통해 배우며, 무언가를 깨닫고 도전에서 나오는 성취감을 얻을 수 있어 좋았습니다.
