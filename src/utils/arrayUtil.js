const transposeMatrix = (arrs) => {
  const newArrs = [];
  for (let i = 0; i < arrs[0].length; i++) {
    const newRow = [];
    for (let j = 0; j < arrs.length; j++) {
      newRow.push(arrs[j][i]);
    }
    newArrs.push(newRow);
  }

  return [...newArrs];
};

export { transposeMatrix };
