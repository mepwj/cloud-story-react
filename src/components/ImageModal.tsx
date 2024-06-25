import React from "react";
import styles from "./ImageModal.module.css"; // 필요한 스타일을 새 CSS 모듈 파일로 분리

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Full size" className={styles.modalImage} />
      </div>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default ImageModal;
