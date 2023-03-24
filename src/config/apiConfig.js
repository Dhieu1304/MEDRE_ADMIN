const authApi = {
  loginByEmail: "/auth/login-by-email"
};

const userApi = {
  userInfo: "/user/info"
};
const staffApi = {
  staffList: () => "/staff/all",
  staffDetail: (id) => `/staff/detail/${id}`,
  expertiseList: () => "/expertise/list"
};

export { authApi, userApi, staffApi };
