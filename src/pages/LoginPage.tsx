import React, { useState, useEffect } from "react";
import logoImg from "../assets/cloud-story-logo.png";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import API_URL from "../api/api";
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isEmailSaved, setIsEmailSaved] = useState(false);
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    if (storedEmail) {
      setEmail(storedEmail);
      setIsEmailSaved(true);
    }
    if (storedPassword) {
      setPassword(storedPassword);
      setIsPasswordSaved(true);
    }
  }, []);

  useEffect(() => {
    if (email === "") {
      setEmailError("이메일을 입력해주세요.");
    } else if (email === "admin") {
      setEmailError("");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("올바른 형태의 이메일을 입력해주세요.");
    } else {
      setEmailError("");
    }
  }, [email]);

  useEffect(() => {
    if (password === "") {
      setPasswordError("비밀번호를 입력해주세요.");
    } else if (password.length <= 8) {
      setPasswordError("비밀번호가 짧습니다.");
    } else {
      setPasswordError("");
    }
  }, [password]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (isEmailSaved) {
      localStorage.setItem("email", newEmail);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (isPasswordSaved) {
      localStorage.setItem("password", newPassword);
    }
  };

  useEffect(() => {
    if (isEmailSaved) {
      localStorage.setItem("email", email);
    }
  }, [email, isEmailSaved]);

  useEffect(() => {
    if (isPasswordSaved) {
      localStorage.setItem("password", password);
    }
  }, [password, isPasswordSaved]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        mode: "cors",
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(
          login({
            isLoggedIn: true,
            token: data.token,
            nickname: data.nickname,
            profileImageUrl: data.profileImageUrl,
            userId: data.userId,
            email: data.email,
          })
        );
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        setEmailError("잘못된 이메일 또는 비밀번호입니다.");
        setPasswordError("잘못된 이메일 또는 비밀번호입니다.");
      }
    } catch (error) {
      console.error("Error during login request:", error);
      setEmailError("로그인 요청 중 오류가 발생했습니다.");
      setPasswordError("로그인 요청 중 오류가 발생했습니다.");
    }
  };

  const handleSaveOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "saveId") {
      setIsEmailSaved(checked);
      if (checked) {
        localStorage.setItem("email", email);
      } else {
        localStorage.removeItem("email");
      }
    }

    if (name === "savePassword") {
      setIsPasswordSaved(checked);
      if (checked) {
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("password");
      }
    }
  };

  const showInProgressAlert = () => {
    alert("준비중입니다.");
  };

  const navigateToSignUp = () => {
    navigate("/create_account");
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.headerContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.headerTitle}>
            <img
              src={logoImg}
              alt="뜬 구름 아이콘"
              className={styles.headerIcon}
            />
            <span className={styles.headerText}> 뜬 구름 </span>
          </h1>
        </div>
      </div>

      {/* Main content */}
      <main className={styles.mainContent}>
        <div className={styles.formContainer}>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <input
              type="email"
              className={styles.inputEmail}
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
            />
            <p className={styles.emailHelperText}>{emailError}</p>
            <input
              type="password"
              className={styles.inputPassword}
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
            />
            <p className={styles.passwordHelperText}>{passwordError}</p>
            <div className={styles.saveOptions}>
              <label className={styles.saveIdLabel}>
                <input
                  type="checkbox"
                  name="saveId"
                  className={styles.saveId}
                  checked={isEmailSaved}
                  onChange={handleSaveOptionsChange}
                />{" "}
                아이디 저장
              </label>
              <label className={styles.savePasswordLabel}>
                <input
                  type="checkbox"
                  name="savePassword"
                  className={styles.savePassword}
                  checked={isPasswordSaved}
                  onChange={handleSaveOptionsChange}
                />{" "}
                비밀번호 저장
              </label>
            </div>
            <button
              className={styles.loginButton}
              type="submit"
              disabled={emailError !== "" || passwordError !== ""}
            >
              로그인
            </button>
            <div className={styles.links}>
              <a className={styles.signupLink} onClick={navigateToSignUp}>
                회원가입
              </a>{" "}
              |
              <a
                className={styles.findAccountLink}
                onClick={showInProgressAlert}
              >
                계정 찾기
              </a>{" "}
              |
              <a
                className={styles.findPasswordLink}
                onClick={showInProgressAlert}
              >
                비밀번호 찾기
              </a>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2024 Rebo. All rights reserved.</p>
        <p>
          Contact me at:
          <a
            href="mailto:resuable.park@gmail.com"
            className={styles.contactLink}
          >
            resuable.park@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
