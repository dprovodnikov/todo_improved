export default {
  
  bind: function() {

    this.emit = (e) => {
      if(!$(this.el).find(e.target).length && e.button == 0)
        this.vm.$emit('collapse-me');
    };

    $(document).on('click', this.emit);

  },

  unbind: function() {
    $(document).off('click', this.emit);
  },

};
