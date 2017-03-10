export default {
  bind: function() {
    this.root = $(this.el);

    this.detect = (event) => {
      const target = $(event.target);

      if (target.hasClass('tl-task')) {
        const _id = target.attr('data-id');

        this.vm.multipleSelection = true;

        this.vm.$children.forEach((vm, index) => {
          if (vm.$get('task._id') == _id) {
            this.vm.selectAnother(vm.$get('task'));
            vm.$set('checked', true);
          }
        })

      }
    };

    this.bindEvents = (event) => {
      $(document).on('mousemove', this.detect);
      $(document).on('mouseup', (event) => {

        setTimeout(() => {
          this.vm.dropSelection();
        }, 50)

        $(document).off('mousemove', this.detect);
      })
    };

    this.root.on('mousedown', this.bindEvents);
  },

  unbind: function() {
    this.root.off('mousedown', this.bindEvents);
  }
}