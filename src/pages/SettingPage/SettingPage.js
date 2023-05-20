import { Route, Routes } from "react-router-dom";

import { SettingList } from "../../features/setting";
import { settingRoutes } from "./routes";

export default function SettingPage() {
  return (
    <Routes>
      <Route path={settingRoutes.list} element={<SettingList />} />
    </Routes>
  );
}
