import { Navigate, Route, Routes } from "react-router-dom";
import routes from "./routes";
import { CreateNotification, NotificationDetail } from "../../features/notification";
import routeConfig from "../../config/routeConfig";

function NotificationPage() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`${routeConfig.notification}${routes.create}`} replace />} />
      <Route path={routes.create} element={<CreateNotification />} />
      <Route path={routes.detail} element={<NotificationDetail />} />
    </Routes>
  );
}

export default NotificationPage;
