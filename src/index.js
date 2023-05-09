import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { AuthProvider } from "./store/AuthStore";
import { AppConfigProvider } from "./store/AppConfigStore";
import { FetchingApiProvider } from "./store/FetchingApiStore";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AppConfigProvider>
    <FetchingApiProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </FetchingApiProvider>
  </AppConfigProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
