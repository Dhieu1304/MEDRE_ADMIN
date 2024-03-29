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

// const updateObjectKeys = (object1, object2) => {
//   const updatedObject = { ...object1 };
//
//   for (const key in updatedObject) {
//     if ( object2[key] === false) {
//       updatedObject[key] = undefined;
//     }
//   }
//
//   return updatedObject;
// };

function getSortValue(columnIds, sortFormat, sortKey) {
  if (Object.prototype.hasOwnProperty.call(columnIds, sortKey)) {
    if (sortKey in sortFormat) {
      return sortFormat[sortKey];
    }
  }
  return null; // Hoặc bất kỳ giá trị mặc định nào phù hợp với yêu cầu của bạn
}

function removeKeys(object1, object2) {
  const object1Keys = Object.keys(object1);
  const object2Keys = Object.keys(object2);

  const filteredKeys = object1Keys.filter((key) => !object2Keys.includes(key));

  // const result = {};
  // for (const key of filteredKeys) {
  //   result[key] = object1[key];
  // }

  const result = filteredKeys.reduce((acc, key) => {
    acc[key] = object1[key];
    return acc;
  }, {});

  return result;
}
export {
  mergeObjectsWithoutNullAndUndefined,
  cleanUndefinedValueObject,
  cleanUndefinedAndEmptyStrValueObject,
  cleanUndefinedAndEmptyStrAndFalseValueObject,
  cleanUndefinedAndNullValueObjectToStrObj,
  // updateObjectKeys
  getSortValue,
  removeKeys
};
