import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { logout } from "../features/auth/authSlice";
import axios from "../api/axios";
import styles from "./ProfilePage.module.css";
import API_URL from "../api/api";
const ProfilePage: React.FC = () => {
  const { email, nickname, profileImageUrl, token } = useSelector(
    (state: RootState) => ({
      ...state.auth,
      nickname: state.auth.nickname || "",
    })
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    const userData: any = {};

    if (newNickname !== nickname) {
      userData.nickname = newNickname;
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }
      if (newPassword.length < 8) {
        alert("비밀번호는 최소 8자 이상이어야 합니다.");
        return;
      }
      userData.password = newPassword;
    }

    formData.append("user", JSON.stringify(userData));

    if (newProfileImage) {
      formData.append("profileImage", newProfileImage);
    }

    try {
      const response = await axios.put("/users/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("프로필이 성공적으로 업데이트되었습니다.");
        if (newPassword) {
          dispatch(logout());
          navigate("/login");
        } else {
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <div className={styles.profileImageContainer}>
          <img
            src={previewImage || `${API_URL}/files${profileImageUrl}`}
            alt="Profile"
            className={styles.profileImage}
          />
          {isEditing && (
            <button
              className={styles.changePhotoButton}
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="fas fa-camera"></i>
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
            accept="image/*"
          />
        </div>
        <h1 className={styles.profileName}>{nickname}</h1>
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>이메일</span>
          <span className={styles.infoValue}>{email}</span>
        </div>
        {isEditing ? (
          <>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>닉네임</span>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>새 비밀번호</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                placeholder="새 비밀번호 (선택사항)"
              />
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>비밀번호 확인</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                placeholder="새 비밀번호 확인"
              />
            </div>
          </>
        ) : null}
      </div>
      <div className={styles.actionButtons}>
        {isEditing ? (
          <>
            <button className={styles.saveButton} onClick={handleSubmit}>
              저장
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
          </>
        ) : (
          <button
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            프로필 수정
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
