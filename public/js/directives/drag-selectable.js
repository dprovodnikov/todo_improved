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
    if (!count) {
      const match = this.root.text().match(/\d+/);
      count = match ? ++match[0] : 1;
    }

    this.root
      .text(this.pattern.replace(/%d/, count))
      .show();
  }

  hide() {
    this.root.hide();
  }
}

export default {
  bind: function() {
    this.root = $(this.el);

    const tooltip = new Tooltip('%d tasks selected');

    this.detect = ({ pageY }) => {
      const pageX = this.root.offset().left + this.root.width() / 2;
      const target = $(document.elementFromPoint(pageX, pageY));

      if (target.hasClass('tl-task')) {
        const _id = target.attr('data-id');

        this.vm.expandSelection(_id);
        tooltip.show(this.vm.getSelection().length);
      }
    };

    this.startSelection = ({ ctrlKey, target }) => {
      if (ctrlKey && target.className.includes('tl-task')) {

        const taskEl = $(target).closest('.tl-task');

        if (taskEl.get(0).className.includes('active')) {
          return false;
        }

        const _id = taskEl.attr('data-id');

        this.vm.expandSelection(_id, true);

        tooltip.show();
      } else {
        $(document).on('mousemove', this.detect);
      }
    };

    this.endSelection = ({ ctrlKey }) => {
      setTimeout(() => {
        this.vm.dropSelection();
      }, 50)

      if (!ctrlKey) {
        tooltip.hide();
      }

      $(document).off('mousemove', this.detect);
    };

    this.root.on('mousedown', this.startSelection);
    $(document).on('mouseup', this.endSelection);
    $(document).on('keyup', ({ keyCode }) => {
      if (keyCode == 17) {
        tooltip.hide();
      }
    });
  },

  unbind: function() {
    this.root.off('mousedown', this.startSelection);
    $(document).off('mouseup', this.endSelection);
  }
}