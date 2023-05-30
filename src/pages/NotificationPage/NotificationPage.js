import routes from "./routes";
import { NotificationDetail } from "../../features/notification";
import { Route, Routes } from "react-router-dom";

function NotificationPage() {
  return (
    <Routes>
      <Route path={routes.detail} element={<NotificationDetail />} />
    </Routes>
  );
}

export default NotificationPage;
