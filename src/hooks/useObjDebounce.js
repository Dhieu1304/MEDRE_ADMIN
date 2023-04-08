import { useState, useEffect } from "react";

function useObjDebounce(obj, delay) {
  const [debouncedObj, setDebouncedObj] = useState(obj);
  const [isWaiting, setIsWaiting] = useState(false);

  // console.log("-----useObjDebounce-----");

  useEffect(() => {
    setIsWaiting(true);

    const handler = setTimeout(() => {
      setDebouncedObj(obj);
      setIsWaiting(false);
    }, delay);

    return () => clearTimeout(handler);
  }, Object.values(obj));

  return { debouncedObj, isWaiting };
}

export default useObjDebounce;
