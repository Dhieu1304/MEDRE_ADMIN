import { Navigate, Route, Routes } from "react-router-dom";
import { useAbility } from "@casl/react";
import { StaffList } from "../../features/staff";
import { staffRoutes } from "./routes";
import StaffDetailPage from "./StaffDetailPage";
import routeConfig from "../../config/routeConfig";
import { staffActionAbility } from "../../entities/Staff";
import { AbilityContext } from "../../store/AbilityStore";
import entities from "../../entities/entities";

export default function StaffPage() {
  const ability = useAbility(AbilityContext);
  const canViewAllStaff = ability.can(staffActionAbility.VIEW_ALL, entities.STAFF);

  return (
    <Routes>
      {canViewAllStaff && <Route path={staffRoutes.list} element={<StaffList />} />}
      <Route path={`${staffRoutes.detail}/*`} element={<StaffDetailPage />} />
      <Route path={staffRoutes.default} element={<Navigate to={routeConfig.home} replace />} />
    </Routes>
  );
}
