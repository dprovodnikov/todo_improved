(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tabs = require('./tabs');

var _tabs2 = _interopRequireDefault(_tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChangesManager = function () {
  function ChangesManager(rootSelector) {
    _classCallCheck(this, ChangesManager);

    this._render(rootSelector);

    this.el = $('.changes-manager');
    this.header = this.el.find('.cm-header');
    this.body = this.el.find('.cm-body');
    this.capitalizeIcon = this.header.find('.fa');
    this.title = this.header.find('.cm-header-title');
    this.curtain = $('.cm-curtain');
    this.tasks = [];

    this.openedClass = 'cm-opened';

    this._bindEvents();
  }

  /*********************
  * PRIVATE
  *********************/


  _createClass(ChangesManager, [{
    key: '_render',
    value: function _render(rootSelector) {
      var template = '\n    <div class="cm-curtain"></div>\n    <div class="changes-manager">\n      <div class="cm-header">\n        <div class="cm-header-title"></div>\n        <div class="cm-header-toggle">\n          <div class="fa fa-window-minimize"></div>\n        </div>\n      </div>\n      <div class="cm-body"></div>\n    </div>\n    ';

      $(rootSelector).append(template);
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      this.header.click(function (e) {
        return _this._toggle();
      });
      this.curtain.click(function (e) {
        return _this._toggle();
      });
    }
  }, {
    key: '_undoAll',
    value: function _undoAll(curtainAnimationDuration) {
      var _this2 = this;

      this.tasks = [];
      this.body.height(0);
      this.curtain.fadeTo(50, 0);
      setTimeout(function () {
        _this2.curtain.hide();
      }, curtainAnimationDuration);
      this.el.animate({ 'bottom': '-100%' }, 300, function () {
        _this2.el.hide();
      });
    }
  }, {
    key: '_undoOne',
    value: function _undoOne(id) {
      this.tasks = this.tasks.filter(function (task) {
        return task.id != id;
      });
      this.title.html(this.tasks.length + ' tasks were affected');
    }
  }, {
    key: '_slideUpDown',
    value: function _slideUpDown(title) {
      var _this3 = this;

      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;

      var transitionString = 'all ' + duration / 1000 + 's';

      var slideUp = function slideUp() {
        _this3.body.css({
          transition: transitionString,
          height: 60 + 'px'
        });
      };

      var slideDown = function slideDown() {
        setTimeout(function () {
          _this3.body.height(0);
        }, duration * 5);

        _this3.el.css({
          transition: transitionString,
          bottom: 0
        });
      };

      var showPreview = function showPreview() {
        var template = '\n      <div class="cm-preview-container">\n        <div class="cm-task-preview">\n          <div class="cm-preview-title">' + title + '</div>\n          <div class="cm-undo-wrap">\n            <div class="cm-undo-btn">\n              <div class="fa fa-minus"></div>\n            </div>\n          </div>\n        </div>\n      </div>\n      ';

        _this3.body.html(template);

        setTimeout(function () {
          $('.cm-task-preview').animate({
            marginLeft: 0
          }, duration / 2);
        }, duration / 2);
      };

      slideUp();
      showPreview();
      slideDown();
    }
  }, {
    key: '_toggle',
    value: function _toggle() {
      var _this4 = this;

      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;

      var curtainAnimationDuration = parseFloat(this.curtain.css('transition-duration')) * 1000;
      this.el.toggleClass(this.openedClass);

      var open = function open() {
        _this4.opened = true;
        _this4.curtain.show();
        setTimeout(function () {
          _this4.curtain.fadeTo(100, .5);
        }, curtainAnimationDuration / 10);

        var tabs = new _tabs2.default(_this4.body, {
          onundo: function onundo(id) {
            return _this4._undoOne(id);
          },
          onundoall: function onundoall() {
            _this4._undoAll(curtainAnimationDuration);
          }
        });

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this4.tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var task = _step.value;

            switch (task.status) {
              case 'completed':
                tabs.pushCompleted(task);break;
              case 'updated':
                tabs.pushUpdated(task);break;
              case 'deleted':
                tabs.pushDeleted(task);break;
              default:
                tabs.pushCompleted(task);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        _this4.body.css({
          height: 400 + 'px',
          transitionDuration: duration / 1000 + 's'
        });
      };

      var close = function close() {
        _this4.opened = false;
        _this4.body.height(0);
        _this4.curtain.fadeTo(50, 0);
        setTimeout(function () {
          _this4.curtain.hide();
        }, curtainAnimationDuration);
      };

      this.opened ? close() : open();
    }

    /*********************
    * PUBLIC
    *********************/

  }, {
    key: 'update',
    value: function update(task) {
      this.tasks.push(task);
      this.title.html(this.tasks.length + ' tasks were affected');
      this._slideUpDown(task.title);
    }
  }]);

  return ChangesManager;
}();

exports.default = ChangesManager;

},{"./tabs":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tabs = function () {
  function Tabs(targetEl, ops) {
    _classCallCheck(this, Tabs);

    this.targetEl = targetEl;
    this.onundo = ops.onundo;
    this.onundoall = ops.onundoall;

    this._render();

    this.class = {
      active: 'cm-tab-active',
      disabled: 'cm-tab-disabled'
    };

    this.tabs = [{
      id: 'completed',
      buttonEl: $('.tab-completed'),
      contentEl: $('.tab-completed-content')
    }, {
      id: 'deleted',
      buttonEl: $('.tab-deleted'),
      contentEl: $('.tab-deleted-content')
    }, {
      id: 'updated',
      buttonEl: $('.tab-updated'),
      contentEl: $('.tab-updated-content')
    }];

    this.tabUnderscore = $('.cm-tabs-underscore');
    this.contentsTape = $('.cm-tab-contents-wrap');
    this.tabButtons = $('.cm-tab');
    this.activeTab = {};
    this.tabsAvailable = [];

    this._bindEvents();
  }

  _createClass(Tabs, [{
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var tab = _step.value;

          tab.buttonEl.click(function (e) {
            return _this._switchTab(tab);
          });
        };

        for (var _iterator = this.tabs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: '_render',
    value: function _render() {
      var _this2 = this;

      var template = '\n      <div class="cm-body-top">\n        <p>Confirm or reject following changes</p>\n        <button class="cm-clear-all">Clear all</button>\n      </div>\n      <div class="cm-tabs-pane">\n        <div class="cm-tabs-wrap">\n          <div class="cm-tab cm-tab-disabled tab-completed">Completed</div>\n          <div class="cm-tab cm-tab-disabled tab-deleted">Deleted</div>\n          <div class="cm-tab cm-tab-disabled tab-updated">Updated</div>\n        </div>\n        <div class="cm-tabs-underscore-wrap">\n          <div class="cm-tabs-underscore"></div>\n        </div>\n        <div class="cm-tab-contents-wrap">\n          <div class="cm-tab-content tab-completed-content"></div>\n          <div class="cm-tab-content tab-deleted-content"></div>\n          <div class="cm-tab-content tab-updated-content"></div>\n        </div>\n      </div>\n    ';

      this.targetEl.html(template);

      $('.cm-clear-all').click(function (e) {
        return _this2.onundoall();
      });
    }
  }, {
    key: '_pushTask',
    value: function _pushTask(task, tab) {
      var _this3 = this;

      tab.buttonEl.removeClass(this.class.disabled);
      this.tabsAvailable.push(tab);
      this._switchTab(tab, true);

      var template = '<div class="cm-task-preview cm-preview-' + task.id + '">\n      <div class="cm-preview-title">' + task.title + '</div>\n      <div class="cm-undo-wrap">\n        <div id="' + task.id + '" class="cm-undo-btn">\n          <div class="fa fa-minus"></div>\n        </div>\n      </div>\n    </div>';
      tab.contentEl.append(template);

      if (tab.contentEl.outerHeight(true) > 300) {
        tab.contentEl.css({
          height: '300px',
          overflowY: 'scroll'
        });
      }

      $('.cm-undo-btn#' + task.id).click(function (e) {
        _this3._undoOne(task.id);
      });
    }
  }, {
    key: '_undoOne',
    value: function _undoOne(id) {
      var _this4 = this;

      var taskPreview = $('.cm-preview-' + id);

      var siblings = taskPreview.siblings();

      if (siblings.length == 0) {
        this.tabsAvailable = this.tabsAvailable.filter(function (tab) {
          return tab.id != _this4.activeTab.id;
        });

        this.activeTab.buttonEl.addClass(this.class.disabled);

        if (this.tabsAvailable.length) this._switchTab(this.tabsAvailable[0]);else this.onundoall();
      }

      taskPreview.css({
        width: taskPreview.width() + 'px',
        transform: 'translateX(-120%)',
        opacity: 0
      });

      setTimeout(function () {
        taskPreview.animate({ height: 0 }, 100);
        setTimeout(function () {
          taskPreview.remove();
        }, 100);
      }, 150);

      this.onundo(id);
    }
  }, {
    key: 'pushUpdated',
    value: function pushUpdated(task) {
      this._pushTask(task, this.tabs[2]);
    }
  }, {
    key: 'pushCompleted',
    value: function pushCompleted(task) {
      this._pushTask(task, this.tabs[0]);
    }
  }, {
    key: 'pushDeleted',
    value: function pushDeleted(task) {
      this._pushTask(task, this.tabs[1]);
    }
  }, {
    key: '_switchTab',
    value: function _switchTab(tab) {
      var _this5 = this;

      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (tab.buttonEl.hasClass(this.class.disabled)) return false;

      this.tabButtons.removeClass(this.class.active);
      tab.buttonEl.addClass(this.class.active);

      this.activeTab = tab;

      /* Move underscore below the active tab */
      var slideDuration = parseFloat(this.contentsTape.css('transition-duration')) * 1000;
      setTimeout(function () {
        var tabOffset = tab.buttonEl.position().left;
        var tabWidth = tab.buttonEl.outerWidth(true);
        _this5.tabUnderscore.css({
          width: tabWidth + 'px',
          left: tabOffset + 'px'
        });
      }, delay ? slideDuration : 0);

      /* Slide tab content panes */

      var contentOffset = tab.contentEl.position().left;
      this.contentsTape.css('left', -contentOffset + 'px');
    }
  }]);

  return Tabs;
}();

exports.default = Tabs;

},{}],3:[function(require,module,exports){
'use strict';

var _nav = require('./sidebar/nav');

var _nav2 = _interopRequireDefault(_nav);

var _main = require('./changes_manager/main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _nav2.default)();

var tasks = [{ id: 'task-1', status: 'completed', title: 'Sometimes the same is different' }, { id: 'task-2', status: 'updated', title: 'Make someone to do something' }, { id: 'task-3', status: 'deleted', title: 'Another high-priority task' }, { id: 'task-4', status: 'completed', title: 'Some very important work to do' }, { id: 'task-5', status: 'completed', title: 'Some very important work to do' }, { id: 'task-6', status: 'completed', title: 'Some very important work to do' }];

var cm = new _main2.default('.application-container');
cm.update(tasks[0]);
cm.update(tasks[1]);
cm.update(tasks[2]);
cm.update(tasks[3]);
cm.update(tasks[4]);
cm.update(tasks[5]);

},{"./changes_manager/main":1,"./sidebar/nav":16}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var panelSelector = '.side-panel';
  var panel = $(panelSelector);

  var instance = {
    show: function show() {
      var calendar = new _calendar2.default({
        container: '.side-panel',
        yearFirst: 2012,
        yearLast: 2028,
        yearPrimary: 2016,
        onclick: function onclick() {}
      });

      panel.css({
        width: calendar.width() + 40 + 'px',
        background: calendar.css('background-color')
      });
    },
    hide: function hide() {
      panel.css('width', 0);
      panel.empty();
    }
  };

  return instance;
};

var _calendar = require('./calendar');

var _calendar2 = _interopRequireDefault(_calendar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./calendar":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (params) {
  if (!params) return false;

  /***********************************************
  * INIT
  ************************************************/
  var increaseDay = void 0,
      decreaseDay = void 0;

  var template = '\n  <div class="calendar-wrap">\n    <div class="year-slider">\n      <div class="year-slider-left-control">\n        <div class="fa fa-chevron-left"></div>\n      </div>\n      <div class="year-slider-tape-wrap">\n        <div class="year-slider-tape"></div>\n      </div>\n      <div class="year-slider-right-control">\n        <div class="fa fa-chevron-right"></div>\n      </div>\n    </div>\n    <div class="month-slider">\n      <div class="month-numbers"></div>\n      <div class="month-line">\n        <div class="slider-circle"></div>\n      </div>\n      <div class="month-title">November</div>\n    </div>\n    <div class="weekdays-wrap">\n      <div>SUN</div>\n      <div>MON</div>\n      <div>TUE</div>\n      <div>WED</div>\n      <div>THU</div>\n      <div>FRI</div>\n      <div>SAT</div>\n    </div>\n    <div class="calendar-cells-wrap"></div>\n  </div> ';

  $(params.container).prepend(template);

  var curDate = new Date(),
      yearFirst = params.yearFirst || curDate.getFullYear() - 2,
      yearLast = params.yearLast || curDate.getFullYear(),
      yearPrimary = params.yearPrimary || curDate.getFullYear() - 2,
      onclick = params.onclick,
      currentCalendar = void 0,
      currentMonthNumber = void 0,
      currentYear = void 0,
      currentDay = curDate.getDate(),
      yearSlider = initYearSlider(yearFirst, yearLast, yearPrimary),
      monthSlider = initMonthSlider(params.month);

  this.increaseDay = increaseDay;
  this.decreaseDay = decreaseDay;

  /*****************************************************************************************
  * The function generates information about the year, which was given in params.
  * @return Array of objects, each of which contains name, count of days,
  * the first and the last days of the month
  *****************************************************************************************/
  function generateYearCalendar(year) {
    var daysInMonth = function daysInMonth(month) {
      return 32 - new Date(year, month, 32).getDate();
    };
    var startsWith = function startsWith(month) {
      return new Date(year, month, 1).getDay();
    };
    var endsWidth = function endsWidth(month) {
      return new Date(year, month, daysInMonth(month)).getDay();
    };

    var monthNames = 'January February March April May\n    June July August September October November December'.split(/\s+/),
        months = [];

    for (var i = 0; i < 12; i++) {
      months.push({
        name: monthNames[i],
        days: daysInMonth(i),
        firstDay: startsWith(i),
        lastDay: endsWidth(i)
      });
    }

    currentYear = year;

    return months;
  }

  /*****************************************************************************************
  * The function generates the slider on top of the calendar, so you can slide years in
  * range, which was given in params as the first, last, and primary year of range,
  * primary year is acutally a current year, means a year which was chosen by user
  *****************************************************************************************/
  function initYearSlider(yearFirst, yearLast, yearPrimary) {
    var yearsTape = $('.year-slider-tape');

    /***********************************
    * Need to generate markup which contains years in range,
    * that we was given in function params.
    * for better appearance we need to add first and last "out of range" years
    ***********************************/
    for (var i = yearFirst; i <= yearLast; i++) {
      if (i == yearFirst) yearsTape.append(' <div class="year year-denied">' + (i - 1) + '</div> ');

      var yearClass = i == yearPrimary ? 'year year-primary' : 'year';
      yearsTape.append(' <div class="' + yearClass + '">' + i + '</div> ');

      if (i == yearLast) yearsTape.append(' <div class="year year-denied">' + (i + 1) + '</div> ');
    }

    var tapeWrap = $('.year-slider-tape-wrap'),
        primaryYearEl = $('.year-primary');

    /***********************************
    * Need to scroll the years tape to proper position,
    * where the primary item will be centered
    ************************************/
    setTimeout(function () {
      yearsTape.css({
        left: -(primaryYearEl.position().left - tapeWrap.width() / 2 + primaryYearEl.outerWidth(true) / 2)
      });
    }, parseFloat($(params.container).css('transition-duration')) * 1000);

    /************************************
    * Generate calendar according to the current year
    *************************************/
    currentCalendar = generateYearCalendar(primaryYearEl.text());
    currentYear = primaryYearEl.text();

    $('.year-slider-right-control').click(increaseYear);
    $('.year-slider-left-control').click(decreaseYear);

    /*************************************
    * Decrease year event
    *************************************/
    function decreaseYear() {

      var primaryClass = 'year-primary',
          prevEl = primaryYearEl.prev(),
          primaryWidth = primaryYearEl.outerWidth(true),
          ordinaryWidth = prevEl.outerWidth(true);

      if (!prevEl.hasClass('year-denied')) {
        prevEl.addClass(primaryClass);
        primaryYearEl.removeClass(primaryClass);
        primaryYearEl = prevEl;
        yearsTape.animate({ left: '+=' + (tapeWrap.width() / 2 - primaryYearEl.outerWidth(true) / 2) }, 300);
      } else return false;

      currentCalendar = generateYearCalendar(primaryYearEl.text());

      renderCells(currentMonthNumber);
      return true;
    }

    /*************************************
    * Increase year event
    *************************************/
    function increaseYear() {
      var primaryClass = 'year-primary',
          nextEl = primaryYearEl.next();

      if (!nextEl.hasClass('year-denied')) {
        nextEl.addClass(primaryClass);
        primaryYearEl.removeClass(primaryClass);
        primaryYearEl = nextEl;
        yearsTape.animate({ left: '-=' + (tapeWrap.width() / 2 - primaryYearEl.outerWidth(true) / 2) }, 300);
      } else return false;

      currentCalendar = generateYearCalendar(primaryYearEl.text());

      renderCells(currentMonthNumber);
      return true;
    }

    return {
      increaseYear: increaseYear,
      decreaseYear: decreaseYear
    };
  }

  /*****************************************************************************************
  * The function generates the slider of months, so you can slide them
  * to generate a table, which contains all days of the month, so you can choose
  * anyone you want to deal with
  *****************************************************************************************/
  function initMonthSlider(currentMonth) {
    var monthsContainer = $('.month-numbers'),
        monthLine = $('.month-line'),
        sliderCircle = monthLine.find('.slider-circle'),
        currentMonthClass = 'month-current',
        monthTitleEl = $('.month-title');

    for (var i = 1; i <= 12; i++) {
      monthsContainer.append(' <div>' + i + '</div> ');
    } /************************************************
      * In order to move slider circle next to active month number
      * there is a need to have coordinate representation of points, where
      * the circle has to be fixed
      *************************************************/
    var anchors = [],
        monthsEl = monthsContainer.find('div');

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = monthsEl[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var month = _step.value;

        anchors.push($(month).position().left);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    function switchMonth(number, options) {
      monthsEl.removeClass(currentMonthClass);
      monthsEl.eq(number).addClass(currentMonthClass);
      sliderCircle.css('left', anchors[number]);
      monthTitleEl.text(currentCalendar[number].name);
      currentMonth = currentMonthNumber = number;
      renderCells(currentMonth, options);
    }

    /* Mark clicked month as active */
    monthsEl.click(function () {
      switchMonth($(this).text() - 1);
    });

    switchMonth(currentMonth || curDate.getMonth());

    return {
      switchMonth: switchMonth
    };
  }

  function renderCells(month, options) {
    var cellsContainer = $('.calendar-cells-wrap'),
        cellsMarkup = '';

    /*****************************************************************************************
    * Rendering missing cells to fill empty place BEFORE current cells
    *****************************************************************************************/
    var missingCellsCount = 7 - (7 - currentCalendar[month].firstDay),
        prevMonthDaysCount = void 0;

    /* if current month is the first in year, than previous month is the last in the year */
    if (month == 0) prevMonthDaysCount = currentCalendar[11].days;else prevMonthDaysCount = currentCalendar[month - 1].days;

    /* only for better appearance */
    if (missingCellsCount == 0) missingCellsCount = 7;

    for (var i = prevMonthDaysCount + 1 - missingCellsCount; i <= prevMonthDaysCount; i++) {
      cellsMarkup += '<div class="cell cell-out cell-prev">' + i + '</div>';
    } /*****************************************************************************************
      * Rendering cells of current month
      *****************************************************************************************/
    var currentMonthDaysCount = currentCalendar[month].days;

    for (var _i = 1; _i <= currentMonthDaysCount; _i++) {
      if (options && options.cellToActivate && _i == options.cellToActivate) cellsMarkup += '<div id="cell-' + _i + '" class="cell ' + options.activeCellClass + '">' + _i + '</div>';else cellsMarkup += '<div id="cell-' + _i + '" class="cell">' + _i + '</div>';
    }

    /*****************************************************************************************
    * Rendering missing cells to fill empty place after current cells
    *****************************************************************************************/
    missingCellsCount = 7 - (currentCalendar[month].lastDay + 1);

    /* only for better appearance */
    if (missingCellsCount == 0) missingCellsCount = 7;

    for (var _i2 = 1; _i2 <= missingCellsCount; _i2++) {
      cellsMarkup += '<div class="cell cell-out cell-next">' + _i2 + '</div>';
    }cellsContainer.html(cellsMarkup);
    initEvents();

    /*****************************************************************************************
    * Find today`s cell
    *****************************************************************************************/
    if (currentMonthNumber == curDate.getMonth() && currentYear == curDate.getFullYear()) {
      $('#cell-' + curDate.getDate()).addClass('cell-today');
    }
  }

  /*****************************************************************************************
  * As long as cells are redrawing always when user changes the month wee need to set up
  * all cell event handlers
  *****************************************************************************************/
  function initEvents() {
    var cells = $('.cell'),
        activeCellClass = 'cell-active';

    cells.click(function () {
      switchDay($(this).text(), { el: $(this) });
    });

    function switchDay(day, options) {
      currentDay = day;

      var el = void 0;

      if (options && options.el) {
        el = options.el;
      } else {
        el = $('#cell-' + day);
      }

      if (el.hasClass('cell-prev')) {
        if (currentMonthNumber == 0) {
          if (currentYear == yearFirst) return false;
          yearSlider.decreaseYear();
          currentMonthNumber = 12;
        }

        monthSlider.switchMonth(--currentMonthNumber, {
          cellToActivate: day,
          activeCellClass: activeCellClass
        });

        return doCallback();
      }

      if (el.hasClass('cell-next')) {
        if (currentMonthNumber == 11) {
          if (currentYear == yearLast) return false;
          yearSlider.increaseYear();
          currentMonthNumber = -1;
        }
        monthSlider.switchMonth(++currentMonthNumber, {
          cellToActivate: day,
          activeCellClass: activeCellClass
        });
        return doCallback();
      }

      $('.cell').removeClass(activeCellClass);
      el.addClass(activeCellClass);

      doCallback();
    } // switchDay

    function doCallback() {
      return onclick({
        day: currentDay,
        month: currentMonthNumber + 1,
        year: currentYear,
        monthName: currentCalendar[currentMonthNumber].name,
        weekday: weekday(currentDay)
      });

      function weekday(day) {
        var weekdays = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(/\s+/);
        return weekdays[new Date(currentYear, currentMonthNumber, day).getDay()];
      }
    }

    increaseDay = function increaseDay() {
      if (currentDay == currentCalendar[currentMonthNumber].days) {

        if (currentMonthNumber == 11) {
          if (yearSlider.increaseYear()) currentMonthNumber = -1;else return false;
        }

        monthSlider.switchMonth(++currentMonthNumber);
        currentDay = 0;
      }
      switchDay(++currentDay);
    };

    decreaseDay = function decreaseDay() {
      if (currentDay == 1) {

        if (currentMonthNumber == 0) {
          if (yearSlider.decreaseYear()) currentMonthNumber = 12;else return false;
        }

        monthSlider.switchMonth(--currentMonthNumber);
        currentDay = currentCalendar[currentMonthNumber].days + 1;
      }
      switchDay(--currentDay);
    };
  } //init events

  return $('.calendar-wrap');
};

;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var panelSelector = '.side-panel';
  var panel = $(panelSelector),
      selectors = ['#chart-completed', '#chart-overdue', '#radialchart', '#piechart'];

  var template = '\n    <div class="chartzones">\n      <div class="chartzone-wrap">\n        <div class="chartzone-top">\n          <div class="fa fa-sliders"></div>\n        </div>\n        <div class="chartzone">\n          <svg id="' + selectors[0].slice(1) + '"></svg>\n        </div>\n      </div>\n      <div class="chartzone-wrap">\n        <div class="chartzone-top">\n          <div class="fa fa-sliders"></div>\n        </div>\n        <div class="chartzone">\n          <svg id="' + selectors[1].slice(1) + '"></svg>\n        </div>\n      </div>\n      <div class="chartzone-wrap">\n        <div class="chartzone chartzone-double">\n          <div class="chartzone-half">\n            <svg id="' + selectors[2].slice(1) + '"></svg>\n          </div>\n          <div class="chartzone-half">\n            <svg id="' + selectors[3].slice(1) + '"></svg>\n          </div>\n        </div>\n      </div>\n    </div>\n  ';

  var show = function show() {
    var height = 130,
        width = 350;

    panel.html(template);

    _chart2.default.linear({
      selector: selectors[0],
      period: 30,
      height: height,
      width: width,
      axis: false,
      hover: function hover() {},
      grid: { color: '#eee', rows: true, columns: false }
    }, [{
      data: _demo2.default[0],
      line: { color: '#cc5656' },
      point: {
        radius: 3,
        innerColor: '#cc5656',
        outerColor: '#fff',
        strokeWidth: 1
      }
    }]);

    _chart2.default.bar({
      selector: selectors[1],
      period: 20,
      height: height - 15,
      width: width,
      axis: false,
      hover: function hover() {},
      grid: { columns: true, rows: true, color: '#eee' }
    }, [{
      data: _demo2.default[0],
      line: { color: '#fff', fill: '#db5e5e', hoverColor: '#b23636' }
    }]);

    _chart2.default.radial({
      selector: selectors[2],
      persent: 83,
      r: 60,
      width: 7,
      duration: 700,
      strokeFilled: '#EE0032',
      strokeEmpty: 'transparent',
      fontFamily: 'Muli',
      fontWeight: '0',
      fontColor: '#3d3d3d'
    });

    _chart2.default.pie({
      selector: selectors[3],
      r: 60, r2: 30,
      animationDuration: 700,
      hover: function hover() {
        console.log('hover');
      },
      sectors: [{ angle: 90, fill: '#B70C41' }, { angle: 126, fill: '#EE0032' }, { angle: 144, fill: '#F9738C' }]
    });

    panel.css({
      width: width + 100 + 'px',
      background: '#fff'
    });
  };

  var hide = function hide() {
    panel.css('width', 0);
    panel.empty();
  };

  return {
    show: show,
    hide: hide
  };
};

var _chart = require('./dist/chart');

var _chart2 = _interopRequireDefault(_chart);

var _demo = require('./src/demo');

var _demo2 = _interopRequireDefault(_demo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./dist/chart":7,"./src/demo":11}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _radial = require('../src/radial');

var _radial2 = _interopRequireDefault(_radial);

var _pie = require('../src/pie');

var _pie2 = _interopRequireDefault(_pie);

var _bar = require('../src/bar');

var _bar2 = _interopRequireDefault(_bar);

var _linear = require('../src/linear');

var _linear2 = _interopRequireDefault(_linear);

var _area = require('../src/area');

var _area2 = _interopRequireDefault(_area);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  radial: function radial(settings) {
    new _radial2.default(settings);
  },
  pie: function pie(settings) {
    new _pie2.default(settings);
  },
  bar: function bar(settings, charts) {
    new _bar2.default(settings, charts);
  },
  linear: function linear(settings, charts) {
    new _linear2.default(settings, charts);
  },
  area: function area(settings, charts) {
    new _area2.default(settings, charts);
  }
};

},{"../src/area":8,"../src/bar":9,"../src/linear":12,"../src/pie":13,"../src/radial":14}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chart_model = require('./chart_model');

var _chart_model2 = _interopRequireDefault(_chart_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Area = function (_ChartModel) {
  _inherits(Area, _ChartModel);

  function Area(settings, charts) {
    _classCallCheck(this, Area);

    return _possibleConstructorReturn(this, (Area.__proto__ || Object.getPrototypeOf(Area)).call(this, settings, charts));
  }

  _createClass(Area, [{
    key: 'build',
    value: function build(columns, style) {
      var _offsetX = this.offsetX,
          _offsetY = this.offsetY;

      var chartPath = this.paper.path('').attr({
        stroke: style.color,
        fill: style.fill,
        fillOpacity: 0,
        strokeWidth: style.width,
        strokeDasharray: 3000,
        strokeDashoffset: 3000,
        strokeLinejoin: 'round'
      });

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var col = _step.value;

          var pathString = chartPath.attr('d'),
              coords = _offsetX + ',' + (-col.count * this.scale - _offsetY),
              startPos = 'M' + (this.width - _offsetY) + ',-' + _offsetY + ' L' + _offsetY + ',-' + _offsetY;

          chartPath.attr({
            d: pathString ? pathString + ('L ' + coords) : startPos + ('L ' + coords)
          });
          _offsetX += this.colWidth;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      chartPath.attr({ d: chartPath.attr('d') + 'Z' });
      chartPath.animate({
        strokeDashoffset: 0
      }, 2000);

      setTimeout(function () {
        chartPath.animate({ fill: style.fill, fillOpacity: style.opacity }, 300);
      }, 1500);
    }
  }]);

  return Area;
}(_chart_model2.default);

exports.default = Area;

},{"./chart_model":10}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chart_model = require('./chart_model');

var _chart_model2 = _interopRequireDefault(_chart_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bar = function (_ChartModel) {
  _inherits(Bar, _ChartModel);

  function Bar(settings, charts) {
    _classCallCheck(this, Bar);

    return _possibleConstructorReturn(this, (Bar.__proto__ || Object.getPrototypeOf(Bar)).call(this, settings, charts));
  }

  _createClass(Bar, [{
    key: 'build',
    value: function build(columns, style) {
      var _this2 = this;

      var timeout = 0,
          _offsetX = this.offsetX / 2,
          _offsetY = this.offsetY;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var col = _step.value;

          if (col.count) {
            (function () {
              var bar = _this2.paper.rect(_offsetX, -_offsetY, _this2.colWidth, 0).attr({
                fill: style.fill,
                stroke: style.color
              });

              setTimeout(function () {
                bar.animate({
                  y: -col.count * _this2.scale - _offsetY,
                  height: col.count * _this2.scale
                }, 1500, mina.elastic);
              }, timeout);

              bar.hover(function (e) {
                this.stop().animate({ fill: style.hover }, 200, mina.easeinout);
                this.callback(e, col);
              }, function () {
                this.stop().animate({ fill: style.fill }, 200, mina.easeinout);
              });
            })();
          }
          timeout += 40;
          _offsetX += _this2.colWidth;
        };

        for (var _iterator = columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return Bar;
}(_chart_model2.default);

exports.default = Bar;

},{"./chart_model":10}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChartModel = function () {
  function ChartModel(settings, charts) {
    _classCallCheck(this, ChartModel);

    if (!settings || !charts) return false;

    this.charts = charts;
    this.colWidth = settings.width / settings.period;
    this.offsetX = this.colWidth;
    this.offsetY = 5;
    this.scale = settings.scale || 10;
    this.period = settings.period || 30;
    this.gridOptions = settings.grid || {};
    this.callback = settings.hover;

    this.height = settings.height += this.offsetX;
    this.width = settings.width += this.offsetY * 2;

    this.paper = Snap(settings.selector).attr({
      height: this.height,
      width: this.width + 50,
      viewBox: '0 -' + (this.height - 5) + ' ' + this.width + ' ' + this.height
    });

    if (settings.grid.rows || settings.grid.columns) {
      this.buildGrid();
    }

    this.draw();
  }

  _createClass(ChartModel, [{
    key: 'buildAxis',
    value: function buildAxis() {
      this.paper.path('M0,' + -this.height + ' L0,' + this.offsetY + ' L' + this.width + ',' + this.offsetY).attr({
        fill: 'transparent',
        stroke: '#aaa',
        strokeWidth: '2px'
      });
    }
  }, {
    key: 'buildGrid',
    value: function buildGrid() {
      var rowsPathString = '',
          colsPathString = '',
          _offsetX = this.offsetX,
          rows = [];

      var gridStyle = {
        fill: 'transparent',
        stroke: this.gridOptions.color || '#aaa',
        strokeWidth: '1px'
      };

      this.gridOptions.text = this.gridOptions.text || {};

      var textStyle = {
        fontFamily: this.gridOptions.text.fontFamily || 'PT Sans',
        fontWeight: this.gridOptions.text.fontWeight || 'bold',
        fontSize: this.gridOptions.text.fontSize || '.8em',
        textAnchor: 'middle',
        fill: this.gridOptions.text.color || '#aaa'
      };

      if (this.gridOptions.rows) {
        for (var i = 0; i < this.height / this.scale; i++) {
          if (i % 2 == 0) rows.push(i);
        }var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var point = _step.value;

            var y = point * this.scale + this.offsetY;
            this.paper.text(-15, -y + this.offsetY, '' + point).attr(textStyle);
            rowsPathString += ' M0,-' + y + ' L' + (this.width + 15) + ',-' + y;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.paper.path(rowsPathString).attr(gridStyle);
      }

      if (this.gridOptions.columns) {
        for (var _i = 0; _i < this.width / this.colWidth; _i++) {
          if (_i % 2 == 0) {
            colsPathString += 'M' + _offsetX + ',0 L' + _offsetX + ',-' + this.height;
          }
          _offsetX += this.colWidth;
        }
        this.paper.path(colsPathString).attr(gridStyle);
      }
    }
  }, {
    key: 'getColumns',
    value: function getColumns(tasks) {

      var daysInMonth = function daysInMonth(year, month) {
        return 32 - new Date(year, month, 32).getDate();
      };

      var curDate = new Date(),
          columns = [],
          curDay = curDate.getDate(),
          curMonth = curDate.getMonth(),
          curYear = curDate.getFullYear();

      --curDay;

      for (var i = 0; i < this.period; i++) {
        if (curDay == 0) curDay = daysInMonth(curYear, --curMonth);

        columns.push({
          date: new Date(curYear, curMonth, curDay--).getTime(),
          count: 0,
          tasks: []
        });
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = tasks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var task = _step2.value;

          var taskTime = task.date.setHours(0, 0, 0, 0);

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = columns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var col = _step3.value;

              if (col.date == taskTime) {
                col.count++;
                col.tasks.push(task);
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return columns.reverse();
    }
  }, {
    key: 'draw',
    value: function draw() {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.charts[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var chartData = _step4.value;


          var columns = this.getColumns(chartData.data),
              type = chartData.type || 'linear';

          var defaultColor = '#aaa';

          chartData.point = chartData.point || {};
          chartData.line = chartData.line || {};

          var chartStyle = {
            opacity: chartData.line.opacity || 0.5,
            color: chartData.line.color || defaultColor,
            fill: chartData.line.fill || defaultColor,
            width: chartData.line.width || 2,
            hover: chartData.line.hovercolor || defaultColor,
            point: {
              r: chartData.point.radius || 4,
              fill: chartData.point.innerColor || defaultColor,
              stroke: chartData.point.outerColor || defaultColor,
              strokeWidth: chartData.point.strokeWidth || 3
            }
          };

          this.build(columns, chartStyle);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  }]);

  return ChartModel;
}();

exports.default = ChartModel;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*********************************
* TEST DATA
*********************************/
var data = [{ date: new Date(2016, 10, 27), task: 'some task1' }, { date: new Date(2016, 10, 26), task: 'some task1' }, { date: new Date(2016, 10, 25), task: 'some task1' }, { date: new Date(2016, 10, 24), task: 'some task1' }, { date: new Date(2016, 10, 24), task: 'some task1' }, { date: new Date(2016, 10, 24), task: 'some task1' }, { date: new Date(2016, 10, 24), task: 'some task2' }, { date: new Date(2016, 10, 23), task: 'some task3' }, { date: new Date(2016, 10, 23), task: 'some task4' }, { date: new Date(2016, 10, 22), task: 'some task5' }, { date: new Date(2016, 10, 22), task: 'some task6' }, { date: new Date(2016, 10, 22), task: 'some task7' }, { date: new Date(2016, 10, 22), task: 'some task' }, { date: new Date(2016, 10, 21), task: 'some task' }, { date: new Date(2016, 10, 21), task: 'some task' }, { date: new Date(2016, 10, 21), task: 'some task' }, { date: new Date(2016, 10, 20), task: 'some task' }, { date: new Date(2016, 10, 20), task: 'some task' }, { date: new Date(2016, 10, 20), task: 'some task' }, { date: new Date(2016, 10, 20), task: 'some task' }, { date: new Date(2016, 10, 20), task: 'some task' }, { date: new Date(2016, 10, 20), task: 'some task' }, { date: new Date(2016, 10, 19), task: 'some task' }, { date: new Date(2016, 10, 19), task: 'some task' }, { date: new Date(2016, 10, 19), task: 'some task' }, { date: new Date(2016, 10, 19), task: 'some task' }, { date: new Date(2016, 10, 19), task: 'some task' }, { date: new Date(2016, 10, 19), task: 'some task' }, { date: new Date(2016, 10, 19), task: 'some task' }, { date: new Date(2016, 10, 18), task: 'some task' }, { date: new Date(2016, 10, 18), task: 'some task' }, { date: new Date(2016, 10, 18), task: 'some task' }, { date: new Date(2016, 10, 18), task: 'some task' }, { date: new Date(2016, 10, 18), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 16), task: 'some task' }, { date: new Date(2016, 10, 16), task: 'some task' }, { date: new Date(2016, 10, 16), task: 'some task' }, { date: new Date(2016, 10, 16), task: 'some task' }, { date: new Date(2016, 10, 15), task: 'some task' }, { date: new Date(2016, 10, 15), task: 'some task' }, { date: new Date(2016, 10, 15), task: 'some task' }, { date: new Date(2016, 10, 15), task: 'some task' }, { date: new Date(2016, 10, 15), task: 'some task' }, { date: new Date(2016, 10, 14), task: 'some task' }, { date: new Date(2016, 10, 14), task: 'some task' }, { date: new Date(2016, 10, 13), task: 'some task' }, { date: new Date(2016, 10, 13), task: 'some task' }, { date: new Date(2016, 10, 13), task: 'some task' }, { date: new Date(2016, 10, 13), task: 'some task' }, { date: new Date(2016, 10, 13), task: 'some task' }, { date: new Date(2016, 10, 13), task: 'some task' }, { date: new Date(2016, 10, 13), task: 'some task' }, { date: new Date(2016, 10, 13), task: 'some task' }, { date: new Date(2016, 10, 13), task: 'some task' }, { date: new Date(2016, 10, 12), task: 'some task' }, { date: new Date(2016, 10, 12), task: 'some task' }, { date: new Date(2016, 10, 12), task: 'some task' }, { date: new Date(2016, 10, 12), task: 'some task' }, { date: new Date(2016, 10, 12), task: 'some task' }, { date: new Date(2016, 10, 12), task: 'some task' }, { date: new Date(2016, 10, 12), task: 'some task' }, { date: new Date(2016, 10, 11), task: 'some task' }, { date: new Date(2016, 10, 11), task: 'some task' }, { date: new Date(2016, 10, 11), task: 'some task' }, { date: new Date(2016, 10, 11), task: 'some task' }, { date: new Date(2016, 10, 11), task: 'some task' }, { date: new Date(2016, 10, 10), task: 'some task' }, { date: new Date(2016, 10, 10), task: 'some task' }, { date: new Date(2016, 10, 10), task: 'some task' }, { date: new Date(2016, 10, 10), task: 'some task' }, { date: new Date(2016, 10, 10), task: 'some task' }, { date: new Date(2016, 10, 10), task: 'some task' }, { date: new Date(2016, 10, 10), task: 'some task' }, { date: new Date(2016, 10, 9), task: 'some task' }, { date: new Date(2016, 10, 9), task: 'some task' }, { date: new Date(2016, 10, 8), task: 'some task' }, { date: new Date(2016, 10, 8), task: 'some task' }, { date: new Date(2016, 10, 8), task: 'some task' }, { date: new Date(2016, 10, 8), task: 'some task' }, { date: new Date(2016, 10, 8), task: 'some task' }, { date: new Date(2016, 10, 8), task: 'some task' }, { date: new Date(2016, 10, 7), task: 'some task' }, { date: new Date(2016, 10, 7), task: 'some task' }, { date: new Date(2016, 10, 7), task: 'some task' }, { date: new Date(2016, 10, 7), task: 'some task' }, { date: new Date(2016, 10, 7), task: 'some task' }, { date: new Date(2016, 10, 6), task: 'some task' }, { date: new Date(2016, 10, 6), task: 'some task' }, { date: new Date(2016, 10, 6), task: 'some task' }, { date: new Date(2016, 10, 6), task: 'some task' }, { date: new Date(2016, 10, 6), task: 'some task' }, { date: new Date(2016, 10, 6), task: 'some task' }, { date: new Date(2016, 10, 5), task: 'some task' }, { date: new Date(2016, 10, 5), task: 'some task' }, { date: new Date(2016, 10, 5), task: 'some task' }, { date: new Date(2016, 10, 5), task: 'some task' }, { date: new Date(2016, 10, 4), task: 'some task' }, { date: new Date(2016, 10, 4), task: 'some task' }, { date: new Date(2016, 10, 4), task: 'some task' }, { date: new Date(2016, 10, 4), task: 'some task' }, { date: new Date(2016, 10, 4), task: 'some task' }, { date: new Date(2016, 10, 3), task: 'some task' }, { date: new Date(2016, 10, 3), task: 'some task' }, { date: new Date(2016, 10, 3), task: 'some task' }, { date: new Date(2016, 10, 3), task: 'some task' }, { date: new Date(2016, 10, 3), task: 'some task' }, { date: new Date(2016, 10, 3), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 23), task: 'some task' }, { date: new Date(2016, 10, 23), task: 'some task' }, { date: new Date(2016, 10, 23), task: 'some task' }, { date: new Date(2016, 10, 23), task: 'some task' }, { date: new Date(2016, 10, 23), task: 'some task' }, { date: new Date(2016, 9, 31), task: 'some task' }, { date: new Date(2016, 9, 30), task: 'some task' }, { date: new Date(2016, 9, 30), task: 'some task' }, { date: new Date(2016, 9, 30), task: 'some task' }, { date: new Date(2016, 9, 29), task: 'some task' }, { date: new Date(2016, 9, 29), task: 'some task' }, { date: new Date(2016, 9, 29), task: 'some task' }, { date: new Date(2016, 9, 29), task: 'some task' }, { date: new Date(2016, 9, 29), task: 'some task' }, { date: new Date(2016, 9, 29), task: 'some task' }, { date: new Date(2016, 9, 29), task: 'some task' }, { date: new Date(2016, 9, 29), task: 'some task' }, { date: new Date(2016, 9, 28), task: 'some task' }, { date: new Date(2016, 9, 28), task: 'some task' }, { date: new Date(2016, 9, 27), task: 'some task' }, { date: new Date(2016, 9, 27), task: 'some task' }, { date: new Date(2016, 9, 27), task: 'some task' }, { date: new Date(2016, 9, 27), task: 'some task' }, { date: new Date(2016, 9, 26), task: 'some task' }, { date: new Date(2016, 9, 26), task: 'some task' }];

var data2 = [{ date: new Date(2016, 10, 25), task: 'some task1' }, { date: new Date(2016, 10, 24), task: 'some task1' }, { date: new Date(2016, 10, 24), task: 'some task2' }, { date: new Date(2016, 10, 23), task: 'some task4' }, { date: new Date(2016, 10, 22), task: 'some task5' }, { date: new Date(2016, 10, 22), task: 'some task7' }, { date: new Date(2016, 10, 22), task: 'some task' }, { date: new Date(2016, 10, 21), task: 'some task' }, { date: new Date(2016, 10, 21), task: 'some task' }, { date: new Date(2016, 10, 20), task: 'some task' }, { date: new Date(2016, 10, 20), task: 'some task' }, { date: new Date(2016, 10, 19), task: 'some task' }, { date: new Date(2016, 10, 19), task: 'some task' }, { date: new Date(2016, 10, 19), task: 'some task' }, { date: new Date(2016, 10, 18), task: 'some task' }, { date: new Date(2016, 10, 18), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 17), task: 'some task' }, { date: new Date(2016, 10, 16), task: 'some task' }, { date: new Date(2016, 10, 15), task: 'some task' }, { date: new Date(2016, 10, 15), task: 'some task' }, { date: new Date(2016, 10, 14), task: 'some task' }, { date: new Date(2016, 10, 13), task: 'some task' }, { date: new Date(2016, 10, 13), task: 'some task' }, { date: new Date(2016, 10, 13), task: 'some task' }, { date: new Date(2016, 10, 12), task: 'some task' }, { date: new Date(2016, 10, 12), task: 'some task' }, { date: new Date(2016, 10, 11), task: 'some task' }, { date: new Date(2016, 10, 11), task: 'some task' }, { date: new Date(2016, 10, 11), task: 'some task' }, { date: new Date(2016, 10, 10), task: 'some task' }, { date: new Date(2016, 10, 10), task: 'some task' }, { date: new Date(2016, 10, 10), task: 'some task' }, { date: new Date(2016, 10, 10), task: 'some task' }, { date: new Date(2016, 10, 9), task: 'some task' }, { date: new Date(2016, 10, 8), task: 'some task' }, { date: new Date(2016, 10, 8), task: 'some task' }, { date: new Date(2016, 10, 8), task: 'some task' }, { date: new Date(2016, 10, 8), task: 'some task' }, { date: new Date(2016, 10, 8), task: 'some task' }, { date: new Date(2016, 10, 7), task: 'some task' }, { date: new Date(2016, 10, 7), task: 'some task' }, { date: new Date(2016, 10, 7), task: 'some task' }, { date: new Date(2016, 10, 6), task: 'some task' }, { date: new Date(2016, 10, 6), task: 'some task' }, { date: new Date(2016, 10, 6), task: 'some task' }, { date: new Date(2016, 10, 5), task: 'some task' }, { date: new Date(2016, 10, 4), task: 'some task' }, { date: new Date(2016, 10, 3), task: 'some task' }, { date: new Date(2016, 10, 3), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 2), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 10, 1), task: 'some task' }, { date: new Date(2016, 9, 31), task: 'some task' }, { date: new Date(2016, 9, 30), task: 'some task' }, { date: new Date(2016, 9, 30), task: 'some task' }, { date: new Date(2016, 9, 29), task: 'some task' }, { date: new Date(2016, 9, 28), task: 'some task' }, { date: new Date(2016, 9, 28), task: 'some task' }, { date: new Date(2016, 9, 28), task: 'some task' }, { date: new Date(2016, 9, 29), task: 'some task' }, { date: new Date(2016, 9, 29), task: 'some task' }, { date: new Date(2016, 9, 29), task: 'some task' }, { date: new Date(2016, 9, 27), task: 'some task' }, { date: new Date(2016, 9, 27), task: 'some task' }, { date: new Date(2016, 9, 26), task: 'some task' }];

exports.default = [data, data2];

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chart_model = require('./chart_model');

var _chart_model2 = _interopRequireDefault(_chart_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Linear = function (_ChartModel) {
  _inherits(Linear, _ChartModel);

  function Linear(settings, charts) {
    _classCallCheck(this, Linear);

    return _possibleConstructorReturn(this, (Linear.__proto__ || Object.getPrototypeOf(Linear)).call(this, settings, charts));
  }

  _createClass(Linear, [{
    key: 'build',
    value: function build(columns, style) {
      var _this2 = this;

      var chartPath = this.paper.path('').attr({
        stroke: style.color,
        fill: 'transparent',
        fillOpacity: style.opacity,
        strokeWidth: style.width,
        strokeDasharray: 3000,
        strokeDashoffset: 3000,
        strokeLinejoin: 'round'
      });

      var timeout = 0,
          _offsetX = this.offsetX,
          _offsetY = this.offsetY;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var col = _step.value;


          var pointCoords = {
            x: _offsetX,
            y: -col.count * _this2.scale - _offsetY
          };

          var point = _this2.paper.circle(pointCoords.x, pointCoords.y, 0).attr({
            strokeWidth: style.point.strokeWidth,
            stroke: style.point.stroke,
            fill: style.point.fill,
            id: 'point'
          });

          setTimeout(function () {
            point.animate({ r: style.point.r }, 200, mina.easein);
          }, timeout);
          timeout += 30;

          var timer = void 0;
          point.hover(function (e) {
            point.stop().animate({ r: style.point.r * 2 }, 1000, mina.elastic);
            _this2.callback(e, col);
          }, function (e) {
            clearTimeout(timer);
            point.stop().animate({ r: style.point.r }, 1000, mina.elastic);
          });

          var pathString = chartPath.attr('d'),
              coords = _offsetX + ', ' + (-col.count * _this2.scale - _offsetY);

          chartPath.attr({
            d: pathString ? pathString + ('L ' + coords) : 'M ' + coords
          });
          _offsetX += _this2.colWidth;
        };

        for (var _iterator = columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      chartPath.animate({
        strokeDashoffset: 0
      }, 3000);
    }
  }]);

  return Linear;
}(_chart_model2.default);

exports.default = Linear;

},{"./chart_model":10}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pie = function () {
  function Pie(settings) {
    _classCallCheck(this, Pie);

    this.height = settings.r * 3;
    this.width = this.height;
    this.r = settings.r || 100;
    this.r2 = settings.r2, this.c = this.height / 2;
    this.sectorsData = settings.sectors;
    this.groups = [];
    this.cb = settings.hover;
    this.animationDuration = settings.animationDuration;

    this.paper = Snap(settings.selector).attr({
      height: this.height,
      width: this.width
    });

    this._draw();
    this._bindEvents();
  }

  _createClass(Pie, [{
    key: '_sector',
    value: function _sector(angle) {
      return this.paper.path(_util2.default.describeSector(this.c, this.c, this.r, this.r2, 0, angle));
    }
  }, {
    key: '_group',
    value: function _group(sector, text) {
      this.groups.push(this.paper.g(sector, text));
    }
  }, {
    key: '_getPersentage',
    value: function _getPersentage(angle) {
      return Math.round(angle * 100 / 360);
    }
  }, {
    key: '_getMissingSector',
    value: function _getMissingSector(totalAngle) {
      var angle = 360 - Math.round(totalAngle);
      var s = this._sector(angle).attr({
        fill: 'rgba(255,255,255,.3)',
        strokeDasharray: 2 * Math.PI * (360 - totalAngle),
        strokeDashoffset: 2 * Math.PI * (360 - totalAngle),
        strokeWidth: 1,
        fillOpacity: 0,
        stroke: 'rgba(255,255,255,.1)'
      }).transform('r' + totalAngle + ', ' + this.c + ', ' + this.c);

      s.data('angle', angle);

      var t = this.paper.text(this.c, this.c, 'Others').attr({
        textAnchor: 'middle',
        opacity: 0,
        fontFamily: 'Ubuntu Light',
        fill: '#3d3d3d'
      }).transform('r' + (totalAngle + angle / 2) + ', ' + this.c + ', ' + this.c);

      this._group(s, t);
    }
  }, {
    key: '_animate',
    value: function _animate(duration) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var g = _step.value;

          var sector = g[0],
              text = g[1];

          var textBox = text.getBBox();
          var sectorBox = Snap.path.getBBox(sector);

          sector.animate({
            strokeDashoffset: 0
          }, duration);

          setTimeout(function () {
            sector.animate({
              fillOpacity: 1
            }, 500);
          }, duration);

          setTimeout(function () {
            text.animate({
              opacity: 1,
              y: sectorBox.y - textBox.height / 2
            }, 800, mina.elastic);
          }, duration * 1.4);
        };

        for (var _iterator = this.groups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop2 = function _loop2() {
          var g = _step2.value;

          var sector = g[0],
              text = g[1];

          sector.hover(function (e) {
            sector.animate({
              d: _util2.default.describeSector(_this.c, _this.c, _this.r - _this.r / 15, _this.r2, 0, sector.data('angle'))
            }, 500, mina.elastic);

            _this.cb();
          }, function (e) {
            sector.stop().animate({
              d: _util2.default.describeSector(_this.c, _this.c, _this.r, _this.r2, 0, sector.data('angle'))
            }, 500, mina.elastic);
          });
        };

        for (var _iterator2 = this.groups[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          _loop2();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: '_draw',
    value: function _draw() {
      var totalAngle = 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.sectorsData[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _sector2 = _step3.value;

          var s = this._sector(_sector2.angle).attr({
            fill: _sector2.fill,
            strokeDasharray: 2 * Math.PI * _sector2.angle,
            strokeDashoffset: 2 * Math.PI * _sector2.angle,
            strokeWidth: 1,
            stroke: _sector2.fill,
            fillOpacity: 0
          }).transform('r' + totalAngle + ', ' + this.c + ', ' + this.c);

          s.data('angle', _sector2.angle);

          var t = this.paper.text(this.c, this.c, this._getPersentage(_sector2.angle) + '%').attr({
            textAnchor: 'middle',
            opacity: 0,
            fontFamily: 'Ubuntu Light',
            fill: '#3d3d3d'
          }).transform('r' + (totalAngle + _sector2.angle / 2) + ', ' + this.c + ', ' + this.c);

          this._group(s, t);

          totalAngle += _sector2.angle;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (Math.round(totalAngle) < 360) {
        this._getMissingSector(totalAngle);
      }

      this._animate(this.animationDuration);
    }
  }]);

  return Pie;
}();

exports.default = Pie;

},{"./util":15}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Radial = function () {
  function Radial(settings) {
    _classCallCheck(this, Radial);

    this.persent = settings.persent, this.r = settings.r, this.width = settings.width, this.strokeFilled = settings.strokeFilled || '#3d3d3d', this.strokeEmpty = settings.strokeEmpty || settings.fill || '#eee', this.fill = settings.fill || settings.strokeEmpty || 'transparent', this.fontClass = settings.fontClass, this.fontColor = settings.fontColor || settings.strokeFilled, this.fontFamily = settings.fontFamily, this.fontWeight = settings.fontWeight, this.duration = settings.duration;

    this.paper = Snap(settings.selector).attr({
      height: this.r * 2 + this.width * 2,
      width: this.r * 2 + this.width * 2
    });

    this._draw();
  }

  _createClass(Radial, [{
    key: '_updatePath',
    value: function _updatePath(coords, radius, persents) {
      var deg = persents * 359.9999 / 100;
      this.path.attr({
        d: _util2.default.describeArc(coords.x, coords.y, radius, 0, deg)
      });
    }
  }, {
    key: '_draw',
    value: function _draw() {
      var _this = this;

      this.paper.circle(this.r + this.width, this.r + this.width, this.r).attr({
        fill: this.fill,
        stroke: this.strokeEmpty,
        strokeWidth: this.width
      });

      this.path = this.paper.path('').attr({
        fill: 'transparent',
        stroke: this.strokeFilled,
        strokeWidth: this.width
      });

      var currentPersent = 1;

      var t = this.paper.text(0, 0, currentPersent < 10 ? '0%' : '00%').attr({
        fontSize: this.r / 2.7 + 'px',
        textAnchor: 'middle',
        fill: this.fontColor,
        fontFamily: this.fontFamily,
        fontWeight: this.fontWeight
      }).addClass(this.fontClass);

      t.attr({
        y: this.r + this.width + t.getBBox().h / 2,
        x: this.r + this.width
      });

      var coords = {
        x: this.r + this.width,
        y: this.r + this.width
      };

      var timer = setInterval(function () {
        if (currentPersent >= _this.persent) {
          clearInterval(timer);
        }

        _this._updatePath(coords, _this.r, currentPersent);
        t.attr({ text: currentPersent + '%' });

        currentPersent++;
      }, this.duration / this.persent);

      this.path.attr({ strokeWidth: this.width || 10 });
    }
  }]);

  return Radial;
}();

exports.default = Radial;

},{"./util":15}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: 'polarToCartesian',
    value: function polarToCartesian(cx, cy, r, angle) {
      angle = (angle - 90) * Math.PI / 180;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle)
      };
    }
  }, {
    key: 'describeArc',
    value: function describeArc(x, y, r, startAngle, endAngle, continueLine) {
      var start = this.polarToCartesian(x, y, r, startAngle %= 360),
          end = this.polarToCartesian(x, y, r, endAngle %= 360),
          large = Math.abs(endAngle - startAngle) >= 180,
          alter = endAngle > startAngle;

      return (continueLine ? 'L' : 'M') + ' ' + start.x + ',' + start.y + '\n    A' + r + ',' + r + ',0 ' + (large ? 1 : 0) + ',' + (alter ? 1 : 0) + ',' + end.x + ',' + end.y;
    }
  }, {
    key: 'describeSector',
    value: function describeSector(x, y, r, r2, startAngle, endAngle) {

      return '\n      ' + this.describeArc(x, y, r, startAngle, endAngle) + '\n      ' + this.describeArc(x, y, r2, endAngle, startAngle, true) + 'Z\n    ';
    }
  }]);

  return Util;
}();

