import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./utiles/index.css";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <App />
  // </StrictMode>
);
