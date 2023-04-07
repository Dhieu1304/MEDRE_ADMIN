/**
 * Merge two objects by updating values of keys that exist in both objects,
 * while keeping values of keys that only exist in the left object.
 */
const mergeObjects = (left, right) => {
  const merged = {};

  Object.keys(left).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(left, key)) {
      if (Object.prototype.hasOwnProperty.call(right, key)) {
        merged[key] = right[key];
      } else {
        merged[key] = left[key];
      }
    }
  });

  // Return the merged object.
  return merged;
};

// remove undefined keys
const cleanObject = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

export { mergeObjects, cleanObject };
