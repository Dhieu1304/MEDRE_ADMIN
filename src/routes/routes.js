import routeConfig from "../config/routeConfig";
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";

// Public routes
const publicRoutes = [{ path: routeConfig.home, component: HomePage }];

const privateRoutes = [
  { path: routeConfig.home, component: HomePage },
  { path: `${routeConfig.auth}/*`, component: AuthPage, layout: null }
];

export { publicRoutes, privateRoutes };
