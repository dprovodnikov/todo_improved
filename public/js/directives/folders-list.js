import { caretToEnd } from '../utils/caret-utils.js';

export default {

  bind: function() {
    if (!this.expression) return false;

    const symb = this.arg;

    const el = $(this.el);

    const doesFolderExist = (name) => {
      for (let f of this.vm.folders.list) {
        if (f.hint == name) return true;
      }
      return false;
    }

    const { folders } = this.vm;

    this.watch = (event) => {
      let text = el.text();


      let match = text.match(/#(\w*)$/i);

      if (match) {
        folders.dropdown = true;

        if (doesFolderExist(match[1])) {

          text = text.replace(new RegExp(`${symb}(${match[1]})`, 'i'), (match, group) => {
            return `<span class="folder-label">${group}</span>`;
          });

          el.html(text + '&nbsp');

          caretToEnd(el.get(0));

          folders.current = folders.list.filter(item => item.hint == match[1])[0];
          folders.dropdown = false;
        }

      } else {
        folders.dropdown = false;
      }

      if (text.match(/#\w*\s/i)) {
        folders.dropdown = false;
      }

    };

    this.removeIfLabel = (event) => {
      if (event.keyCode != 8) return true;
      let el = $(this.el),
          html = el.html();

      if (html.slice(-6, html.length) == '&nbsp;') {
        el.find('span').remove();
        folders.current = null;
      }

    };

    $(this.el).on('input', this.watch);
    $(this.el).on('keydown', this.removeIfLabel);
  },

  unbind: function() {
    $(this.el).off('input', this.watch);
    $(this.el).off('keydown', this.removeIfLabel);
  },

};