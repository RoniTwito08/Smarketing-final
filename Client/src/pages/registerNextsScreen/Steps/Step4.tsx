import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

const Step4: React.FC = () => {
  const { control /*watch*/ } = useFormContext();
  //const watchedFiles = watch("logoFiles");

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [businessImagesPreview, setBusinessImagesPreview] = useState<string[]>(
    []
  );

  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);

  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const handleImageChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   onChange: (...event: any[]) => void
  // ) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setSelectedImage(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }

  //   onChange(e.target.files); // update react hook form
  // };

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
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
      Array.from(files).forEach((file, index) => {
        void index;
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setBusinessImagesPreview(previews);
          }
        };
        reader.readAsDataURL(file);
      });
      onChange(files);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>מותג וזיהוי ויזואלי</h1>

      {/* שורה 1 */}
      {/* לוגו */}
      <div style={styles.question}>
        <p>האם יש לך לוגו לעסק?</p>
        <Controller
          name="logoFile"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <label style={styles.fileUploadLabel}>
              <input
                type="file"
                accept="image/*"
                style={styles.hiddenInput}
                onChange={(e) => handleLogoChange(e, field.onChange)}
              />
              בחר לוגו
            </label>
          )}
        />
        {logoPreview && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={logoPreview}
              alt="Logo Preview"
              style={{ maxWidth: "100px", borderRadius: "4px" }}
            />
          </div>
        )}
      </div>

      {/* תמונות נוספות של העסק */}
      <div style={styles.question}>
        <p>האם יש לך תמונות נוספות של העסק?</p>
        <Controller
          name="businessImageFiles"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <label style={styles.fileUploadLabel}>
              <input
                type="file"
                accept="image/*"
                multiple
                style={styles.hiddenInput}
                onChange={(e) => handleBusinessImagesChange(e, field.onChange)}
              />
              בחר תמונות
            </label>
          )}
        />
        {businessImagesPreview.length > 0 && (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {businessImagesPreview.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`business-${index}`}
                style={{ maxWidth: "100px", borderRadius: "4px" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* שורה 2 */}
      <div style={styles.question}>
        <p>
          האם יש סגנון עיצובי מסוים שאתה מעדיף (לדוגמה: מודרני, מינימליסטי,
          יצירתי)?
        </p>
        <Controller
          name="designPreferences"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <textarea
              {...field}
              placeholder="נא לפרט כאן..."
              style={styles.textarea}
            ></textarea>
          )}
        />
      </div>

      {/* שורה 3 */}
      <div style={styles.question}>
        <p>
          האם יש לך חשבונות עסקיים ברשתות החברתיות? הכנס קישור עבור כל פלטפורמה
          שברשותך:
        </p>

        {["Facebook", "Instagram", "TikTok", "LinkedIn", "Other"].map(
          (platform) => (
            <div key={platform} style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                {platform}:
              </label>
              <Controller
                name={`socialLinks.${platform.toLowerCase()}`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    placeholder={`הכנס קישור ל-${platform}`}
                    style={styles.input}
                  />
                )}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  } as const,
  container: {
    direction: "rtl",
    fontFamily: "Assistant, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "10px",
    backgroundColor: "transparent",
    display: "inline-block",
    maxHeight: "400px",
    overflowY: "auto",
  },
  header: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
  },
  question: {
    marginBottom: "20px",
  },
  fileUploadLabel: {
    display: "inline-block",
    padding: "10px 20px",
    color: "#fff",
    backgroundColor: "#808080",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "14px",
  } as const,
  fileUploadLabelHover: {
    backgroundColor: "#6c6c6c",
  } as const,
  hiddenInput: {
    display: "none",
  } as const,
  textarea: {
    width: "100%",
    height: "80px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "14px",
  } as const,
  checkboxGroup: {
    marginBottom: "10px",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  } as const,
} as const;

export default Step4;
