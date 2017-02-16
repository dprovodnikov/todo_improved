export function caretToEnd(el) {
  let range, selection;
  if (document.createRange) {
    range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.selection) {
    range = document.body.createTextRange();
    range.moveToElementText(el);
    range.collapse(false);
    range.select();
  }
}