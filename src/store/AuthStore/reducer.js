import { LOGIN, LOGOUT, SET_USER } from "./contants";

const initState = {
  user: {},
  isLogin: false
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

    default:
      throw new Error("Invalid action: ", action);
  }
}

export { initState };
export default reducer;
