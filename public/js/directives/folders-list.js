import * as Caret from '../utils/caret-utils.js';

export default {

  bind: function() {
    if (!this.expression) return false;

    const el = $(this.el);

    const doesFolderExist = (name) => {
      for (let f of this.vm.folders.list) {
        if (f.hint == name) return true;
      }
      return false;
    }

    const { folders } = this.vm;

    this.replaceTo = (hint) => {
      let el, text, symb, match;

      el = $(this.el);
      text = el.text();
      symb = this.arg;

      text = text.replace(/#\w*/i, () => {
        return `<span contenteditable="false" class="folder-label">${hint}</span>`;
      });

      el.html(text + '&nbsp;');
      el.trigger('input'); // causes the model update, which happens only on an input event;
      Caret.toEnd(this.el);

      folders.search = ''; // reset the search query
    };

    this.watch = (event) => {
      let text = el.text();

      let match = text.match(/#(\w*)$/i);

      if (match) {
        folders.dropdown = true;

        this.isMatched = true;

        folders.search = match[1]; // set a search query

        if (doesFolderExist(match[1])) {

          this.replaceTo(match[1]);

          folders.current = folders.list.filter(item => item.hint == match[1])[0];
          folders.dropdown = false;

          this.isMatched = false;
        }

      } else {
        folders.dropdown = false;
        this.isMatched = false;
      }

      if (text.match(/#\w*\s/i)) {
        folders.dropdown = false;
        this.isMatched = false;
      }

    };

    this.removeIfLabel = (event) => {
      if (event.keyCode != 8) return true;
      let el = $(this.el),
          html = el.html();

      if (html.endsWith('<br>')) {
        html = html.slice(0, -4);
      }

      if (html.endsWith('</span>&nbsp;') || html.endsWith('</span> ')) {
        el.find('span').remove();
        folders.current = null;

        el.html((i, val) => val.replace(/\b&nbsp;/ig, ' '));

        Caret.toEnd(this.el);
      }

    };

    $(this.el).on('input', this.watch);
    $(this.el).on('keydown', this.removeIfLabel);
  },

  update: function(folder) {
    if (!folder) return false;

    const { folders } = this.vm;

    if (this.isMatched) {
      let text = $(this.el).text();
      this.replaceTo(folder.hint);
    } else {
      $(this.el).find('.folder-label').text(folder.hint);
    }

  },

  unbind: function() {
    $(this.el).off('input', this.watch);
    $(this.el).off('keydown', this.removeIfLabel);
  },

};