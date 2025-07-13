import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import styles from "./Step4.module.css";

const Step4: React.FC = () => {
  const { control } = useFormContext();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [businessImagesPreview, setBusinessImagesPreview] = useState<string[]>([]);

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const handleBusinessImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const previews: string[] = [];
      Array.from(files).forEach((file, idx) => {
        void idx;
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) setBusinessImagesPreview(previews);
        };
        reader.readAsDataURL(file);
      });
      onChange(files);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>מותג וזיהוי ויזואלי</h1>

      {/* לוגו */}
      <div className={styles.question}>
        <p>האם יש לך לוגו לעסק?</p>
        <Controller
          name="logoFile"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <label className={styles.fileUploadLabel}>
              <input
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={(e) => handleLogoChange(e, field.onChange)}
              />
              בחר לוגו
            </label>
          )}
        />
        {logoPreview && (
          <img src={logoPreview} alt="Logo Preview" className={styles.logoPreview} />
        )}
      </div>

      {/* תמונות עסק */}
      <div className={styles.question}>
        <p>האם יש לך תמונות נוספות של העסק?</p>
        <Controller
          name="businessImageFiles"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <label className={styles.fileUploadLabel}>
              <input
                type="file"
                accept="image/*"
                multiple
                className={styles.hiddenInput}
                onChange={(e) => handleBusinessImagesChange(e, field.onChange)}
              />
              בחר תמונות
            </label>
          )}
        />
        {businessImagesPreview.length > 0 && (
          <div className={styles.imagesGrid}>
            {businessImagesPreview.map((src, i) => (
              <img key={i} src={src} alt={`business-${i}`} className={styles.imageThumb} />
            ))}
          </div>
        )}
      </div>

      {/* סגנון עיצובי */}
      <div className={styles.question}>
        <p>האם יש סגנון עיצובי מועדף (מודרני, מינימליסטי, יצירתי...)?</p>
        <Controller
          name="designPreferences"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <textarea {...field} placeholder="נא לפרט כאן..." className={styles.textarea} />
          )}
        />
      </div>

      {/* קישורים חברתיים */}
      <div className={styles.question}>
        <p>האם יש לך חשבונות עסקיים ברשתות החברתיות? הכנס/י קישור לכל פלטפורמה:</p>
        {["Facebook", "Instagram", "TikTok", "LinkedIn", "Other"].map((platform) => (
          <div key={platform} className={styles.socialRow}>
            <label className={styles.socialLabel}>{platform}:</label>
            <Controller
              name={`socialLinks.${platform.toLowerCase()}`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  type="url"
                  placeholder={`קישור ל-${platform}`}
                  className={styles.input}
                />
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step4;
