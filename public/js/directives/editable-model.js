import * as Caret from '../utils/caret-utils.js';

export default {
  bind: function() {
    let model = this.expression;
    let el = $(this.el);

    let max = this.vm[this.arg] || 120;

    if (this.vm[model]) {
      el.html(this.vm[model]);
    }

    setTimeout(() => {

      if (el.text().trim() && !el.find('.placeholder').length) {
        this.vm[model] = el.text()
      }

    }, 100)


    this.watch = (e) => {
      let cleanEl = el.clone();

      cleanEl.find('span').remove();

      let textValue = cleanEl.text().replace(/\s+/, ' ');

      this.vm[model] = textValue.trim();

      return textValue.length != max;
    }

    el.on('input keypress', this.watch);
    el.on('drop paste', e => false);
  },

  // update: function() {
  //   $(this.el).html(this.vm[this.expression]);
  //   caretToEnd(this.el);
  // },

  unbind: function() {
    $(this.el).off();
  },
}