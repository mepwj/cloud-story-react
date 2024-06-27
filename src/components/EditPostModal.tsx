import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import axios from "../api/axios";
import styles from "./EditPostModal.module.css";

interface Photo {
  id: number;
  url: string;
  photoOrder: number;
}

interface Post {
  id: number;
  user: {
    id: number;
    email: string;
    nickname: string;
    profilePictureUrl: string;
  };
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  dislikeCount: number;
  viewCount: number;
  commentCount: number;
  photos: Photo[];
}

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
  refreshPosts: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  post,
  onClose,
  refreshPosts,
}) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [content, setContent] = useState(post.content);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<Photo[]>(post.photos);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async () => {
    if (
      content.trim() === "" &&
      newImages.length === 0 &&
      existingImages.length === 0
    ) {
      alert("내용 또는 이미지를 추가해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("title", "");
    // 새 이미지 추가
    newImages.forEach((image, index) => {
      formData.append(`photos`, image);
    });

    // 기존 이미지를 Blob으로 변환하여 추가
    const existingImageBlobs = await Promise.all(
      existingImages.map(async (image) => {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/files${image.url}`
        );
        const blob = await response.blob();
        return new File([blob], `existing-${image.id}.jpg`, {
          type: "image/jpeg",
        });
      })
    );

    existingImageBlobs.forEach((blob, index) => {
      formData.append(`photos`, blob);
    });

    try {
      const response = await axios.put(`/posts/${post.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        refreshPosts();
        onClose();
      } else {
        alert("게시글을 수정하는데 실패했습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("게시글을 수정하는데 실패했습니다.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedImages = Array.from(e.target.files);
      const totalImages =
        newImages.length + existingImages.length + uploadedImages.length;
      if (totalImages > 20) {
        alert("최대 20장까지만 업로드 가능합니다.");
        return;
      }
      setNewImages((prev) => [...prev, ...uploadedImages]);
    }
  };

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>게시글 수정</h2>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요."
          className={styles.textarea}
        />
        <div className={styles.imagePreviewArea}>
          {existingImages.map((image, index) => (
            <div key={`existing-${image.id}`} className={styles.imagePreview}>
              <img
                src={`${process.env.REACT_APP_API_URL}/files${image.url}`}
                alt={`Existing ${index}`}
              />
              <button
                onClick={() => removeImage(index, true)}
                className={styles.removeImageBtn}
              >
                ×
              </button>
            </div>
          ))}
          {newImages.map((image, index) => (
            <div key={`new-${index}`} className={styles.imagePreview}>
              <img src={URL.createObjectURL(image)} alt={`New ${index}`} />
              <button
                onClick={() => removeImage(index, false)}
                className={styles.removeImageBtn}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className={styles.actionArea}>
          <button
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
          >
            <i className="fas fa-image"></i> 사진 업로드 (
            {existingImages.length + newImages.length}/20)
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            multiple
            onChange={handleFileUpload}
          />
          <button className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={
              content.trim() === "" &&
              newImages.length === 0 &&
              existingImages.length === 0
            }
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
