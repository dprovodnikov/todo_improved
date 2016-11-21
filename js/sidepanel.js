// import Calendar from './calendar';


export default function() {
  let navItems = $('.main-nav li'),
  activeNavItemClass = 'sidebar-item-active',
  panel = $('.side-panel');
  panel.opened = false;

  this.openPanel = function(e) {
    navItems.removeClass(activeNavItemClass);
    $(e.target).addClass(activeNavItemClass);
    panel.css('width', '400px');

    let calendar = new window.Calendar({
      yearFirst: 2012,
      yearLast: 2018,
      yearPrimary: 2016
    });
    
  };

  this._initEvents = function() {
    navItems.click(this.openPanel);
  };

  this._initEvents();

}