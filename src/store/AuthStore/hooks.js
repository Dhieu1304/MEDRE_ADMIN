import { useContext } from "react";
import Context from "./Context";

const useAuthStore = () => {
  const value = useContext(Context);
  return value;
};

export { useAuthStore };
