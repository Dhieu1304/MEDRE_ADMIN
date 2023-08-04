import { FETCHING_API, FETCHING_API_SUCCESS, FETCHING_API_FAILED, LOGIN, LOGOUT, SET_STAFF } from "./contants";

const initState = {
  staff: {},
  isLogin: false,
  isLoading: false,
  isFetchApiError: false,
  fetchApiError: ""
};

function reducer(state, action) {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        isLogin: true,
        staff: action.payload
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isLogin: false,
        staff: {}
      };
    }
    case SET_STAFF:
      return {
        ...state,
        staff: action.payload
      };

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

    default:
      throw new Error("Invalid action: ", action);
  }
}

export { initState };
export default reducer;
