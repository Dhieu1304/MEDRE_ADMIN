import { Route, Routes } from "react-router-dom";
import { TicketList, TicketDetail } from "../../features/ticket";
import { supportRoutes } from "./routes";

function SupportPage() {
  return (
    <Routes>
      <Route path={supportRoutes.list} element={<TicketList />} />
      <Route path={supportRoutes.detail} element={<TicketDetail />} />
    </Routes>
  );
}

export default SupportPage;
