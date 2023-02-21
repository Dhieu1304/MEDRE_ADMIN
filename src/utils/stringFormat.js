const inputErrorFormat = (name, error) => {
  if (error) {
    return name ? `${name} ${error}` : `This field ${error}`;
  }
  return "";
};

export { inputErrorFormat };
