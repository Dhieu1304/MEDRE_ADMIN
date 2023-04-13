import { useState, useEffect } from "react";
import { useFetchingStore } from "../store/FetchingApiStore";

function useObjDebounce(obj, delay) {
  const [debouncedObj, setDebouncedObj] = useState(obj);
  const [isWaiting, setIsWaiting] = useState(false);
  const { setIsWaitingInput } = useFetchingStore();

  // console.log("-----useObjDebounce-----");

  useEffect(() => {
    setIsWaiting(true);
    setIsWaitingInput(true);

    const handler = setTimeout(() => {
      setDebouncedObj(obj);
      setIsWaiting(false);
      setIsWaitingInput(false);
    }, delay);

    return () => clearTimeout(handler);
  }, Object.values(obj));

  return { debouncedObj, isWaiting };
}

export default useObjDebounce;
