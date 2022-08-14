// https://gist.github.com/tyteen4a03/3420a9e121d13b091343
export const handleize = (str) => {
  str = str.toLowerCase();

  const toReplace = ['"', "'", "\\", "(", ")", "[", "]"];

  // For the old browsers
  for (let i = 0; i < toReplace.length; ++i) {
    str = str.replace(toReplace[i], "");
  }

  str = str.replace(/\W+/g, "-");

  if (str.charAt(str.length - 1) === "-") {
    str = str.replace(/-+\z/, "");
  }

  if (str.charAt(0) === "-") {
    str = str.replace(/\A-+/, "");
  }

  return str;
};