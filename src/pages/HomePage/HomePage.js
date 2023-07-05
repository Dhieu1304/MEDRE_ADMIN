import { Navigate } from "react-router-dom";
import qs from "query-string";
import formatDate from "date-and-time";
import { useAuthStore } from "../../store/AuthStore";
import { staffRoles } from "../../entities/Staff";
import routeConfig from "../../config/routeConfig";
import "../../config/i18n";

function HomePage() {
  const authStore = useAuthStore();

  switch (authStore.staff?.role) {
    case staffRoles.ROLE_ADMIN:
      return <Navigate to={routeConfig.statistics} replace />;
    case staffRoles.ROLE_DOCTOR: {
      const doctorBookingSearchParams = {
        from: formatDate.format(new Date(), "YYYY-MM-DD"),
        to: formatDate.format(new Date(), "YYYY-MM-DD")
      };
      const doctorBookingSearchParamsUrl = qs.stringify(doctorBookingSearchParams);
      // <Box sx={{ ml: 2 }} component={Link} to={`${routeConfig.booking}?${userBookingSearchParamsUrl}`}>
      //         <CalendarMonthIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
      //       </Box>

      return <Navigate to={`${routeConfig.booking}?${doctorBookingSearchParamsUrl}`} replace />;
    }

    case staffRoles.ROLE_NURSE:
      return <Navigate to={routeConfig.schedule} replace />;
    case staffRoles.ROLE_CUSTOMER_SERVICE:
      return <Navigate to={routeConfig.schedule} replace />;
    default:
      return null;
  }
}

export default HomePage;
