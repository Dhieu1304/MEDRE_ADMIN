import { Route, Routes } from "react-router-dom";
import { BookingDetail, BookingList } from "../../features/booking";

function BookingPage() {
  return (
    <Routes>
      <Route path="/" element={<BookingList />} />
      <Route path="/id" element={<BookingDetail />} />
    </Routes>
  );
}

export default BookingPage;
