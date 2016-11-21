import calendarPanel from './calendar-panel';

export default function() {
  let items = $('.main-nav li'),
  activeItemClass = 'sidebar-item-active';

  let panels = {
    user: undefined,
    calendar: calendarPanel,
    search: undefined,
    filter: undefined,
    charts: undefined,
    settings: undefined,
  };


  /********************************
  * INIT
  ********************************/
  initEvents();

  function initEvents() {

    items.click(function(e) {
      let el = $(e.target);
      if(el.hasClass('fa')) el = el.parent();

      let panel = panels[el.attr('id')]();

      if(el.hasClass(activeItemClass)) {

        items.removeClass(activeItemClass);
        panel.hide();

        return;
      } else {

        items.removeClass(activeItemClass);
        el.addClass(activeItemClass);
        panel.show();
        
        return;
      }


    });

  };

};