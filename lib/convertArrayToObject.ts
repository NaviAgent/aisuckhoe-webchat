export const convertArrayToObject = (array: File[]) => {
  return array.reduce(
    (obj, item) => {
      obj[item.name] = item;
      return obj;
    },
    {} as { [key: string]: File }
  );
};
