export default {
  
  bind: function() {

    $(document).on('click', e => {

      if( !$(e.target).parents('.' + this.el.className).length )
        this.vm.$emit('collapse-me');
    });

  },

  unbind: function() {},

};
