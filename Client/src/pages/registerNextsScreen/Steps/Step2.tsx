import React from "react";
import { useFormContext, Controller } from "react-hook-form";

const Step2: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useFormContext();

  const onSubmit = () => {};

  const ageRanges = [
    "0-3",
    "3-6",
    "6-12",
    "12-18",
    "18-24",
    "24-30",
    "30-40",
    "40-50",
    "50-60",
    "60-70",
    "70+",
  ];
  const genders = ["זכר", "נקבה", "שני המינים"];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>קהל יעד</h1>
      <div onSubmit={handleSubmit(onSubmit)}>
        {/* שורה 1: גיל + מין */}
        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label} htmlFor="ageGroup">
              גיל
            </label>
            <Controller
              name="ageGroup"
              control={control}
              rules={{ required: "יש לבחור גיל" }}
              render={({ field }) => (
                <select {...field} id="ageGroup" style={styles.select}>
                  <option value="">בחר גיל</option>
                  {ageRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.ageGroup && (
              <p style={{ color: "red" }}>
                {typeof errors.ageGroup?.message === "string"
                  ? errors.ageGroup.message
                  : ""}
              </p>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label} htmlFor="gender">
              מין
            </label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: "יש לבחור מין" }}
              render={({ field }) => (
                <select {...field} id="gender" style={styles.select}>
                  <option value="">בחר מין</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.gender && (
              <p style={{ color: "red" }}>
                {typeof errors.gender?.message === "string"
                  ? errors.gender.message
                  : ""}
              </p>
            )}
          </div>
        </div>

        {/* שורה 2: פלח שוק */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="specificMarketSegment">
            האם יש פלח שוק ספציפי שאתה מעוניין למקד אליו את הקמפיינים?
          </label>
          <Controller
            name="specificMarketSegment"
            control={control}
            rules={{ required: "שדה חובה" }}
            render={({ field }) => (
              <textarea
                {...field}
                id="specificMarketSegment"
                style={styles.textarea}
              />
            )}
          />
          {errors.specificMarketSegment && (
            <p style={{ color: "red" }}>
              {typeof errors.specificMarketSegment?.message === "string"
                ? errors.specificMarketSegment.message
                : ""}
            </p>
          )}
        </div>

        {/* שורה 3: לקוחות טיפוסיים */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="typicalCustomers">
            אילו לקוחות בדרך כלל משתמשים בשירות הזה?
          </label>
          <Controller
            name="typicalCustomers"
            control={control}
            rules={{ required: "שדה חובה" }}
            render={({ field }) => (
              <textarea
                {...field}
                id="typicalCustomers"
                style={styles.textarea}
              />
            )}
          />
          {errors.typicalCustomers && (
            <p style={{ color: "red" }}>
              {typeof errors.typicalCustomers?.message === "string"
                ? errors.typicalCustomers.message
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
  select: {
    flex: 1,
    padding: "8px 24px 8px 8px",
    fontSize: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23333' d='M0 0L2 2L4 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
    appearance: "none",
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

export default Step2;
