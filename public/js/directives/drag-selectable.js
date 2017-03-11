class Tooltip {
  constructor(pattern) {
    this.offset = 10; // an offset from cursor on either sides
    this.pattern = pattern;

    this.root = this._render();
    this._bindEvents();
  }

  _render() {
    return $(document.body)
      .append('<div class="selection-hint"></div>')
      .find('.selection-hint');
  }

  _bindEvents() {
    $(document).on('mousemove', ({ pageX, pageY }) => {
      this.root.css({
        left: pageX + this.offset + 'px',
        top: pageY + this.offset + 'px'
      })
    })
  }

  show(count) {
    this.root
      .text(this.pattern.replace(/%d/, count))
      .show();
  }

  hide() {
    this.root.text('').hide();
  }
}

export default {
  bind: function() {
    this.root = $(this.el);

    const tooltip = new Tooltip('%d tasks selected');

    this.detect = ({ target }) => {
      target = $(target);

      if (target.hasClass('tl-task')) {
        const _id = target.attr('data-id');

        this.vm.expandSelection(_id);
        tooltip.show(this.vm.getSelection().length);
      }
    };

    this.bindEvents = (event) => {
      $(document).on('mousemove', this.detect);
      $(document).on('mouseup', (event) => {

        setTimeout(() => {
          this.vm.dropSelection();
        }, 50)

        tooltip.hide();

        $(document).off('mousemove', this.detect);
      })
    };

    this.root.on('mousedown', this.bindEvents);
  },

  unbind: function() {
    this.root.off('mousedown', this.bindEvents);
  }
}