import { useContext } from "react";
import Context from "./Context";

const useFetchingStore = () => {
  return useContext(Context);
};
export { useFetchingStore };
