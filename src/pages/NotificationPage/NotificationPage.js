import { Navigate, Route, Routes } from "react-router-dom";
import { useAbility } from "@casl/react";
import routes from "./routes";
import { CreateNotification, NotificationDetail } from "../../features/notification";
import routeConfig from "../../config/routeConfig";
import { AbilityContext } from "../../store/AbilityStore";
import { notificationActionAbility } from "../../entities/Notification/constant";
import entities from "../../entities/entities";

function NotificationPage() {
  const ability = useAbility(AbilityContext);
  const canAddNotification = ability.can(notificationActionAbility.ADD, entities.NOTIFICATION);
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`${routeConfig.notification}${routes.create}`} replace />} />
      <Route path={routes.detail} element={<NotificationDetail />} />
      <Route
        path={routes.create}
        element={canAddNotification ? <CreateNotification /> : <Navigate to={`${routeConfig.home}`} replace />}
      />
    </Routes>
  );
}

export default NotificationPage;
