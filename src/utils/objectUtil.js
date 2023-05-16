/**
 * Merge two objects by updating values of keys that exist in both objects,
 * while keeping values of keys that only exist in the left object.
 */
const mergeObjectsWithoutNullAndUndefined = (left, right) => {
  const merged = {};

  Object.keys(left).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(left, key)) {
      if (Object.prototype.hasOwnProperty.call(right, key)) {
        // merged[key] = right[key];
        if (right[key] !== null && right[key] !== undefined) {
          merged[key] = right[key];
        } else {
          merged[key] = left[key];
        }
      } else {
        merged[key] = left[key];
      }
    }
  });

  // Return the merged object.
  return merged;
};

// remove undefined keys
const cleanUndefinedValueObject = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// remove undefined and empty string keys
const cleanUndefinedAndEmptyStrValueObject = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (value !== undefined && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// remove undefined and empty string and false keys
const cleanUndefinedAndEmptyStrAndFalseValueObject = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (value !== undefined && value !== "" && value !== false) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// change undefined and null keys to empty string
const cleanUndefinedAndNullValueObjectToStrObj = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      acc[key] = value;
    } else {
      acc[key] = "";
    }
    return acc;
  }, {});
};

export {
  mergeObjectsWithoutNullAndUndefined,
  cleanUndefinedValueObject,
  cleanUndefinedAndEmptyStrValueObject,
  cleanUndefinedAndEmptyStrAndFalseValueObject,
  cleanUndefinedAndNullValueObjectToStrObj
};
