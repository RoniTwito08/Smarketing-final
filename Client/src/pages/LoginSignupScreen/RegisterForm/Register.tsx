import React from "react";
import styles from "./Register.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import "boxicons/css/boxicons.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser, loginUser } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

type FormInputs = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (
      errors.confirmPassword?.type != "required" &&
      data.password !== data.confirmPassword
    ) {
      toast.error("הסיסמאות אינן תואמות");
    } else {
      try {
        await registerUser(data.email, data.password, data.fullName);
        toast.success("נרשמת בהצלחה! הנך מועבר לעמוד פרטי עסק");

        const userData = await loginUser(data.email, data.password);
        if (!userData || !userData.accessToken) {
          throw new Error("Invalid login response");
        }

        login(
          {
            _id: userData._id,
            email: data.email,
            fullName: userData.fullName,
            profilePicture: userData.profilePicture,
            role: "user",
            expertise: [],
          },
          userData.accessToken
        );

        setTimeout(() => {
          navigate("/stepper");
        }, 1500);
      } catch (error: any) {
        console.error("Registration error:", error);

        const errorMessage = error?.message || "שגיאה בהרשמה, אנא נסה שוב";

        if (errorMessage.includes("email")) {
          toast.error("האימייל שהוזן כבר קיים במערכת");
        } else {
          toast.error(errorMessage);
        }
      }
    }
  };

  const handleErrors = () => {
    if (
      errors.fullName?.type === "required" ||
      errors.email?.type === "required" ||
      errors.password?.type === "required" ||
      errors.confirmPassword?.type === "required"
    ) {
      toast.error("יש למלא את כל השדות");
    }

    if (
      errors.fullName?.type != "required" &&
      errors.fullName?.type === "minLength"
    ) {
      toast.error("שם משתמש חייב להכיל 3 תווים לפחות");
    }

    if (errors.email?.type != "required" && errors.email?.type === "pattern") {
      toast.error("יש להזין כתובת מייל חוקית");
    }

    if (
      errors.password?.type != "required" &&
      errors.password?.type === "minLength"
    ) {
      toast.error("סיסמה חייבת להכיל 6 תווים לפחות");
    } else if (
      errors.password?.type != "required" &&
      errors.password?.type === "pattern"
    ) {
      toast.error(
        "הסיסמה חייבת להכיל לפחות אות גדולה, אות קטנה, מספר ותו מיוחד"
      );
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit, handleErrors)}
    >
      <ToastContainer />
      <h1>הרשמה</h1>

      <div className={styles.inputBox}>
        <input
          type="text"
          placeholder="שם מלא"
          {...register("fullName", { required: true, minLength: 3 })}
        />
        <i className="bx bx-user"></i>
      </div>

      <div className={styles.inputBox}>
        <input
          type="email"
          placeholder="מייל"
          {...register("email", { required: true })}
        />
        <i className="bx bx-envelope"></i>
      </div>

      <div className={styles.inputBox}>
        <input
          type="password"
          placeholder="סיסמה"
          {...register("password", {
            required: true,
            minLength: 6,
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
              message:
                "הסיסמה חייבת להכיל לפחות אות גדולה, אות קטנה, מספר ותו מיוחד",
            },
          })}
        />
        <i className="bx bxs-lock-alt"></i>
      </div>

      <div className={styles.inputBox}>
        <input
          type="password"
          placeholder="אימות סיסמה"
          {...register("confirmPassword", { required: true })}
        />
        <i className="bx bxs-lock-alt"></i>
      </div>

      <button type="submit" className={styles.btn}>
        הרשמה
      </button>
    </form>
  );
};

export default RegisterForm;
