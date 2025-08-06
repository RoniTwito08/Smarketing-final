import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import AppRoutes from "./navigation/Routes";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// modify the theme to support RTL DO NOT REMOVE
const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create RTL theme
const rtlTheme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: `"Assistant", "Arial", sans-serif`,
  },
  // Add any other theme customizations here
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          direction: "rtl",
          
        },
      },
    },
  },
});

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CacheProvider value={rtlCache}>
              <ThemeProvider theme={rtlTheme}>
                <div dir="rtl">
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
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
                </div>
              </ThemeProvider>
            </CacheProvider>
          </LocalizationProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
