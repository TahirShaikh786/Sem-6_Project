import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./Service/auth.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import microphone from "./assets/img/microphone.png";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <StrictMode>
      <App />
      <ToastContainer
        stacked
        toastStyle={{ backgroundColor: "black" }}
        position="bottom-right"
      />
      <aside>
        <img src={microphone} alt="microphone" />
      </aside>
    </StrictMode>
  </AuthProvider>
);
