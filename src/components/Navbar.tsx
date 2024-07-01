import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../store";
import { logout } from "../features/auth/authSlice";
import styles from "./Navbar.module.css";
import cloud_story_logo from "../assets/cloud-story-logo.png";
import default_profile_img from "../assets/default-profile.png";

const Navbar: React.FC = () => {
  const { profileImageUrl, nickname } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const apiUrl = "3.38.152.113/api";
  const profileImage = profileImageUrl
    ? `${apiUrl}/files${profileImageUrl}`
    : default_profile_img;

  const handleProfileClick = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navLeft}>
        <img
          className={styles.logo}
          src={cloud_story_logo}
          alt="Cloud Story Logo"
          onClick={() => navigate("/")}
        />
        <div className={styles.titleContainer}>
          <h2 className={styles.title} onClick={() => navigate("/")}>
            뜬구름
          </h2>
          <h4 className={styles.subTitle} onClick={() => navigate("/")}>
            잡는 이야기의 시작..
          </h4>
        </div>
      </div>
      <div className={styles.navCenter}>
        <a
          className={`${styles.navLink} ${
            location.pathname === "/" ? styles.active : ""
          }`}
          onClick={() => navigate("/")}
        >
          메인
        </a>
        <a
          className={`${styles.navLink} ${
            location.pathname === "/today" ? styles.active : ""
          }`}
          onClick={() => navigate("/today")}
        >
          오늘의 인기글
        </a>
        <a
          className={`${styles.navLink} ${
            location.pathname === "/week" ? styles.active : ""
          }`}
          onClick={() => navigate("/week")}
        >
          이번 주의 인기글
        </a>
      </div>
      <div className={styles.navRight}>
        <div className={styles.profileContainer}>
          <div className={styles.profileWrapper} onClick={handleProfileClick}>
            <img className={styles.profile} src={profileImage} alt="Profile" />
            <span className={styles.nickname}>{nickname}</span>
          </div>
          {showMenu && (
            <div className={styles.profileMenu}>
              <button onClick={() => navigate("/profile-edit")}>
                <i className="fas fa-user"></i> 내 정보
              </button>
              <button onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> 로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
