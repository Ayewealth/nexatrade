export const truncateString = (str: string | undefined, length: number) => {
  if (str && str.length <= length) return str;
  return str?.slice(0, length) + "...";
};
