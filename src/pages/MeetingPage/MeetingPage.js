import { Navigate, Route, Routes } from "react-router-dom";
import routes from "./routes";
import { MeetingDetail } from "../../features/meeting";

function MeetingPage() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/" replace />} />
      <Route path={routes.detail} element={<MeetingDetail />} />
    </Routes>
  );
}
export default MeetingPage;
