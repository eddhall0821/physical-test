const bigTask = (int) => {
  console.log(int);

  const sum = new Array(int)
    .fill(0)
    .map((el, idx) => el + idx)
    .reduce((sum, el) => sum + el, 0);

  console.log(sum);
};

export const runBigTask = (int) => {
  bigTask(int);
  console.log(int);
  return "done";
};

export const runBigTaskAsync = async (int) => {
  bigTask(int);
  return "done";
};
