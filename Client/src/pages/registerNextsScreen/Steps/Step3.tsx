import React from "react";
import { useFormContext, Controller } from "react-hook-form";

const Step3: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useFormContext();

  const onSubmit = () => {};

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>מוצרים ושירותים</h1>
      <div onSubmit={handleSubmit(onSubmit)}>
        {/* שורה 1: מה השירות שאתה מספק? + שירות חדש */}
        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label} htmlFor="serviceDescription">
              מה השירות שאתה מספק?
            </label>
            <Controller
              name="serviceDescription"
              control={control}
              defaultValue=""
              rules={{ required: "שדה חובה" }}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="serviceDescription"
                  style={styles.textarea}
                />
              )}
            />
            {errors.serviceDescription && (
              <p style={{ color: "red" }}>
                {typeof errors.serviceDescription?.message === "string"
                  ? errors.serviceDescription.message
                  : ""}
              </p>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label} htmlFor="uniqueService">
              האם יש שירות חדש או ייחודי שאתה משיק כרגע?
            </label>
            <Controller
              name="uniqueService"
              control={control}
              defaultValue=""
              rules={{ required: "שדה חובה" }}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="uniqueService"
                  style={styles.textarea}
                />
              )}
            />
            {errors.uniqueService && (
              <p style={{ color: "red" }}>
                {typeof errors.uniqueService?.message === "string"
                  ? errors.uniqueService.message
                  : ""}
              </p>
            )}
          </div>
        </div>

        {/* שורה 2: חבילות שירות מיוחדות */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="specialPackages">
            האם יש חבילות שירות מיוחדות שאתה מציע?
          </label>
          <Controller
            name="specialPackages"
            control={control}
            defaultValue=""
            rules={{ required: "שדה חובה" }}
            render={({ field }) => (
              <textarea
                {...field}
                id="specialPackages"
                style={styles.textarea}
              />
            )}
          />
          {errors.specialPackages && (
            <p style={{ color: "red" }}>
              {typeof errors.specialPackages?.message === "string"
                ? errors.specialPackages.message
                : ""}
            </p>
          )}
        </div>

        {/* שורה 3: תמריצים מיוחדים ללקוחות חדשים */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="incentives">
            האם יש תמריצים מיוחדים ללקוחות חדשים (לדוגמה: חודש ראשון חינם, מתנה
            ברכישה ראשונה)?
          </label>
          <Controller
            name="incentives"
            control={control}
            defaultValue=""
            rules={{ required: "שדה חובה" }}
            render={({ field }) => (
              <textarea {...field} id="incentives" style={styles.textarea} />
            )}
          />
          {errors.incentives && (
            <p style={{ color: "red" }}>
              {typeof errors.incentives?.message === "string"
                ? errors.incentives.message
                : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
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
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  label: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "8px",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    fontSize: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
} as const;

export default Step3;
