import { Navigate, Route, Routes } from "react-router-dom";
import { StaffDetail, StaffList } from "../../features/staff";
import { FetchingApiProvider } from "../../store/FetchingApiStore";
import routes from "./routes";

export default function StaffPage() {
  return (
    <Routes>
      <Route
        path={routes.list}
        element={
          <FetchingApiProvider>
            <StaffList />
          </FetchingApiProvider>
        }
      />
      <Route
        path={routes.detail}
        element={
          <FetchingApiProvider>
            <StaffDetail />
          </FetchingApiProvider>
        }
      />
      <Route path={routes.default} element={<Navigate to={routes.list} />} />
    </Routes>
  );
}
