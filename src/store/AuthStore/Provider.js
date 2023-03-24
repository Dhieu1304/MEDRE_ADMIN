import PropTypes from "prop-types";
import { useMemo, useReducer } from "react";
import { toast } from "react-toastify";
import Context from "./Context";
import reducer, { initState } from "./reducer";
import actions from "./actions";
import authServices from "../../services/authServices";
import staffServices from "../../services/staffServices";

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  const value = useMemo(
    () => ({
      ...state,
      loginByEmail: async (email, password) => {
        dispatch(actions.fetchApi());
        const res = await authServices.loginByEmail(email, password);

        if (res?.success) {
          const { staff, message } = res;
          dispatch(actions.login(staff));
          dispatch(actions.fetchApiSuccess());
          toast.success(message);
          return true;
        }
        const { message } = res;
        dispatch(actions.fetchApiFailed(message));
        toast.success(message);
        return false;
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
      loadStaffInfo: async () => {
        dispatch(actions.fetchApi());
        const res = await staffServices.getStaffInfo();

        if (res?.success) {
          const { staff, message } = res;

          dispatch(actions.login(staff));
          dispatch(actions.fetchApiSuccess());
          toast.success(message);
          return staff;
        }
        const { message } = res;
        dispatch(actions.fetchApiFailed(message));
        toast.success(message);
        return false;
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
