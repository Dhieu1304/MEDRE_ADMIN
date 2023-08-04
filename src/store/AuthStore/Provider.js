import PropTypes from "prop-types";
import { useMemo, useReducer } from "react";
import Context from "./Context";
import reducer, { initState } from "./reducer";
import actions from "./actions";
import authServices from "../../services/authServices";

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  const value = useMemo(
    () => ({
      ...state,
      login: async (emailOrUsernameOrPhoneNumber, password) => {
        dispatch(actions.fetchApi());

        const res = await authServices.login(emailOrUsernameOrPhoneNumber, password);

        if (res?.success) {
          const { staff, message } = res;
          dispatch(actions.login(staff));
          dispatch(actions.fetchApiSuccess());
          return {
            success: true,
            message
          };
        }
        const { message } = res;
        dispatch(actions.fetchApiFailed(message));
        return {
          success: false,
          message
        };
      },
      logout: async () => {
        dispatch(actions.fetchApi());
        const res = await authServices.logout();
        if (res?.success) {
          dispatch(actions.logout());
          dispatch(actions.fetchApiSuccess());
        } else {
          dispatch(actions.logout());
          dispatch(actions.fetchApiSuccess());
        }
      },
      autoLogin: (staff) => {
        if (staff) {
          dispatch(actions.login(staff));
        }
      },
      setStaff: (staff) => {
        dispatch(actions.setStaff(staff));
      }
    }),
    [state]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;
