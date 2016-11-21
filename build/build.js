(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (selector) {
  var panel = $('.side-panel');

  var instance = {
    show: function show() {
      var calendar = new _calendar2.default({
        container: '.side-panel',
        yearFirst: 2012,
        yearLast: 2028,
        yearPrimary: 2016,
        onclick: function onclick() {}
      });

      panel.css('width', calendar.width() + 40 + 'px');
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

},{"./calendar":2}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
'use strict';

var _nav = require('./nav');

var _nav2 = _interopRequireDefault(_nav);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _nav2.default)();

},{"./nav":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var items = $('.main-nav li'),
      activeItemClass = 'sidebar-item-active';

  var panels = {
    user: undefined,
    calendar: _calendarPanel2.default,
    search: undefined,
    filter: undefined,
    charts: undefined,
    settings: undefined
  };

  /********************************
  * INIT
  ********************************/
  initEvents();

  function initEvents() {

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

var _calendarPanel = require('./calendar-panel');

var _calendarPanel2 = _interopRequireDefault(_calendarPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./calendar-panel":1}]},{},[3]);
