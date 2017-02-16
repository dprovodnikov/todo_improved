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

      let textValue = $(this.el).text();

      this.vm[model] = textValue;

      return textValue.length != max;
    }

    el.on('input keypress', this.watch);
    el.on('drop paste', e => false);
  },

  update: function() {
    $(this.el).text(this.vm[this.expression]);
  },

  unbind: function() {
    $(this.el).off();
  },
}