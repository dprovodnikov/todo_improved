export default {
  
  update: function() {
    this.eventName = 'collapse-me';

    if (this.expression) {
      this.eventName = this.expression;
    }

    this.emit = ({ target, button }) => {
      if (!$(this.el).find(target).length && button == 0) {
        const except = target.dataset['except'];

        if (except == this.eventName) {
          return false;
        }

        this.vm.$emit(this.eventName);
      }
    };

    $(document).on('click', this.emit);
  },

  unbind: function() {
    $(document).off('click', this.emit);
  },

};
