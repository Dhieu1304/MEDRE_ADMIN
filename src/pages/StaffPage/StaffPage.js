import { Route, Routes } from "react-router-dom";
import { StaffList } from "../../features/staff";
import { staffRoutes } from "./routes";
import StaffDetailPage from "./StaffDetailPage";

export default function StaffPage() {
  return (
    <Routes>
      <Route path={staffRoutes.list} element={<StaffList />} />
      <Route path={`${staffRoutes.detail}/*`} element={<StaffDetailPage />} />
    </Routes>
  );
}
