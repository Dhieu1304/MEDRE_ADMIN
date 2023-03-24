const authApi = {
  loginByEmail: "/auth/staff/login-by-email"
};

const userApi = {};
const staffApi = {
  staffInfo: () => "/staff/info",
  staffList: () => "/staff/all",
  staffDetail: (id) => `/staff/detail/${id}`,
  expertiseList: () => "/expertise/list"
};

export { authApi, userApi, staffApi };
