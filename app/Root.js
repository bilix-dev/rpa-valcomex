"use client";
import "react-toastify/dist/ReactToastify.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "react-svg-map/lib/index.css";
import "leaflet/dist/leaflet.css";
import "./scss/app.scss";

import { Provider } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import store from "@/store";
import useDarkmode from "@/hooks/useDarkMode";
import configureValidations from "helpers/validations";
import { SessionProvider } from "next-auth/react";

configureValidations();

const TOAST_OPTIONS = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const ToastWrapper = ({ children }) => {
  const [isDark] = useDarkmode();
  return (
    <>
      <ToastContainer {...TOAST_OPTIONS} theme={isDark ? "dark" : "light"} />
      {children}
    </>
  );
};

export default function Root({ children, session }) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <ToastWrapper>{children}</ToastWrapper>
      </Provider>
    </SessionProvider>
  );
}
