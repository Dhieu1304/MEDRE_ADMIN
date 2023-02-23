import { Navigate } from "react-router-dom";
import routeConfig from "../config/routeConfig";
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";
import PaymentPage from "../pages/PaymentPage";

// Public routes
const publicRoutes = [
  { path: routeConfig.home, component: HomePage },
  { path: routeConfig.payment, component: PaymentPage },
  { path: routeConfig.default, component: Navigate, props: { to: routeConfig.home }, layout: null }
];

// Private routes
const privateRoutes = [
  { path: `${routeConfig.auth}/*`, component: AuthPage, layout: null },
  { path: routeConfig.default, component: Navigate, props: { to: routeConfig.auth }, layout: null }
];

export { publicRoutes, privateRoutes };
