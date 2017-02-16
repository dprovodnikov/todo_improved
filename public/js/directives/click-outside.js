export default {
  
  update: function() {

    let eventName = 'collapse-me';

    if (this.expression) {
      eventName = this.expression;
    }

    this.emit = (e) => {
      if (!$(this.el).find(e.target).length && e.button == 0) {
        let except = e.target.dataset['except'];

        if (eventName == except) {
          return false;
        }

        this.vm.$emit(eventName);
      }
    };

    $(document).on('click', this.emit);

  },

  unbind: function() {
    $(document).off('click', this.emit);
  },

};
