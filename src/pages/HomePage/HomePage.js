import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import { staffRoles } from "../../entities/Staff";
import routeConfig from "../../config/routeConfig";
import "../../config/i18n";

function HomePage() {
  const authStore = useAuthStore();
  switch (authStore.staff?.role) {
    case staffRoles.ROLE_ADMIN:
      return <Navigate to={routeConfig.statistics} replace />;
    case staffRoles.ROLE_DOCTOR:
      return <Navigate to={routeConfig.booking} replace />;

    case staffRoles.ROLE_NURSE:
      return <Navigate to={routeConfig.schedule} replace />;
    case staffRoles.ROLE_CUSTOMER_SERVICE:
      return <Navigate to={routeConfig.schedule} replace />;
    default:
      return null;
  }
}

export default HomePage;
