import { Route, Routes } from "react-router-dom";
import BookingList from "../../features/booking/BookingList";
import BookingDetail from "../../features/booking/BookingDetail";

function BookingPage() {
  return (
    <>
      <Routes>
        <Route path="/:id" element={<BookingList />}></Route>
        <Route path="/" element={<BookingDetail />}></Route>
      </Routes>
    </>
  );
}

export default BookingPage;
