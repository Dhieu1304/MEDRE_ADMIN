import { Route, Routes } from "react-router-dom";
import { SupportList, SupportDetail } from "../../features/support";
import { supportRoutes } from "./routes";

function SupportPage() {
  return (
    <Routes>
      <Route path={supportRoutes.list} element={<SupportList />} />
      <Route path={supportRoutes.detail} element={<SupportDetail />} />
    </Routes>
  );
}

export default SupportPage;
