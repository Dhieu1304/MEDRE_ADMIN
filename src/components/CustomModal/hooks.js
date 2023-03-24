import { useState } from "react";

const useCustomModal = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState();

  return {
    show,
    setShow,
    data,
    setData
  };
};

export { useCustomModal };
