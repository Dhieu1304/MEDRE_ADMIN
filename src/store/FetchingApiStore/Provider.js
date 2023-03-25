import PropTypes from "prop-types";
import { useMemo, useReducer } from "react";
import Context from "./Context";
import reducer, { initState } from "./reducer";
import actions from "./actions";

function FetchingApiProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  const value = useMemo(
    () => ({
      ...state,
      fetchApi: async (callback) => {
        dispatch(actions.fetchApi());
        const { success, error } = await callback();

        if (success) {
          dispatch(actions.fetchApiSuccess());
        } else {
          dispatch(actions.fetchApiFailed(error));
        }
      }
      // fetchApiSuccess: () => {
      //   dispatch(actions.fetchApiSuccess());
      // },
      // fetchApiFailed: (error) => {
      //   dispatch(actions.fetchApiFailed(error));
      // }
    }),
    [state]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

FetchingApiProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default FetchingApiProvider;
