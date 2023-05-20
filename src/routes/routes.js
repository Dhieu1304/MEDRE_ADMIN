import { Navigate } from "react-router-dom";
import routeConfig from "../config/routeConfig";
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";
import PaymentPage from "../pages/PaymentPage";
import StaffPage from "../pages/StaffPage/StaffPage";
import SchedulePage from "../pages/SchedulePage";
import MeetingPage from "../pages/MeetingPage";
import UserPage from "../pages/UserPage/UserPage";
import PatientPage from "../pages/PatientPage/PatientPage";

// Public routes
const publicRoutes = [
  { path: `${routeConfig.auth}/*`, component: AuthPage, layout: null },
  { path: routeConfig.default, component: Navigate, props: { to: routeConfig.auth }, layout: null }
];

const privateRoutes = [
  { path: routeConfig.home, component: HomePage },
  { path: `${routeConfig.staff}/*`, component: StaffPage },
  { path: `${routeConfig.user}/*`, component: UserPage },
  { path: `${routeConfig.patient}/*`, component: PatientPage },
  { path: `${routeConfig.schedule}/*`, component: SchedulePage },
  { path: `${routeConfig.payment}/*`, component: PaymentPage },
  { path: `${routeConfig.meeting}/*`, component: MeetingPage, layout: null },
  { path: routeConfig.default, component: Navigate, props: { replace: true, to: routeConfig.home }, layout: null }
];

export { publicRoutes, privateRoutes };
