(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var panelSelector = '.side-panel';
  var panel = $(panelSelector),
      selectors = ['#chart-completed', '#chart-overdue'];

  var template = '\n    <div class="chartzones">\n      <div class="chartzone-wrap">\n        <div class="chartzone-top">\n          <div class="fa fa-sliders"></div>\n        </div>\n        <div class="chartzone">\n          <svg id="' + selectors[0].slice(1) + '"></svg>\n        </div>\n      </div>\n      <div class="chartzone-wrap">\n        <div class="chartzone-top">\n          <div class="fa fa-sliders"></div>\n        </div>\n        <div class="chartzone">\n          <svg id="' + selectors[1].slice(1) + '"></svg>\n        </div>\n      </div>\n      <div class="chartzone-wrap">\n        <div class="chartzone-top"></div>\n        <div class="chartzone"></div>\n      </div>\n    </div>\n  ';

  var show = function show() {

    var height = 150,
        width = 450;

    panel.html(template);

    _chart2.default.plainChart({
      selector: selectors[0],
      period: 30,
      height: height,
      width: width,
      axis: false,
      hover: function hover() {},
      grid: { color: '#eee', rows: true, columns: true }
    }, [{
      data: _demo2.default[0],
      type: 'linear',
      line: { color: '#cc5656' },
      point: {
        outerColor: '#cc5656',
        innerColor: '#fff',
        strokeWidth: 2
      }
    }]);

    _chart2.default.plainChart({
      selector: selectors[1],
      period: 20,
      height: height,
      width: width,
      axis: false,
      hover: function hover() {},
      grid: { columns: true, rows: true, color: '#eee' }
    }, [{
      data: _demo2.default[0],
      type: 'bar',
      line: { color: '#fff', fill: '#db5e5e', hoverColor: '#b23636' }
    }]);

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

var _chart = require('./charts/chart');

var _chart2 = _interopRequireDefault(_chart);

var _demo = require('./charts/demo');

var _demo2 = _interopRequireDefault(_demo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./charts/chart":4,"./charts/demo":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  radialChart: function radialChart(args) {
    if (args.persent > 100) args.persent = 100;
    if (args.persent < 0) args.persent = 0;

    /********************************************
    * INIT
    ********************************************/
    var persent = args.persent,
        r = args.r,
        width = args.width,
        parent = Snap.select(args.parent),
        strokeFilled = args.strokeFilled || '#3d3d3d',
        strokeEmpty = args.strokeEmpty || args.fill || '#eee',
        fill = args.fill || args.strokeEmpty || 'transparent',
        fontClass = args.fontClass,
        fontColor = args.fontColor || args.strokeFilled,
        fontFamily = args.fontFamily,
        fontWeight = args.fontWeight,
        duration = args.duration;

    var path = void 0;

    /********************************************
    * PRIVATE
    ********************************************/

    function polarToCartesian(cx, cy, r, angle) {
      angle = (angle - 90) * Math.PI / 180;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle)
      };
    }

    function describeArc(x, y, r, startAngle, endAngle) {
      startAngle = startAngle % 360;
      var start = polarToCartesian(x, y, r, startAngle),
          end = polarToCartesian(x, y, r, endAngle),
          large = Math.abs(endAngle - startAngle) >= 180;
      return 'M' + start.x + ',' + start.y + ' A' + r + ',' + r + ',0,' + (large ? 1 : 0) + '1,' + end.x + ',' + end.y;
    }

    function updatePath(coords, radius, persents) {
      var deg = persents * 359.9999 / 100;
      path.attr({
        d: describeArc(coords.x, coords.y, radius, 0, deg)
      });
    }

    function draw(duration) {
      var sector = Snap(parent).attr({
        height: r * 2 + width * 2,
        width: r * 2 + width * 2
      });

      var circle = sector.circle(r + width, r + width, r).attr({
        fill: fill,
        stroke: strokeEmpty,
        strokeWidth: width
      });

      path = sector.path('').attr({
        fill: 'transparent',
        stroke: strokeFilled,
        strokeWidth: width
      });

      var currentPersent = 1;

      var t = sector.text(0, 0, currentPersent < 10 ? '0%' : '00%').attr({
        fontSize: r / 2.7 + 'px',
        textAnchor: 'middle',
        fill: fontColor,
        fontFamily: fontFamily,
        fontWeight: fontWeight
      }).addClass(fontClass);

      t.attr({
        y: r + width + t.getBBox().h / 2,
        x: r + width,
        text: 75 + '%'
      });

      var coords = {
        x: r + width,
        y: r + width
      };

      var timer = setInterval(function () {
        if (currentPersent >= persent) clearInterval(timer);
        updatePath(coords, r, currentPersent);
        t.attr({ text: currentPersent + '%' });

        currentPersent++;
      }, duration / persent);

      path.attr({ strokeWidth: width || 10 });
    }

    draw(duration);
  },

  plainChart: function plainChart(settings, charts) {
    if (!settings || !charts) return false;

    var colWidth = settings.width / settings.period,
        offsetX = colWidth,
        offsetY = 5,
        scale = settings.scale || 10;

    settings.width += offsetX;
    settings.height += offsetY * 2;

    var paper = Snap(settings.selector).attr({
      height: settings.height,
      width: settings.width + 50,
      viewBox: '0 -' + (settings.height - 5) + ' ' + settings.width + ' ' + settings.height
    });

    if (settings.grid.rows || settings.grid.columns) {
      buildGrid(paper, offsetX, offsetY, scale, settings.width, settings.height, colWidth, settings.grid);
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = charts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var chartData = _step.value;


        var columns = getColumns(chartData.data, settings.period),
            type = chartData.type || 'linear';

        var defaultColor = '#aaa';

        chartData.point = chartData.point || {};
        chartData.line = chartData.line || {};

        var chartStyle = {
          opacity: chartData.line.opacity || 0.5,
          color: chartData.line.color || defaultColor,
          fill: chartData.line.fill || defaultColor,
          width: chartData.line.width || 2,
          hover: chartData.line.hoverColor || defaultColor,
          point: {
            r: chartData.point.radius || 4,
            fill: chartData.point.innerColor || defaultColor,
            stroke: chartData.point.outerColor || defaultColor,
            strokeWidth: chartData.point.strokeWidth || 3
          }
        };

        switch (type) {
          case 'area':
            buildAreaPath(paper, columns, offsetX, offsetY, scale, settings.width, colWidth, chartStyle);break;
          case 'linear':
            buildLinearPath(paper, columns, offsetX, offsetY, scale, colWidth, chartStyle, settings.hover);break;
          case 'bar':
            buildBarChart(paper, columns, offsetX, offsetY, scale, colWidth, chartStyle, settings.hover);break;
          default:
            buildLinearPath(paper, columns, offsetX, offsetY, scale, colWidth, chartStyle, settings.hover);
        }
      } // for
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

    if (settings.axis) buildAxis(paper, settings.height, settings.width, offsetY);

    /*****************************************************
    *  FUNCTIONS
    *****************************************************/

    function buildAxis(_paper, _height, _width, _offsetY) {
      _paper.path('M0,' + -_height + ' L0,' + _offsetY + ' L' + _width + ',' + _offsetY).attr({
        fill: 'transparent',
        stroke: '#aaa',
        strokeWidth: '2px'
      });
    }

    function buildGrid(_paper, _offsetX, _offsetY, _scale, _width, _height, _colWidth, gridOps) {
      var rowsPathString = '',
          colsPathString = '',
          rows = [];

      var gridStyle = {
        fill: 'transparent',
        stroke: gridOps.color || '#aaa',
        strokeWidth: '1px'
      };

      gridOps.text = gridOps.text || {};

      var textStyle = {
        fontFamily: gridOps.text.fontFamily || 'PT Sans',
        fontWeight: gridOps.text.fontWeight || 'bold',
        fontSize: gridOps.text.fontSize || '.8em',
        textAnchor: 'middle',
        fill: gridOps.text.color || '#aaa'
      };

      if (gridOps.rows) {
        for (var i = 0; i < _height / _scale; i++) {
          if (i % 2 == 0) rows.push(i);
        }var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = rows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var point = _step2.value;

            var y = point * _scale + _offsetY;
            _paper.text(-15, -y + _offsetY, '' + point).attr(textStyle);
            rowsPathString += ' M0,-' + y + ' L' + _width + ',-' + y;
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

        _paper.path(rowsPathString).attr(gridStyle);
      }

      if (gridOps.columns) {
        for (var _i = 0; _i < _width / _colWidth; _i++) {
          if (_i % 2 == 0) {
            colsPathString += 'M' + _offsetX + ',0 L' + _offsetX + ',-' + _height;
          }
          _offsetX += _colWidth;
        }
        _paper.path(colsPathString).attr(gridStyle);
      }
    }

    function buildAreaPath(_paper, _columns, _offsetX, _offsetY, _scale, _width, _colWidth, style) {

      var chartPath = _paper.path().attr({
        stroke: style.color,
        fill: style.fill,
        fillOpacity: 0,
        strokeWidth: style.width,
        strokeDasharray: 3000,
        strokeDashoffset: 3000,
        strokeLinejoin: 'round'
      });

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _columns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var col = _step3.value;


          var pathString = chartPath.attr('d'),
              coords = _offsetX + ',' + (-col.count * _scale - _offsetY),
              startPos = 'M' + (_width - _offsetY) + ',-' + _offsetY + ' L' + _offsetY + ',-' + _offsetY;

          chartPath.attr({
            d: pathString ? pathString + ('L ' + coords) : startPos + ('L ' + coords)
          });
          _offsetX += _colWidth;
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

      chartPath.attr({ d: chartPath.attr('d') + 'Z' });
      chartPath.animate({
        strokeDashoffset: 0
      }, 2000);

      setTimeout(function () {
        chartPath.animate({ fill: style.fill, fillOpacity: style.opacity }, 300);
      }, 1500);
    }

    function buildLinearPath(_paper, _columns, _offsetX, _offsetY, _scale, _colWidth, style, callback) {

      var chartPath = paper.path().attr({
        stroke: style.color,
        fill: 'transparent',
        fillOpacity: style.opacity,
        strokeWidth: style.width,
        strokeDasharray: 3000,
        strokeDashoffset: 3000,
        strokeLinejoin: 'round'
      });

      var timeout = 0;

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        var _loop = function _loop() {
          var col = _step4.value;


          var pointCoords = {
            x: _offsetX,
            y: -col.count * _scale - _offsetY
          };

          var point = _paper.circle(pointCoords.x, pointCoords.y, 0).attr({
            strokeWidth: style.point.strokeWidth,
            stroke: style.point.stroke,
            fill: style.point.fill,
            cursor: 'pointer'
          });

          setTimeout(function () {
            point.animate({ r: style.point.r }, 200, mina.easein);
          }, timeout);
          timeout += 30;

          var timer = void 0;
          point.hover(function (e) {
            this.stop().animate({ r: style.point.r * 2 }, 1000, mina.elastic);
            callback(e, col);
          }, function () {
            clearTimeout(timer);
            this.stop().animate({ r: style.point.r }, 1000, mina.elastic);
          });

          var pathString = chartPath.attr('d'),
              coords = _offsetX + ', ' + (-col.count * _scale - _offsetY);

          chartPath.attr({
            d: pathString ? pathString + ('L ' + coords) : 'M ' + coords
          });
          _offsetX += _colWidth;
        };

        for (var _iterator4 = _columns[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          _loop();
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

      chartPath.animate({
        strokeDashoffset: 0
      }, 3000);
    }

    function buildBarChart(_paper, _columns, _offsetX, _offsetY, _scale, _colWidth, style, callback) {
      var timeout = 0;

      _offsetX /= 2;

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        var _loop2 = function _loop2() {
          var col = _step5.value;

          if (col.count) {
            (function () {
              var bar = _paper.rect(_offsetX, -_offsetY, _colWidth, 0).attr({
                fill: style.fill,
                stroke: style.color,
                cursor: 'pointer'
              });

              setTimeout(function () {
                bar.animate({
                  y: -col.count * _scale - _offsetY,
                  height: col.count * _scale
                }, 1500, mina.elastic);
              }, timeout);

              bar.hover(function (e) {
                this.stop().animate({ fill: style.hover }, 200, mina.easeinout);
                callback(e, col);
              }, function () {
                this.stop().animate({ fill: style.fill }, 200, mina.easeinout);
              });
            })();
          }
          timeout += 40;
          _offsetX += _colWidth;
        };

        for (var _iterator5 = _columns[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          _loop2();
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }

    function getColumns(tasks, _period) {
      _period = _period || 30;

      var daysInMonth = function daysInMonth(year, month) {
        return 32 - new Date(year, month, 32).getDate();
      };

      var curDate = new Date(),
          columns = [],
          curDay = curDate.getDate(),
          curMonth = curDate.getMonth(),
          curYear = curDate.getFullYear();

      --curDay;
      /*************************************************
      * CREATE LIST OF CHART COLUMNS
      *************************************************/
      for (var i = 0; i < _period; i++) {
        if (curDay == 0) curDay = daysInMonth(curYear, --curMonth);

        columns.push({
          date: new Date(curYear, curMonth, curDay--).getTime(),
          count: 0,
          tasks: []
        });
      }

      /*************************************************
      * CREATE CHART POINTS
      *************************************************/
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = tasks[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var task = _step6.value;

          var taskTime = task.date.setHours(0, 0, 0, 0);

          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = columns[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var _col = _step7.value;

              if (_col.date == taskTime) {
                _col.count++;
                _col.tasks.push(task);
              }
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      return columns.reverse();
    }
  }

};

},{}],5:[function(require,module,exports){
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

// Chart.plainChart({
//   selector: '#paper',
//   height: 150,
//   width: 550,
//   period: 30,
//   scale: 10,
//   axis: false,
//   hover: hoverHandler,
//   grid: {
//     rows: true,
//     columns: true,
//     color: '#6D6C6C',
//     text: {
//       color: '#fff',
//       fontFamily: 'PT Sans',
//       fontWeight: 'bold',
//       fontSize: '.8em'
//     }
//   }
// }, [
//   {
//     data: data2,
//     type: 'area',
//     line: {
//       color: '#ccc',
//       fill: '#2d2d2d',
//       opacity: .8,
//       width: 1
//     }
//   },
//   {
//     data: data,
//     type: 'linear',
//     line: {
//       color: '#fff',
//       width: 3
//     },
//     point: {
//       radius: 5,
//       innerColor: '#fff',
//       outerColor: '#3d3d3d',
//       strokeWidth: 1
//     },
//   },
// ]);


// function hoverHandler(e, point) {
//   console.log(new Date(point.date));
// }

},{}],6:[function(require,module,exports){
'use strict';

var _nav = require('./nav');

var _nav2 = _interopRequireDefault(_nav);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _nav2.default)();

},{"./nav":7}],7:[function(require,module,exports){
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

var _usercardPanel = require('./usercard-panel');

var _usercardPanel2 = _interopRequireDefault(_usercardPanel);

var _chartsPanel = require('./charts-panel');

var _chartsPanel2 = _interopRequireDefault(_chartsPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./calendar-panel":1,"./charts-panel":3,"./usercard-panel":8}],8:[function(require,module,exports){
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

},{"./usercard":9}],9:[function(require,module,exports){
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

},{}]},{},[6]);
