export const debounce = (func: () => void, delay: number) => {
  let debounceTimer: number;
  return function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(), delay);
  };
};
