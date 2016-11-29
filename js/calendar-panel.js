import Calendar from './calendar';

export default function() {
  let panelSelector = '.side-panel';
  const panel = $(panelSelector);

  let instance = {
    show: function() {
      let calendar = new Calendar({
        container: '.side-panel',
        yearFirst: 2012,
        yearLast: 2028,
        yearPrimary: 2016,
        onclick: function() {}
      });

      panel.css({
        width: `${calendar.width() + 40}px`,
        background: calendar.css('background-color')
      });
    },
    hide: function() {
      panel.css('width', 0);
      panel.empty();
    }
  };

  return instance;
}