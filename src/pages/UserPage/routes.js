const userRoutes = {
  list: "/",
  detail: "/:userId",
  // /:userId/schedule
  default: "/*"
};

const userDetailRoutes = {
  detail: "/",
  booking: "/booking"
};

export { userRoutes, userDetailRoutes };
