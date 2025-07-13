import { useState } from "react";
import styles from "./EditProfileModal.module.css";
import { updateProfile } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fullName: string, image?: File | undefined) => Promise<void>;
  currentName: string;
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  currentName,
}: EditProfileModalProps) => {
  const { user, setUser, accessToken } = useAuth();
  const [fullName, setFullName] = useState(currentName);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !user?._id) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("fullName", fullName);
    if (selectedImage) {
      formData.append("profilePicture", selectedImage);
    }

    try {
      const updatedUser = await updateProfile(user._id, formData, accessToken);
      setUser(updatedUser.user);
      toast.success("פרופיל עודכן בהצלחה!");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "שגיאה בעדכון הפרופיל"
      );
      console.error("Update Profile Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={styles.modal}>
        <h2>עריכת פרטים</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>שם מלא</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>תמונת פרופיל</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className={styles.imagePreview}
              />
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "שומר..." : "שמור שינויים"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
