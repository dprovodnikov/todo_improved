export default {
  
  bind: function() {

    this.emit = (e) => {
      if( !$(e.target).parents('.' + this.el.className).length && e.button == 0)
        this.vm.$emit('collapse-me');
    };

    $(document).on('click', this.emit);

  },

  unbind: function() {
    $(document).off('click', this.emit);
  },

};
