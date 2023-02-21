import routeConfig from "../config/routeConfig";
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";

// Public routes
const publicRoutes = [{ path: routeConfig.home, component: HomePage }];

// Private routes
const privateRoutes = [
  { path: routeConfig.home, component: HomePage, layout: null },
  { path: `${routeConfig.auth}/*`, component: AuthPage, layout: null }
];

export { publicRoutes, privateRoutes };
