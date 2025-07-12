import React from "react";
import styles from "./RegisterBase.module.css";
import MultiStepForm from "./Stepper";

const RegisterBase: React.FC = () => {
  return (
    <div className={styles.formsPageWrapper}>
      <div className={`${styles.container}`}>
        <MultiStepForm />
      </div>
    </div>
  );
};

export default RegisterBase;
