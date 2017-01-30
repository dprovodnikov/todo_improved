export default {
  bind: function() {
    let model = this.expression;
    let el = $(this.el);

    if(this.vm[model])
      el.html(this.vm[model]);

    setTimeout(() => {
      if(el.text().trim())
        this.vm[model] = el.text()
    }, 100)


    this.watch = (e) => {
      this.vm[model] = $(this.el).text();
    }

    $(this.el).on('input', this.watch);
  },

  unbind: function() {
    $(this.el).off('input', this.watch);
  },
}