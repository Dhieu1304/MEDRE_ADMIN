import { useContext } from "react";
import Context from "./Context";

const useAppConfigStore = () => {
  const value = useContext(Context);
  return value;
};

export { useAppConfigStore };
