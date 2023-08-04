const patientRoutes = {
  list: "/",
  detail: "/:patientId",
  // /:patientId/schedule
  default: "/*"
};

const patientDetailRoutes = {
  detail: "/",
  booking: "/booking"
};

export { patientRoutes, patientDetailRoutes };
