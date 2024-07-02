import React, { useState } from "react";
import ImageModal from "./ImageModal";
import styles from "./PhotoSlider.module.css";
import API_URL from "../api/api";
interface Photo {
  id: number;
  url: string;
  photoOrder: number;
}

interface PhotoSliderProps {
  photos: Photo[];
}

const PhotoSlider: React.FC<PhotoSliderProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const openModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
  };

  const closeModal = () => {
    setModalImageUrl(null);
  };

  return (
    <div className={styles.photoSlider}>
      <div
        className={styles.photoSliderInner}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={`${API_URL}/files${photo.url}`}
            alt={`Post photo ${photo.photoOrder}`}
            className={styles.postPhoto}
            onClick={() => openModal(`/api/files${photo.url}`)}
          />
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <button
            className={`${styles.sliderButton} ${styles.prevButton}`}
            onClick={prevPhoto}
          >
            &#10094;
          </button>
          <button
            className={`${styles.sliderButton} ${styles.nextButton}`}
            onClick={nextPhoto}
          >
            &#10095;
          </button>
          <div className={styles.photoIndicator}>
            {photos.map((_, index) => (
              <div
                key={index}
                className={`${styles.indicatorDot} ${
                  index === currentIndex ? styles.active : ""
                }`}
              />
            ))}
          </div>
        </>
      )}
      {modalImageUrl && (
        <ImageModal imageUrl={modalImageUrl} onClose={closeModal} />
      )}
    </div>
  );
};

export default PhotoSlider;
