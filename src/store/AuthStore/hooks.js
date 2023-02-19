import { useContext } from "react";
import Context from "./Context";

const useAuthStore = () => {
  return useContext(Context);
};

export { useAuthStore };
