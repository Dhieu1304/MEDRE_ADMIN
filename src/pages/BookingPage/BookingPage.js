import { Route, Routes } from "react-router-dom";
import BookingList from "../../features/booking/BookingList";
import BookingDetail from "../../features/booking/BookingDetail";

function BookingPage() {
  return (
    <Routes>
      <Route path="/" element={<BookingList />} />
      <Route path="/id" element={<BookingDetail />} />
    </Routes>
  );
}

export default BookingPage;
