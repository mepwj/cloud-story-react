import React, { useState } from "react";
import styles from "./CreateAccountPage.module.css";
import logoImg from "../assets/cloud-story-logo.png";
import Step1 from "../components/SignUp/Step1";
import Step2 from "../components/SignUp/Step2";
import Step3 from "../components/SignUp/Step3";
import Step4 from "../components/SignUp/Step4";

const CreateAccountPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.headerTitle}>
          <img
            src={logoImg}
            alt="뜬 구름 아이콘"
            className={styles.headerIcon}
          />
          <span className={styles.headerText}>뜬 구름</span>
        </div>
      </div>
      <main className={styles.mainContent}>
        <article className={styles.signupContent}>
          {step === 1 && <Step1 setStep={setStep} />}
          {step === 2 && (
            <Step2 setStep={setStep} email={email} setEmail={setEmail} />
          )}
          {step === 3 && (
            <Step3
              setStep={setStep}
              password={password}
              setPassword={setPassword}
            />
          )}
          {step === 4 && <Step4 email={email} password={password} />}
        </article>
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

export default CreateAccountPage;
