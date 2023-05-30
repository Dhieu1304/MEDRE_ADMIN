import { Navigate, Route, Routes } from "react-router-dom";
import routes from "./routes";
import { CreateNotification, NotificationDetail } from "../../features/notification";

function NotificationPage() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notification/create" replace />} />
      <Route path="/create" element={<CreateNotification />} />
      <Route path={routes.detail} element={<NotificationDetail />} />
    </Routes>
  );
}

export default NotificationPage;
