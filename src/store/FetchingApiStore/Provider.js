import PropTypes from "prop-types";
import { useMemo, useReducer } from "react";
import { toast } from "react-toastify";
import Context from "./Context";
import reducer, { initState } from "./reducer";
import actions from "./actions";
import { useAuthStore } from "../AuthStore";

function FetchingApiProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  const authStore = useAuthStore();

  const value = useMemo(
    () => ({
      ...state,
      fetchApi: async (callback, { hideErrorToast = false, hideSuccessToast = false } = {}) => {
        dispatch(actions.fetchApi());
        const { success, message, isMustLoginAgain } = await callback();
        // const { success, message, isMustLoginAgain, statusCode } = await callback();
        // console.log({ hideErrorToast, hideSuccessToast });
        // console.log({ success, message, isMustLoginAgain });

        if (success) {
          dispatch(actions.fetchApiSuccess());

          if (message && !hideSuccessToast) toast(message);
        } else {
          dispatch(actions.fetchApiFailed(message));

          if (message && !hideErrorToast) toast(message);
        }

        if (isMustLoginAgain) {
          // console.log("isMustLoginAgain: ", isMustLoginAgain);
          await authStore.logout();
        }

        return { success, message };
      },
      setIsWaitingInput: (isWaiting) => {
        dispatch(actions.setIsWaitingInput(isWaiting));
      }
    }),
    [state]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

FetchingApiProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default FetchingApiProvider;
