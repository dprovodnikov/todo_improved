import * as Caret from '../utils/caret-utils.js';

export default {

  bind: function() {

    this.metaSymb = this.arg;

    let regExp = new RegExp(`\\${this.metaSymb}([0,1,2])`);

    this.replaceTo = (value) => {
      let el = $(this.el);

      el.html((i, old) => {
        return old 
          .replace(/<br\/?>/ig, '')
          .replace(/<p.*>(.*)<\/p>(&nbsp;)?/ig, '')
      });

      el.html((i, old) => {
        return old.replace(regExp, () => {
          return `<p contenteditable="false" class="form-priority-${value} form-priority">${value}</p>&nbsp;`;
        });
      });

      Caret.toEnd(this.el);
    };

    this.watch = (event) => {
      let text = $(this.el).text();

      this.metaSymb = this.arg;

      let match = text.match(regExp);

      if (match) {
        this.replaceTo(match[1]);
        this.vm.setPriority(match[1]);
      }

    };

    this.remove = (event) => {
      if (event.keyCode != 8) return true; 

      let html = $(this.el).html();


      if (html.endsWith('<br>')) { // firefox usually adds <br> in the end
        html = html.slice(0, -4);
      }

      if (html.endsWith('</p>&nbsp;') || html.endsWith('</p> ')) {

        $(this.el).html((i, old) => {
          return old 
            .replace(/<p.*>(.*)<\/p>&nbsp;/i, (m, g) => `${this.metaSymb}${g}`)
            .replace(/\b&nbsp;/ig, ' ');
        });

        this.vm.priorities.current = null;
        Caret.toEnd(this.el);
      }

    };

    $(this.el).on('input', this.watch);
    $(this.el).on('keydown', this.remove);
  },

  update: function(value) {
    let html = $(this.el).html();

    let match = html.match(/<p.*class=\".*(\d+).*\">/i);

    if (match) {
      let digit = match[1];

      $(this.el)
        .find('p')
        .removeClass(`form-priority-${digit}`)
        .addClass(`form-priority-${value}`)
        .text(value);
    }
  },

  unbind: function() {
    $(this.el).off('input', this.watch);
    $(this.el).off('keydown', this.remove);
  },

};