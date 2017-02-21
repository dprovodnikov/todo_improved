import * as Caret from '../utils/caret-utils.js';

export default {

  bind: function() {
    if (!this.expression) return false;

    const el = $(this.el);

    this.metaSymb = this.arg;

    const doesFolderExist = (name) => {
      return !this.vm.folders.list.every(e => e.hint != name);
    }

    const { folders } = this.vm;

    this.replaceTo = (hint) => {
      let el, text, match;

      el = $(this.el);

      el.html((i, innerMarkup) => {
        return innerMarkup
          .replace(/<br\/?>/ig, '')
          .replace(/<span.*>(.*)<\/span>(&nbsp;)?/ig, '')
      });

      text = el.html();

      text = text.replace(new RegExp(`${this.metaSymb}\\w*`, 'i'), () => {
        return `<span contenteditable="false" class="folder-label">${hint}</span>`;
      });

      el.html(text + '&nbsp;');
      el.trigger('input'); // causes the model update, which happens only on an input event;
      Caret.toEnd(this.el);

      folders.search = ''; // reset the search query
    };

    this.watch = (event) => {
      let text = el.text();

      let match = text.match(new RegExp(`${this.metaSymb}(\\w*)`, 'i'));

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

      if (text.match( new RegExp(`${this.metaSymb}\\w*\\s`, 'i'))) {
        folders.dropdown = false;
        this.isMatched = false;
        folders.search = ''; // reset the search query
      }

    };

    this.handleKeyDown = (event) => {
      if (event.keyCode == 8) return this.removeIfLabel();

      if (event.keyCode == 27) {
        folders.focused = null;
        folders.dropdown = false;
        folders.search = '';
        return false;
      }

      if (!folders.dropdown) return true;

      if (event.keyCode == 38) {

        if (folders.focused == null) {
          folders.focused = folders.list.length - 1
        }

        folders.focused = (folders.focused) == 0
          ? folders.list.length - 1
          : folders.focused - 1

        return false;

      } else if (event.keyCode == 40) {

        if (folders.focused == null) {
          return folders.focused = 0; 
        }

        folders.focused = (folders.focused) < (folders.list.length - 1)
          ? folders.focused + 1
          : 0

        return false;

      } else if (event.keyCode == 13) {
        this.vm.setFolder(folders.list[folders.focused].id);
        return false;
      }

    };

    this.removeIfLabel = () => {
      let el = $(this.el),
          html = el.html();

      if (html.endsWith('<br>')) { // firefox usually adds <br> in the end
        html = html.slice(0, -4);
      }

      if (html.endsWith('</span>&nbsp;') || html.endsWith('</span> ')) {

        el.html((i, innerMarkup) => {
          return innerMarkup
            .replace(/<span.*>(.*)<\/span>&nbsp;/ig, (m, g) => `${this.metaSymb}${g}`)
            .replace(/\b&nbsp;/ig, ' ');
        });

        folders.current = null;
        Caret.toEnd(this.el);
      }

    };

    $(this.el).on('input', this.watch);
    $(this.el).on('keydown', this.handleKeyDown);
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
    $(this.el).off('keydown', this.handleKeyDown);
  },

};