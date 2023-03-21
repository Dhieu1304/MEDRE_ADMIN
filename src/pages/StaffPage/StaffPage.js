import { Navigate, Route, Routes } from "react-router-dom";
import { StaffDetail, StaffList } from "../../features/staff";
import routes from "./routes";

export default function StaffPage() {
  return (
    <Routes>
      <Route path={routes.list} element={<StaffList />} />
      <Route path={routes.detail} element={<StaffDetail />} />
      <Route path={routes.default} element={<Navigate to={routes.list} />} />
    </Routes>
  );
}
