import React, { useState } from "react";
import api from "../../../api/axios";
import styles from "../../../pages/CreateAccountPage.module.css";
import axios from "axios";
import API_URL from "../../../api/api";
interface Step2Props {
  setStep: (step: number) => void;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const Step2: React.FC<Step2Props> = ({ setStep, email, setEmail }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [helperText, setHelperText] = useState("");
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateVerificationCode = (code: string) => {
    return code.length === 6;
  };

  const updateEmailValidation = () => {
    if (!validateEmail(email)) {
      setHelperText("유효한 이메일을 입력해주세요.");
      return false;
    } else {
      setHelperText("");
      return true;
    }
  };

  const updateVerificationCodeValidation = () => {
    if (!validateVerificationCode(verificationCode)) {
      setHelperText("인증 코드는 6글자여야 합니다.");
      return false;
    } else {
      setHelperText("");
      return true;
    }
  };

  const checkEmail = async () => {
    if (!updateEmailValidation()) {
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/users/check-email`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            // 필요시 Authorization 헤더 추가
            // 'Authorization': `Bearer ${yourToken}`,
          },
          withCredentials: true, // 쿠키를 포함하는 요청
        }
      );
      if (response.data.success) {
        setHelperText("이메일로 인증 코드를 보냈습니다.");
        setIsVerificationCodeSent(true);
      } else {
        setHelperText("이메일 중복 확인에 실패하였습니다.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          setHelperText(error.response.data.message);
        } else {
          setHelperText("서버와 통신할 수 없습니다.");
        }
      }
    }
  };

  const checkVerificationCode = async () => {
    if (!updateVerificationCodeValidation()) {
      return;
    }
    try {
      const response = await api.post("/users/verify-email", {
        email,
        verificationCode,
      });
      if (response.data.success) {
        setHelperText("인증이 완료되었습니다.");
        setIsEmailVerified(true);
      } else {
        setHelperText("인증에 오류가 발생하였습니다.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          setHelperText(error.response.data.message);
        } else {
          setHelperText("서버와 통신할 수 없습니다.");
        }
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(e.target.value);
  };

  const 다음단계 = () => {
    if (isEmailVerified) {
      setStep(3);
    } else {
      setHelperText("이메일 인증을 완료해주세요.");
    }
  };

  return (
    <div className={`${styles.contentSection} ${styles.contentSecond}`}>
      <h2 className={styles.sectionTitle}>
        아이디로 사용할 이메일을 입력해주세요
      </h2>
      <div className={styles.inputGroup}>
        <input
          type="email"
          className={styles.inputEmail}
          placeholder="이메일 입력"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
        <button
          className={`${styles.btn} ${styles.btnCheckEmail}`}
          onClick={checkEmail}
        >
          중복확인
        </button>
      </div>
      {isVerificationCodeSent && (
        <div className={styles.inputGroup} id="verification-code-group">
          <input
            type="text"
            className={styles.inputVerificationCode}
            placeholder="인증 코드 입력"
            id="verification-code"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
          />
          <button
            className={`${styles.btn} ${styles.btnCheckCode}`}
            onClick={checkVerificationCode}
          >
            코드 확인
          </button>
        </div>
      )}
      {helperText && <p className={styles.emailHelperText}>{helperText}</p>}
      <div className={styles.buttonWrapper}>
        <button
          className={`${styles.btn} ${styles.btnNext} ${styles.secondBtnNext}`}
          id="email-next-btn"
          onClick={다음단계}
          disabled={!isEmailVerified}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Step2;
