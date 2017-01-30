export default {
  bind: function() {
    let model = this.expression;

    console.log(this.vm[model]);
    if(this.vm[model])
      $(this.el).text(this.vm[model]);

    this.watch = (e) => {
      this.vm[model] = $(this.el).text();
    }

    $(this.el).on('input', this.watch);
  },

  unbind: function() {
    $(this.el).off('input', this.watch);
  },
}