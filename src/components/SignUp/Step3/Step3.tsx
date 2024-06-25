import React, { useState, useEffect } from "react";
import styles from "../../../pages/CreateAccountPage.module.css";

interface Step3Props {
  setStep: (step: number) => void;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const Step3: React.FC<Step3Props> = ({ setStep, password, setPassword }) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validatePassword = (pass: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(pass);
  };

  useEffect(() => {
    if (password && confirmPassword) {
      if (!validatePassword(password)) {
        setErrorMessage(
          "비밀번호는 8자 이상이며, 문자, 숫자, 특수문자를 포함해야 합니다."
        );
        setIsValid(false);
      } else if (password !== confirmPassword) {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
        setIsValid(false);
      } else {
        setErrorMessage("");
        setIsValid(true);
      }
    } else {
      setIsValid(false);
    }
  }, [password, confirmPassword]);

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const 다음단계 = () => {
    if (isValid) {
      setStep(4);
    }
  };

  return (
    <div className={styles.contentSection + " " + styles.contentThird}>
      <h2 className={styles.sectionTitle}>
        로그인에 사용할 비밀번호를 등록해주세요
      </h2>
      <p className={styles.inputEmailDisabled} id="email-display"></p>
      <div className={styles.inputGroup}>
        <input
          type={showPassword ? "text" : "password"}
          className={styles.inputPassword}
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <i
          className={`toggle-password fa ${
            showPassword ? "fa-eye-slash" : "fa-eye"
          }`}
          onClick={() => togglePasswordVisibility("password")}
        ></i>
      </div>
      <div className={styles.inputGroup}>
        <input
          type={showConfirmPassword ? "text" : "password"}
          className={styles.inputPasswordConfirm}
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <i
          className={`toggle-password fa ${
            showConfirmPassword ? "fa-eye-slash" : "fa-eye"
          }`}
          onClick={() => togglePasswordVisibility("confirmPassword")}
        ></i>
      </div>
      <p
        className={`${styles.passwordHelperText} ${
          errorMessage ? "" : styles.hidden
        }`}
      >
        {errorMessage}
      </p>
      <div className={styles.buttonWrapper}>
        <button
          className={`${styles.btn} ${styles.btnNext} ${styles.thirdBtnNext} ${
            isValid ? "" : styles.disabled
          }`}
          onClick={다음단계}
          disabled={!isValid}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Step3;
