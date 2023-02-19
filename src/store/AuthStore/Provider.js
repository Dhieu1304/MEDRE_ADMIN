import PropTypes from "prop-types";
import { useMemo, useReducer } from "react";
import Context from "./Context";
import reducer, { initState } from "./reducer";
import actions from "./actions";

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  const value = useMemo(
    () =>
      ({
        ...state,
        loginByEmail: async () => {
          dispatch(actions.login("sang"));
          return false;
        }
      }[state])
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;
