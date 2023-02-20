import { FETCHING_API, FETCHING_API_SUCCESS, FETCHING_API_FAILED } from "./contants";

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
  fetchApi,
  fetchApiSuccess,
  fetchApiFailed
};
export default actions;
