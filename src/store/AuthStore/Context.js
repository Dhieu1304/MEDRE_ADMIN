import { createContext } from "react";
import { initState } from "./reducer";

const Context = createContext(initState);

export default Context;
