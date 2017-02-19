import * as Caret from '../utils/caret-utils.js';

export default {

  bind: function() {
    if (!this.expression) return false;

    const el = $(this.el);

    const doesFolderExist = (name) => {
      return !this.vm.folders.list.every(e => e.hint != name);
    }

    const { folders } = this.vm;

    this.replaceTo = (hint) => {
      let el, text, symb, match;


      el = $(this.el);

      el.html((i, innerMarkup) => {
        return innerMarkup
          .replace(/<br\/?>/ig, '')
          .replace(/<span.*>(.*)<\/span>(&nbsp;)?/ig, '')
      });

      text = el.text();
      symb = this.arg;

      text = text.replace(/#\w*$/i, () => {
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
        folders.search = ''; // reset the search query
      }

    };

    this.removeIfLabel = (event) => {
      if (event.keyCode != 8) return true;
      let el = $(this.el),
          html = el.html();

      if (html.endsWith('<br>')) { // firefox usually adds <br> in the end
        html = html.slice(0, -4);
      }

      if (html.endsWith('</span>&nbsp;') || html.endsWith('</span> ')) {

        el.html((i, innerMarkup) => {
          return innerMarkup
            .replace(/<span.*>(.*)<\/span>&nbsp;/ig, (m, g) => `#${g}`)
            .replace(/\b&nbsp;/ig, ' ');
        });

        folders.current = null;
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