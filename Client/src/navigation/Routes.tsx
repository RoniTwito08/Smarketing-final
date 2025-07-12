import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import DashboardLayoutBasic from "../components/sideDrawer/SideDrawer";
import LandingPage from "../pages/landingPageScreen/LandingPage";
import LP from "../pages/LPScreen/LandingPage";
import FormsPage from "../pages/LoginSignupScreen/LoginSignupPage/LoginSignupPage";
import RegisterBase from "../pages/registerNextsScreen/RegisterBase";
import { GoogleAdsAnalytics } from "../components/GoogleAdsAnalytics/GoogleAdsAnalytics";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LP />} />
      <Route path="/forms" element={<FormsPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayoutBasic />
          </ProtectedRoute>
        }
      />
      <Route path="/stepper" element={<RegisterBase />} />
      <Route
        path="/google-ads"
        element={
          <ProtectedRoute>
            <GoogleAdsAnalytics />
          </ProtectedRoute>
        }
      />
    </Routes>
    
  );
};

export default AppRouter;
