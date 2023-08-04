import { FETCHING_API, FETCHING_API_SUCCESS, FETCHING_API_FAILED, SET_WAITING_INPUT } from "./contants";

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

const setIsWaitingInput = (payload) => ({
  type: SET_WAITING_INPUT,
  payload
});

const actions = {
  fetchApi,
  fetchApiSuccess,
  fetchApiFailed,
  setIsWaitingInput
};
export default actions;
