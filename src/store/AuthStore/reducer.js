import { FETCHING_API, FETCHING_API_SUCCESS, FETCHING_API_FAILED, LOGIN, LOGOUT, SET_USER } from "./contants";

const initState = {
  user: {},
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
        user: action.payload
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isLogin: false,
        user: {}
      };
    }
    case SET_USER:
      return {
        ...state,
        user: action.payload
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
