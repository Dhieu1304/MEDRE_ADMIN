import { FETCHING_API, FETCHING_API_SUCCESS, FETCHING_API_FAILED, SET_WAITING_INPUT } from "./contants";

const initState = {
  isLoading: false,
  isFetchApiError: false,
  fetchApiError: "",
  isWatingInput: false
};

function reducer(state, action) {
  switch (action.type) {
    case FETCHING_API:
      return {
        ...state,
        isLoading: true
      };

    case FETCHING_API_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isFetchApiError: false,
        fetchApiError: ""
      };

    case FETCHING_API_FAILED:
      return {
        ...state,
        isLoading: false,
        isFetchApiError: true,
        fetchApiError: action.payload
      };

    case SET_WAITING_INPUT:
      return {
        ...state,
        isWatingInput: action.payload
      };

    default:
      throw new Error("Invalid action: ", action);
  }
}

export { initState };
export default reducer;
