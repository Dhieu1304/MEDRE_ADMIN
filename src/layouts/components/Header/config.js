import routeConfig from "../../../config/routeConfig";
import { authRoutes } from "../../../pages/AuthPage";

export const headerLeftItems = [
  {
    to: routeConfig.home,
    label: "Forum"
  },
  {
    to: routeConfig.home,
    label: "Booking"
  },
  {
    to: routeConfig.home,
    label: "Online"
  }
];

export const headerRightItems = [
  {
    to: routeConfig.auth + authRoutes.login,
    label: "Sign in"
  },
  {
    to: routeConfig.auth + authRoutes.register,
    label: "Sign up"
  }
];

export const headerDropdownMenu = [
  {
    to: routeConfig.home,
    label: "Profile"
  },
  {
    to: routeConfig.home,
    label: "Change password"
  }
];

export const drawerWidth = 240;
