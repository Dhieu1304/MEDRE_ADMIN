import PropTypes from "prop-types";
import { useMemo, useReducer } from "react";
import Context from "./Context";
import reducer, { initState } from "./reducer";
import actions from "./actions";

function FetchingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  const value = useMemo(
    () =>
      ({
        ...state,
        fetchApi: () => {
          dispatch(actions.fetchApi());
        },
        fetchApiSuccess: () => {
          dispatch(actions.fetchApiSuccess());
        },
        fetchApiFailed: (error) => {
          dispatch(actions.fetchApiFailed(error));
        }
      }[state])
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

FetchingProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default FetchingProvider;
