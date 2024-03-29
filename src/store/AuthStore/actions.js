import { FETCHING_API, FETCHING_API_FAILED, FETCHING_API_SUCCESS, LOGIN, LOGOUT, SET_STAFF } from "./contants";

const login = (payload) => ({
  type: LOGIN,
  payload
});

const logout = (payload) => ({
  type: LOGOUT,
  payload
});

const setStaff = (payload) => ({
  type: SET_STAFF,
  payload
});

const fetchApi = (payload) => ({
  type: FETCHING_API,
  payload
});

const fetchApiSuccess = (payload) => ({
  type: FETCHING_API_SUCCESS,
  payload
});

const fetchApiFailed = (payload) => ({
  type: FETCHING_API_FAILED,
  payload
});

const actions = {
  login,
  logout,
  setStaff,
  fetchApi,
  fetchApiSuccess,
  fetchApiFailed
};

export default actions;
