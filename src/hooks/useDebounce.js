import { useState, useEffect } from "react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    setIsWaiting(true);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsWaiting(false);
    }, delay);

    return () => clearTimeout(handler);
  }, [value]);

  return { debouncedValue, isWaiting };
}

export default useDebounce;
