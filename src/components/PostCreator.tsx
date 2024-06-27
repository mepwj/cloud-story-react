import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import axios from "../api/axios";
import styles from "./PostCreator.module.css";
import { PostsRefreshContext } from "../pages/MainPage"; // MainPage에서 제공하는 컨텍스트를 import

const PostCreator: React.FC = () => {
  const { nickname, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const refreshPosts = useContext(PostsRefreshContext); // 컨텍스트를 사용하여 새로 고침 함수를 가져옵니다.

  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setContent("");
    setImages([]);
  };

  const handleSubmit = async () => {
    if (content.trim() === "" && images.length === 0) {
      alert("내용 또는 이미지를 추가해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", "");
    formData.append("content", content);

    if (images.length === 0) {
      formData.append("photos", new Blob());
    } else {
      images.forEach((image) => {
        formData.append("photos", image);
      });
    }

    try {
      const response = await axios.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        refreshPosts(); // 새로 고침 함수를 호출합니다.
        navigate("/");
      } else {
        alert("게시글을 생성하는데 실패했습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("게시글을 생성하는데 실패했습니다.");
    } finally {
      setIsExpanded(false);
      setContent("");
      setImages([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      const totalImages = images.length + newImages.length;
      if (totalImages > 20) {
        alert("최대 20장까지만 업로드 가능합니다.");
        return;
      }
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.postCreator}>
      <div
        className={`${styles.inputArea} ${isExpanded ? styles.expanded : ""}`}
        onClick={handleExpand}
      >
        {isExpanded ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`${nickname}님의 이야기를 기다리고 있어요.`}
            className={styles.textarea}
          />
        ) : (
          <div className={styles.placeholder}>
            {nickname}님의 이야기를 기다리고 있어요.
          </div>
        )}
      </div>
      {images.length > 0 && (
        <div className={styles.imagePreviewArea}>
          {images.map((image, index) => (
            <div key={index} className={styles.imagePreview}>
              <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
              <button
                onClick={() => removeImage(index)}
                className={styles.removeImageBtn}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <div className={styles.actionArea}>
        {isExpanded && (
          <>
            <button
              className={styles.uploadButton}
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="fas fa-image"></i> 사진 업로드 ({images.length}/20)
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              multiple
              onChange={handleFileUpload}
            />
          </>
        )}
        {isExpanded && (
          <div className={styles.expandedButtons}>
            <button className={styles.cancelButton} onClick={handleCancel}>
              취소
            </button>
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={content.trim() === "" && images.length === 0}
            >
              올리기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCreator;
