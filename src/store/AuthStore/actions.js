import { LOGIN, LOGOUT, SET_USER } from "./contants";

const login = (payload) => ({
  type: LOGIN,
  payload
});

const logout = (payload) => ({
  type: LOGOUT,
  payload
});

const setUser = (payload) => ({
  type: SET_USER,
  payload
});

const actions = {
  login,
  logout,
  setUser
};
export default actions;
