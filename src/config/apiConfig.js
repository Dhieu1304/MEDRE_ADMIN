const authApi = {
  loginByEmail: "/auth/staff/login-by-email"
};

const userApi = {};
const staffApi = {
  staffInfo: () => "/staff/info",
  staffList: () => "/staff/all",
  staffDetail: (id) => `/staff/detail/${id}`,
  editStaff: (id) => `/staff/edit/${id}`,
  editMyProfile: () => `/staff/my-profile/edit`
};

const expertiseApi = {
  expertiseList: () => "/expertise/list",
  createExpertise: () => "/expertise/create-expertise"
};

const scheduleApi = {
  schedule: () => "/schedule",
  timeList: () => "/time-schedule/time"
};

export { authApi, userApi, staffApi, scheduleApi, expertiseApi };
