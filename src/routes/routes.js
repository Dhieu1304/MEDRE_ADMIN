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
import SettingPage from "../pages/SettingPage/SettingPage";
import BookingPage from "../pages/BookingPage/BookingPage";
import NotificationPage from "../pages/NotificationPage";
import VerificationPage from "../pages/VerificationPage";
import AuthLayout from "../layouts/AuthLayout";

// Public routes
const publicRoutes = [
  { path: `${routeConfig.auth}/*`, component: AuthPage, layout: AuthLayout },
  { path: routeConfig.default, component: Navigate, props: { to: routeConfig.auth }, layout: AuthLayout },
  { path: `${routeConfig.verification}/*`, component: VerificationPage, layout: AuthLayout }
];

const privateRoutes = [
  { path: routeConfig.home, component: HomePage },
  { path: `${routeConfig.staff}/*`, component: StaffPage },
  { path: `${routeConfig.user}/*`, component: UserPage },
  { path: `${routeConfig.patient}/*`, component: PatientPage },
  { path: `${routeConfig.schedule}/*`, component: SchedulePage },
  { path: `${routeConfig.setting}/*`, component: SettingPage },
  { path: `${routeConfig.booking}/*`, component: BookingPage },
  { path: `${routeConfig.payment}/*`, component: PaymentPage },
  { path: `${routeConfig.notification}/*`, component: NotificationPage },
  { path: `${routeConfig.verification}/*`, component: VerificationPage, layout: AuthLayout },
  { path: `${routeConfig.meeting}/*`, component: MeetingPage, layout: null },
  { path: routeConfig.default, component: Navigate, props: { replace: true, to: routeConfig.home }, layout: null }
];

export { publicRoutes, privateRoutes };
