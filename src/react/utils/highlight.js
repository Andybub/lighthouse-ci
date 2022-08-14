export const highlight = (text, term) => {
  const index = text.toLowerCase().indexOf(term);
  if (index > -1) {
    return [text.slice(0, index), text.slice(index, index + term.length), text.slice(index + term.length, text.length)];
  }
  return [text, '', ''];
};