
export const copyCode = code => new Promise(resolve => {
  navigator.clipboard.writeText(code).then(resolve);
});