exports.default = Util;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var items = $('.main-nav li'),
      activeItemClass = 'sidebar-item-active';

  var panels = {
    user: _usercardPanel2.default,
    calendar: _calendarPanel2.default,
    search: undefined,
    filter: undefined,
    charts: _chartsPanel2.default,
    settings: undefined
  };

  bindEvents();

  function bindEvents() {

    items.click(function (e) {
      var el = $(e.target);
      if (el.hasClass('fa')) el = el.parent();

      var panel = panels[el.attr('id')]();

      if (el.hasClass(activeItemClass)) {
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

var _calendarPanel = require('./calendar/calendar-panel');

var _calendarPanel2 = _interopRequireDefault(_calendarPanel);

var _usercardPanel = require('./usercard/usercard-panel');

var _usercardPanel2 = _interopRequireDefault(_usercardPanel);

var _chartsPanel = require('./chart/charts-panel');

var _chartsPanel2 = _interopRequireDefault(_chartsPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./calendar/calendar-panel":4,"./chart/charts-panel":6,"./usercard/usercard-panel":17}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var panelSelector = '.side-panel',
      panel = $(panelSelector);

  return {
    show: function show() {
      var usercardEl = (0, _usercard2.default)(panelSelector);
      panel.css({
        width: '250px',
        background: usercardEl.css('background-color')
      });
    },
    hide: function hide() {
      panel.css({ width: 0 });
      panel.empty();
    }
  };
};

var _usercard = require('./usercard');

var _usercard2 = _interopRequireDefault(_usercard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./usercard":18}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (selector) {

  var template = '\n    <div class="usercard-wrap">\n\n      <div class="usercard-avatar">\n        <img src="img/avatar.jpg"class="avatar"/>\n        <div class="username">john doe</div>\n        <div class="usercard-email">\n          <p>email@gmail.com</p>\n        </div>\n      </div>\n\n      <div class="usercard-progress-view">\n        <div class="progress-view-title">Today\'s progress</div>\n        <div class="usercard-progressbar">\n          <div style="width: 80%" class="progressbar-fill"></div>\n        </div>\n        <div class="progress-view-title">Total progress</div>\n        <div class="usercard-progressbar">\n          <div style="width: 40%" class="progressbar-fill"></div>\n        </div>\n      </div>\n      \n      <div class="usercard-summary-view">\n        <div class="summary">\n          <span>Completed:</span>\n          <span>126</span>\n        </div>\n        <div class="summary">\n          <span>Overdue:</span>\n          <span>14</span>\n        </div>\n      </div>\n\n      <div class="social-wrap">\n        <i class="fa fa-facebook"></i>\n        <i class="fa fa-github"></i>\n        <i class="fa fa-linkedin"></i>\n        <i class="fa fa-google-plus"></i>\n      </div>\n      \n    </div>';

  $(selector).html(template);

  var el = $('.usercard-wrap');

  return el;
};

;

},{}]},{},[3]);
