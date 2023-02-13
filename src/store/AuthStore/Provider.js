import { useMemo, useReducer } from "react";
import Context from "./Context";
import reducer, { initState } from "./reducer";
import actions from "./actions";

// import authServices from "../../services/authServices";
// import userServices from "../../services/userServices";
import { useFetchingStore } from "../FetchingApiStore";

function AuthProvider({ children }) {
    const fetchingStore = useFetchingStore();
    // console.log("fetchingStore: ", fetchingStore);

    const [state, dispatch] = useReducer(reducer, initState);

    const value = {
        ...state,

        login: async (email, password) => {
            fetchingStore.method.fetchApi();
            // const user = await authServices.login(email, password);
            const user = null;
            if (user) {
                dispatch(actions.login(user));
                fetchingStore.method.fetchApiSuccess();
            } else {
                const message = "Incorrect Email or Password";
                fetchingStore.method.fetchApiFailed(message);
            }
        },

        register: async (email, password) => {
            fetchingStore.method.fetchApi();
            // const user = await authServices.register(email, password);
            const user = null;

            if (user) {
                fetchingStore.method.fetchApiSuccess();
            } else {
                const message = "Register failed";
                fetchingStore.method.fetchApiFailed(message);
            }
            return user;
        },

        loadUser: async () => {
            fetchingStore.method.fetchApi();

            // const user = await userServices.getUserInfo();
            const user = null;
            if (user) {
                dispatch(actions.setUser(user));
                fetchingStore.method.fetchApiSuccess();
            } else {
                const message = "Error API";
                fetchingStore.method.fetchApiFailed(message);
            }

            return user;
        }
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export default AuthProvider;
