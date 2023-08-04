import { Route, Routes } from "react-router-dom";
import { ScheduleList } from "../../features/schedule";
import routes from "./routes";

export default function SchedulePage() {
  return (
    <Routes>
      <Route path={routes.list} element={<ScheduleList />} />

      {/* <Route path={routes.default} element={<Navigate to={routes.list} />} /> */}
    </Routes>
  );
}
