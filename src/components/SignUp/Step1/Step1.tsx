import React, { useState, useEffect } from "react";
import styles from "../../../pages/CreateAccountPage.module.css";

// 회원가입 1단계 : 약관 동의

interface Step1Props {
  setStep: (step: number) => void;
}
const Step1: React.FC<Step1Props> = ({ setStep }) => {
  const [isAgreeAll, setIsAgreeAll] = useState(false);
  const [isAgreeAge, setIsAgreeAge] = useState(false);
  const [isAgreeTerms, setIsAgreeTerms] = useState(false);
  useEffect(() => {
    updateAgreeButtonState();
  }, [isAgreeAll, isAgreeAge, isAgreeTerms]);

  const nextStep = () => {
    setStep(2);
  };
  const handleAgreeAllChange = () => {
    const newAgreeAll = !isAgreeAll;
    setIsAgreeAll(newAgreeAll);
    setIsAgreeAge(newAgreeAll);
    setIsAgreeTerms(newAgreeAll);
  };

  const handleAgreeAgeChange = () => {
    setIsAgreeAge(!isAgreeAge);
  };

  const handleAgreeTermsChange = () => {
    setIsAgreeTerms(!isAgreeTerms);
  };

  const updateAgreeButtonState = () => {
    if (isAgreeAge && isAgreeTerms) {
      setIsAgreeAll(true);
    } else {
      setIsAgreeAll(false);
    }
  };
  return (
    <div className={styles.contentSection}>
      <h2 className={styles.sectionTitle}>서비스 약관에 동의해주세요</h2>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          className={styles.checkbox}
          id="agreeAll"
          checked={isAgreeAll}
          onChange={handleAgreeAllChange}
        />
        모두 동의합니다
      </label>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          className={styles.checkbox}
          id="agreeAge"
          checked={isAgreeAge}
          onChange={handleAgreeAgeChange}
        />
        만 14세 이상입니다
      </label>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          className={styles.checkbox}
          id="agreeTerms"
          checked={isAgreeTerms}
          onChange={handleAgreeTermsChange}
        />
        필수 약관에 동의합니다
      </label>
      <div className={styles.termsContent}>
        <p className={styles.termsText}>
          <strong>뜬 구름 서비스 이용 약관</strong>
          <br />
          <br />본 약관은 뜬 구름 서비스(이하 "서비스")의 이용 조건을 정합니다.
          회원가입 시 본 약관에 동의하는 것으로 간주됩니다.
        </p>
        <p className={styles.termsText}>
          1. <strong>서비스 이용</strong>
          <br />
          - 회원은 본 서비스를 개인적, 비상업적 목적으로 이용할 수 있습니다.
          <br />
          - 서비스의 모든 콘텐츠에 대한 저작권은 뜬 구름 또는 해당 콘텐츠
          제공자에게 있습니다.
          <br />- 회원은 다른 회원의 권리를 존중하고, 적절한 manner로 서비스를
          이용해야 합니다.
        </p>
        <p className={styles.termsText}>
          2. <strong>계정 관리</strong>
          <br />
          - 회원은 제공한 정보의 정확성에 대해 책임을 집니다.
          <br />
          - 계정 정보 유출 시 즉시 뜬 구름에 알려야 합니다.
          <br />- 타인의 계정을 무단으로 사용할 수 없습니다.
        </p>
        <p className={styles.termsText}>
          3. <strong>콘텐츠 및 행동 규칙</strong>
          <br />
          - 불법적이거나 공격적인 내용의 게시를 금지합니다.
          <br />
          - 타인의 지적재산권을 침해하는 콘텐츠 게시를 금지합니다.
          <br />- 스팸이나 광고성 콘텐츠 게시를 금지합니다.
        </p>
        <p className={styles.termsText}>
          4. <strong>서비스 변경 및 종료</strong>
          <br />
          - 뜬 구름은 서비스 내용을 수정하거나 종료할 권리가 있습니다.
          <br />- 중요한 변경사항은 서비스 내 공지를 통해 안내합니다.
        </p>
        <p className={styles.termsText}>
          5. <strong>책임 제한</strong>
          <br />
          - 뜬 구름은 서비스 이용으로 인해 발생하는 문제에 대해 책임지지
          않습니다.
          <br />- 회원 간 분쟁에 대해 뜬 구름은 개입하지 않습니다.
        </p>
        <p className={styles.termsText}>
          <strong>개인정보 처리방침</strong>
          <br />
          <br />뜬 구름은 회원의 개인정보를 소중히 여기며, 관련 법령을
          준수합니다.
        </p>
        <p className={styles.termsText}>
          1. <strong>수집하는 개인정보</strong>
          <br />
          - 이메일 주소, 닉네임, 프로필 사진(선택)
          <br />- 서비스 이용 기록, IP 주소
        </p>
        <p className={styles.termsText}>
          2. <strong>개인정보의 이용</strong>
          <br />
          - 서비스 제공 및 개선
          <br />
          - 회원 관리 및 본인 확인
          <br />- 새로운 서비스 안내 및 마케팅(동의 시)
        </p>
        <p className={styles.termsText}>
          3. <strong>개인정보의 보호</strong>
          <br />
          - 암호화 등 기술적 조치를 통해 개인정보를 안전하게 관리합니다.
          <br />- 법령에 의한 경우를 제외하고 동의 없이 제3자에게 제공하지
          않습니다.
        </p>
        <p className={styles.termsText}>
          4. <strong>회원의 권리</strong>
          <br />
          - 언제든지 자신의 개인정보에 대한 열람, 수정, 삭제를 요청할 수
          있습니다.
          <br />- 개인정보 처리 관련 문의: resuable.park@gmail.com
        </p>
      </div>
      <div className={styles.buttonWrapper}>
        <button
          className={styles.btn}
          onClick={nextStep}
          disabled={!isAgreeAge || !isAgreeTerms}
        >
          동의
        </button>
      </div>
    </div>
  );
};

export default Step1;
