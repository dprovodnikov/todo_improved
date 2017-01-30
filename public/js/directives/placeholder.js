export default {

  bind: function() {

    let text = this.expression;

    let placeholderClass = 'placeholder';

    let markup = `<div class="${placeholderClass}">${text}</div>`

    $(this.el).append(markup);

    this.focus = (e) => {
      let el = $(this.el);

      if( $(el.html()).hasClass(`${placeholderClass}`) )
        $(this.el).html('');
    }

    this.blur = (e) => {
      let el = $(this.el);

      if(el.text().trim() == '')
        el.append(markup);
    }

    $(this.el).on('focus', this.focus);
    $(this.el).on('blur', this.blur);
  },

  unbind: function() {
    $(this.el).off('focus', this.focus);
    $(this.el).off('blur', this.blur);
  },

}