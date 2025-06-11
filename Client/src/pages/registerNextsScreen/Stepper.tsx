import React, { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Step1 from "./Steps/Step1";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";
import Step5 from "./Steps/Step5";
import { FormValues } from "../../types/businessInfo";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { businessInfoService } from "../../services/besinessInfo.service";

const steps = [<Step1 />, <Step3 />, <Step4 />, <Step5 />]; // מערך של קומפוננטות
const stepsHeader = [
  "מידע כללי",
  // "קהל יעד",
  "מוצרים ושירותים",
  "מותג וזיהוי ויזואלי",
  "מטרות עסקיות",
];

const MultiStepForm: React.FC = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState<number>(0);
  const methods = useForm<FormValues>();

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("Form data:", data);

    const mergedPhoneNumber =
      data.phonePrefix && data.phoneNumberBody
        ? `${data.phonePrefix}${data.phoneNumberBody}`
        : undefined;

    const formattedData = {
      ...data,
      phoneNumber: mergedPhoneNumber,
    };

    delete formattedData.phonePrefix;
    delete formattedData.phoneNumberBody;

    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    const userId = JSON.parse(user!)._id;

    if (!token || !userId) {
      toast.error("שגיאה בהתחברות, אנא התחבר שוב");
      return;
    }

    try {
      await businessInfoService.createBusinessInfo(
        formattedData,
        userId,
        token
      );
      toast.success("הטופס נשלח בהצלחה! הנך מועבר לאזור האישי");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error: any) {
      console.error("Error updating business info:", error);
      toast.error(error.message || "שגיאה בעדכון המידע, אנא נסה שוב");
    }
  };

  return (
    <FormProvider {...methods} data-testid="form-provider">
      <form
        className="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ height: "100%" }}
      >
        <ToastContainer />
        <Box
          data-testid="multi-step-form"
          sx={{
            direction: "rtl",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            flexShrink: 0,
            padding: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          {/* <Stepper
  activeStep={activeStep}
  sx={{ direction: "rtl", flexDirection: "row-reverse" }} // <-- הוספה חשובה
></Stepper> */}
          {/* Stepper למעלה */}
          <Stepper
            activeStep={activeStep}
            sx={{ direction: "rtl", flexDirection: "row-reverse" }}
          >
            {steps.map((_, index) => (
              <Step key={index}>
                <StepLabel
                  sx={{
                    flexDirection: "row-reverse", // הופך את סדר: מספר -> טקסט
                    "& .MuiStepLabel-label": {
                      textAlign: "right",
                    },
                  }}
                >
                  {stepsHeader[index]}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* תוכן השלב */}

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {steps[activeStep]}
          </Box>

          {/* כפתורי שליטה */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              חזור
            </Button>
            {activeStep === steps.length ? (
              <Button type="submit" variant="contained">
                שלח
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                הבא
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
};

export default MultiStepForm;
