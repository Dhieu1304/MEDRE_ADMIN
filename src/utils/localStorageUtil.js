const LOCAL_STORAGE = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  UUID: "UUID"
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
