const getName = (name) => name.replace(/-/g, ' ').replace(new RegExp("_"), "'");

const getSlug = (name) => name.replace(/ /g, '-').replace(new RegExp("'"), "_");

const copy = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    return;
  }
  const textArea = document.createElement('textarea');
  textArea.setAttribute('style', 'position: fixed; top: -200%');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  return new Promise((res, rej) => {
    document.execCommand('copy') ? res() : rej();
    textArea.remove();
  });
};

export { getName, getSlug, copy };