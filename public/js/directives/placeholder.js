export default {

  bind: function() {

    let text = this.expression;

    let placeholderClass = 'placeholder';

    $(this.el).append(`
      <div class="${placeholderClass}">${text}</div>
    `);

    this.focus = (e) => {
      let el = $(this.el);

      if( $(el.html()).hasClass(`${placeholderClass}`) )
        $(this.el).html('');
    }

    $(this.el).on('focus', this.focus);
  },

  unbind: function() {
    $(this.el).off('focus', this.focus);
  },

}