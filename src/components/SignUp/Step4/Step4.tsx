import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../pages/CreateAccountPage.module.css";
import defaultProfile from "../../../assets/default-profile.png";
import api from "../../../api/axios";
import axios from "axios";

interface Step4Props {
  email: string;
  password: string;
}

const Step4: React.FC<Step4Props> = ({ email, password }) => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] =
    useState(defaultProfile);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    validateForm();
  }, [email, password, nickname, isNicknameChecked]);

  const validateForm = () => {
    setIsFormValid(!!email && !!password && !!nickname && isNicknameChecked);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImage(null);
      setProfileImagePreview(defaultProfile);
    }
  };

  const handleCheckNickname = async () => {
    if (!nickname) {
      setHelperText("닉네임을 입력해주세요.");
      return;
    }

    try {
      const response = await api.get(`users/check-nickname`, {
        params: { nickname },
      });
      if (response.data.success && response.data.available) {
        setHelperText("사용 가능한 닉네임입니다.");
        setIsNicknameChecked(true);
      } else {
        setHelperText("닉네임 중복 확인에 실패하였습니다.");
        setIsNicknameChecked(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setHelperText(error.response.data.message);
      } else {
        setHelperText("서버와 통신할 수 없습니다.");
      }
      setIsNicknameChecked(false);
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setIsNicknameChecked(false);
    setHelperText("");
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const formData = new FormData();
    formData.append(
      "user",
      JSON.stringify({
        email,
        password,
        nickname,
      })
    );
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const response = await api.post("users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      } else {
        alert("오류가 발생하였습니다.");
        setRefreshKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      alert("오류가 발생하였습니다.");
      setRefreshKey((prevKey) => prevKey + 1);
    }
  };

  // refreshKey가 변경될 때마다 컴포넌트를 리렌더링
  useEffect(() => {
    // 컴포넌트 초기화 로직
    setNickname("");
    setProfileImage(null);
    setProfileImagePreview(defaultProfile);
    setIsNicknameChecked(false);
    setIsFormValid(false);
    setHelperText("");
  }, [refreshKey]);

  return (
    <div className={styles.contentSection + " " + styles.contentFourth}>
      <h2 className={styles.sectionTitle}>프로필 설정</h2>
      <div className={styles.profilePicWrapper}>
        <img
          src={profileImagePreview}
          alt="프로필 사진"
          className={styles.profilePic}
          onClick={handleImageClick}
        />
        <input
          type="file"
          className={styles.inputFile}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          type="text"
          className={styles.inputNickname}
          placeholder="닉네임"
          value={nickname}
          onChange={handleNicknameChange}
        />
        <button
          className={styles.btn + " " + styles.btnCheckNickname}
          onClick={handleCheckNickname}
        >
          중복확인
        </button>
      </div>
      <p className={`${styles.helperText} ${!helperText ? styles.hidden : ""}`}>
        {helperText}
      </p>
      <div className={styles.buttonWrapper}>
        <button
          className={`${styles.btn} ${styles.btnSubmit} ${
            !isFormValid ? styles.disabled : ""
          }`}
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          가입하기
        </button>
      </div>
    </div>
  );
};

export default Step4;
