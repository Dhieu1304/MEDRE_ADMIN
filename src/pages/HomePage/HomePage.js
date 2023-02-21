import { Navigate } from "react-router-dom";
import routeConfig from "../../config/routeConfig";
import { useAuthStore } from "../../store/AuthStore/hooks";

function HomePage() {
  const authStore = useAuthStore();

  return authStore.isLogin ? <span>HomePage</span> : <Navigate to={routeConfig.auth} />;
}

export default HomePage;
