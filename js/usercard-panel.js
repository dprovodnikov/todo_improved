import usercard from './usercard';

export default function() {
  const panelSelector = '.side-panel',
  panel = $(panelSelector);

  return {
    show: function() {
      let usercardEl = usercard(panelSelector);
      panel.css({
        width: '250px',
        background: usercardEl.css('background-color')
      });
    },
    hide: function() {
      panel.css({width: 0});
      panel.empty();
    },
  };
}