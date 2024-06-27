# ☁️ 뜬 구름

## 프로젝트 소개

- **프로젝트 명:** 뜬 구름
- **프로젝트 목적:** 커뮤니티 사이트
- **개발 기간:** 2024-05-03 ~ 2024-05-29
- **개발 인원:** 1명 (프론트엔드/백엔드 모두 담당)
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

<details>
  <summary>폴더 구조 보기/숨기기</summary>
  <div markdown="1">
    
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

  </div>
</details>

## 주요 코드 및 로직

### 1. Redux Toolkit을 이용한 상태 관리

`authSlice.ts` 파일에서는 Redux Toolkit을 사용하여 사용자 인증 상태를 관리합니다. `createSlice`를 통해 간단하게 상태와 액션을 정의할 수 있습니다.

```typescript
// src/features/auth/authSlice.ts
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

### 2. React Router를 이용한 라우팅

`App.tsx` 파일에서는 React Router를 사용하여 페이지 간의 라우팅을 설정합니다. `PrivateRoute` 컴포넌트를 사용하여 인증된 사용자만 접근할 수 있는 경로를 보호합니다.

```typescript
// src/App.tsx
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

### 3. 모듈화된 CSS를 이용한 스타일링

각 컴포넌트는 모듈화된 CSS 파일을 사용하여 스타일링 되어, 스타일 충돌을 방지하고 유지보수성을 높였습니다.

```css
/* Example: Navbar.module.css */
.navbar {
    background-color: #fff;
    padding: 10px;
}

.navbar-logo {
    height: 40px;
}
```

## 서비스 화면

`홈`
| 인트로 | 로그인 모달 | 회원가입 모달 |
|---|---|---|
|<img src="https://via.placeholder.com/150" alt="인트로">|<img src="https://via.placeholder.com/150" alt="로그인 모달">|<img src="https://via.placeholder.com/150" alt="회원가입 모달">|

`게시글 목록`

|전체 게시물|개발 게시물|고민 게시글|내 게시글|
|---|---|---|---|
|<img src="https://via.placeholder.com/150" alt="전체 게시물">|<img src="https://via.placeholder.com/150" alt="개발 게시물">|<img src="https://via.placeholder.com/150" alt="고민 게시글">|<img src="https://via.placeholder.com/150" alt="내 게시글">|

`게시물 작성 / 상세 / 수정 / 삭제`

|게시물 작성|게시물 상세|게시글 수정|게시글 삭제|
|---|---|---|---|
|<img src="https://via.placeholder.com/150" alt="게시물 작성">|<img src="https://via.placeholder.com/150" alt="게시물 상세">|<img src="https://via.placeholder.com/150" alt="게시글 수정">|<img src="https://via.placeholder.com/150" alt="게시글 삭제">|

`댓글 목록 / 등록 / 수정 / 삭제`

|댓글 목록|댓글 등록|댓글 수정|댓글 삭제|
|---|---|---|---|
|<img src="https://via.placeholder.com/150" alt="댓글 목록">|<img src="https://via.placeholder.com/150" alt="댓글 등록">|<img src="https://via.placeholder.com/150" alt="댓글 수정">|<img src="https://via.placeholder.com/150" alt="댓글 삭제">|

`프로필 수정 / 비밀번호 수정 / 회원 탈퇴 / 로그아웃`

|프로필 수정|비밀번호 수정|회원 탈퇴|로그아웃|
|---|---|---|---

|
|<img src="https://via.placeholder.com/150" alt="프로필 수정">|<img src="https://via.placeholder.com/150" alt="비밀번호 수정">|<img src="https://via.placeholder.com/150" alt="회원 탈퇴">|<img src="https://via.placeholder.com/150" alt="로그아웃">|

## 트러블 슈팅



## 프로젝트 후기


<br/>

<p align="center">
  <img src="https://via.placeholder.com/200" alt="뜬 구름 로고"/>
</p>
