const LOCAL_STORAGE = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  ACCESS_TOKEN_EXPIRE_TIME: "ACCESS_TOKEN_EXPIRE_TIME",
  REFRESH_TOKEN_EXPIRE_TIME: "REFRESH_TOKEN_EXPIRE_TIME"
};

const setItem = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};

const getItem = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

const removeItem = (name) => {
  localStorage.removeItem(name);
};

export default { LOCAL_STORAGE, setItem, getItem, removeItem };
