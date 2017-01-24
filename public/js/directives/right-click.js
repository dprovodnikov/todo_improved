export default {
  bind: function() {

    this.emit = (e) => {
      if(this.expression)
       this.vm[this.expression](e);
      e.preventDefault();
    };

    $(this.el).on('contextmenu', this.emit);
  },

  unbind: function() {
    $(this.el).off('contextmenu', this.emit);
  },
}