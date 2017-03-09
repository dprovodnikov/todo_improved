export default {
  bind: function() {
    this.root = $(this.el);

    this.detect = ({ target }) => {
      target = $(target);
      if (target.hasClass('tl-task')) {
        const _id = target.attr('data-id');

        for (let vm of this.vm.$children) {
          if (vm.$get('task._id') == _id) {
            // do something
          }
        }

      }
    };

    this.bindEvents = (event) => {
      $(document).on('mousemove', this.detect);
      $(document).on('mouseup', (event) => {
        $(document).off('mousemove', this.detect);
      })
    };

    this.root.on('mousedown', this.bindEvents);
  },

  unbind: function() {
    this.root.off('dragover', this.bindEvents);
  }
}