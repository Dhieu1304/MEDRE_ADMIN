import * as React from "react";

import { Navigate, Route, Routes } from "react-router-dom";

import routeConfig from "../../config/routeConfig";
import { authRoutes } from "./routes";

import { ForgetPassword, Login } from "../../features/auth";

export default function AuthPage() {
  return (
    <Routes>
      <Route path={authRoutes.login} element={<Login />} />
      <Route path={authRoutes.forgetPassword} element={<ForgetPassword />} />
      <Route path={authRoutes.default} element={<Navigate to={routeConfig.auth + authRoutes.login} />} />
    </Routes>
  );
}
