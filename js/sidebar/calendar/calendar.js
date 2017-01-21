import fakeData from '../chart/src/demo.js';
import {daysInMonth} from '../../utils/date-utils.js';

export default function(params) {
  if(!params) return false;

  /***********************************************
  * INIT
  ************************************************/
  let increaseDay, decreaseDay;

  let curDate = new Date(),
  yearFirst = params.yearFirst || curDate.getFullYear() - 2,
  yearLast = params.yearLast || curDate.getFullYear(),
  yearPrimary = params.yearPrimary || curDate.getFullYear() - 2,
  onclick = params.onclick,
  currentCalendar, currentMonthNumber, currentYear,
  currentDay = curDate.getDate(),
  yearSlider = initYearSlider(yearFirst, yearLast, yearPrimary),
  monthSlider = initMonthSlider( (params.datePrimary) ? params.datePrimary.getMonth() : params.month);

  this.increaseDay = increaseDay;
  this.decreaseDay = decreaseDay;

  /*****************************************************************************************
  * The function generates information about the year, which was given in params.
  * @return Array of objects, each of which contains name, count of days,
  * the first and the last days of the month
  *****************************************************************************************/
  function generateYearCalendar(year) {
    const startsWith = function(month) { return new Date(year, month, 1).getDay(); };
    const endsWidth = function(month) { return new Date(year, month, daysInMonth(year, month)).getDay(); };

    let monthNames = `January February March April May
    June July August September October November December`.split(/\s+/),
    months = [];

    for(let i = 0; i < 12; i++) {
      months.push({
        name: monthNames[i],
        days: daysInMonth(year, i),
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
    let yearsTape = $('.year-slider-tape');

    /***********************************
    * Need to generate markup which contains years in range,
    * that we was given in function params.
    * for better appearance we need to add first and last "out of range" years
    ***********************************/
    for(let i = yearFirst; i <= yearLast; i++) {
      if(i == yearFirst)
        yearsTape.append(` <div class="year year-denied">${i-1}</div> `);

      let yearClass = (i == yearPrimary) ? 'year year-primary' : 'year';
      yearsTape.append(` <div class="${yearClass}">${i}</div> `);

      if(i == yearLast)
        yearsTape.append(` <div class="year year-denied">${i+1}</div> `);
    }

    let tapeWrap = $('.year-slider-tape-wrap'),
        primaryYearEl = $('.year-primary');

    /***********************************
    * Need to scroll the years tape to proper position,
    * where the primary item will be centered
    ************************************/
    setTimeout(function() {
      yearsTape.animate({
        left: -(primaryYearEl.position().left - tapeWrap.width() / 2 +  primaryYearEl.outerWidth(true) / 2)
      }, 50);
    }, 400);

    /************************************
    * Generate calendar according to the current year
    *************************************/
    currentCalendar = generateYearCalendar(primaryYearEl.text());
    currentYear = primaryYearEl.text();

    $('.year-slider-right-control').click(increaseYear);
    $('.year-slider-left-control').click(decreaseYear)

    /*************************************
    * Decrease year event
    *************************************/
    function decreaseYear() {

      let primaryClass = 'year-primary',
      prevEl = primaryYearEl.prev(),
      primaryWidth = primaryYearEl.outerWidth(true),
      ordinaryWidth = prevEl.outerWidth(true);

      if(!prevEl.hasClass('year-denied')) {
        prevEl.addClass(primaryClass);
        primaryYearEl.removeClass(primaryClass);
        primaryYearEl = prevEl;
        yearsTape.animate({left: `+=${tapeWrap.width() / 2 - primaryYearEl.outerWidth(true) / 2}`}, 300)
      } else return false;

      currentCalendar = generateYearCalendar(primaryYearEl.text());

      renderCells(currentMonthNumber);
      return true;
    }

    /*************************************
    * Increase year event
    *************************************/
    function increaseYear() {
      let primaryClass = 'year-primary',
          nextEl = primaryYearEl.next();

      if(!nextEl.hasClass('year-denied')) {
        nextEl.addClass(primaryClass);
        primaryYearEl.removeClass(primaryClass);
        primaryYearEl = nextEl;
        yearsTape.animate({left: `-=${tapeWrap.width() / 2 - primaryYearEl.outerWidth(true) / 2}`}, 300)
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
    let monthsContainer = $('.month-numbers'),
        monthLine = $('.month-line'),
        sliderCircle = monthLine.find('.slider-circle'),
        currentMonthClass = 'month-current',
        monthTitleEl = $('.month-title');

    for(let i = 1; i <= 12; i++)
      monthsContainer.append(` <div>${i}</div> `);

    /************************************************
    * In order to move slider circle next to active month number
    * there is a need to have coordinate representation of points, where
    * the circle has to be fixed
    *************************************************/

    let monthsEl = monthsContainer.find('div');

    /* Mark clicked month as active */
    monthsEl.click(function() {
      switchMonth($(this).text()-1);
    });

    function switchMonth(number, options = {}) {
      monthsEl.removeClass(currentMonthClass);
      monthsEl.eq(number).addClass(currentMonthClass);

      setTimeout(() => {
        sliderCircle.css('left', monthsEl.eq(number).position().left);
      }, options.init ? 300 : 0);

      monthTitleEl.text(currentCalendar[number].name);
      currentMonth = currentMonthNumber = number;
      renderCells(currentMonth, options);
    }

    switchMonth(currentMonth || curDate.getMonth(), { init: true });

    return { switchMonth: switchMonth };
  }

  function renderCells(month, options) {
    let cellsContainer = $('.calendar-cells-wrap'),
        cellsMarkup = '';

    /*****************************************************************************************
    * Rendering missing cells to fill empty place BEFORE current cells
    *****************************************************************************************/
    let missingCellsCount = 7 - (7 - currentCalendar[month].firstDay), prevMonthDaysCount;

    /* if the current month is the first in year, than the previous month is the last in the year */
    if(month == 0)
      prevMonthDaysCount = currentCalendar[11].days;
    else
      prevMonthDaysCount = currentCalendar[month-1].days;

    /* only for a better appearance */
    if(missingCellsCount == 0) missingCellsCount = 7;

    for(let i = prevMonthDaysCount + 1 - missingCellsCount; i <= prevMonthDaysCount; i++)
      cellsMarkup += `<div class="cell cell-out cell-prev">${i}</div>`

    /*****************************************************************************************
    * Rendering cells of the current month
    *****************************************************************************************/
    let currentMonthDaysCount = currentCalendar[month].days;

    for(let i = 1; i <= currentMonthDaysCount; i++) {
      if(options && options.cellToActivate && i == options.cellToActivate)
        cellsMarkup += 
        `<div id="cell-${i}" class="cell ${options.activeCellClass}">${i}</div>`
      else
        cellsMarkup +=
        `<div id="cell-${i}" class="cell">${i}</div>`
    }

    /*****************************************************************************************
    * Rendering missing cells to fill the empty place after the current cells
    *****************************************************************************************/
    missingCellsCount = 7 - (currentCalendar[month].lastDay + 1);

    /* only for a better appearance */
    if(missingCellsCount == 0) missingCellsCount = 7;

    for(let i = 1; i <= missingCellsCount; i++)
      cellsMarkup += `<div class="cell cell-out cell-next">${i}</div>`

    cellsContainer.html(cellsMarkup);
    initEvents();


    /*****************************************************************************************
    * Find today`s cell
    *****************************************************************************************/
    let dp = params.datePrimary;
    if(dp && currentMonthNumber == dp.getMonth() && currentYear == dp.getFullYear()) {
      $(`#cell-${dp.getDate()}`).addClass('cell-active');
    } else if(currentMonthNumber == curDate.getMonth() && currentYear == curDate.getFullYear()) {
      $(`#cell-${curDate.getDate()}`).addClass('cell-today');
    }

    if(!dp) {
      addHints();
    }

  }

  function addHints() {
    // here we load all uncompleted tasks for the current month
    
    let data = _.groupBy(fakeData[2], 'date');

    for(let [date, tasks] of Object.entries(data)) {
      date = new Date(date);
      $(`#cell-${date.getDate()}`).append(`
        <div class="calendar-cell-number">${tasks.length}</div>
      `);
    }

  }

  /*****************************************************************************************
  * As long as cells are redrawing always when user changes the month wee need to set up
  * all cell event handlers
  *****************************************************************************************/
  function initEvents() {
    let cells = $('.cell'),
    activeCellClass = 'cell-active';

    cells.click(function() {
      switchDay( $(this).text(), {el: $(this)});
    });

    function switchDay(day, options, doNothing) {
      currentDay = day;

      let el;

      if(options && options.el)
        el = options.el;
      else
        el = $(`#cell-${day}`);

      if( el.hasClass('cell-prev') ) {
        if(currentMonthNumber == 0){
          if(currentYear == yearFirst) return false;
          yearSlider.decreaseYear();
          currentMonthNumber = 12;
        }

        monthSlider.switchMonth(--currentMonthNumber, {
          cellToActivate: day,
          activeCellClass: activeCellClass
        });

        if(!doNothing)
          return doCallback();
      }

      if( el.hasClass('cell-next') ) {
        if(currentMonthNumber == 11) {
          if(currentYear == yearLast) return false;
          yearSlider.increaseYear();
          currentMonthNumber = -1;
        } 
        monthSlider.switchMonth(++currentMonthNumber, {
          cellToActivate: day,
          activeCellClass: activeCellClass,
        });

        if(!doNothing)
          return doCallback();
      }

      $('.cell').removeClass(activeCellClass);
      el.addClass(activeCellClass);

      if(!doNothing) doCallback();
    } // switchDay

    function doCallback() {
      return onclick({
        day: currentDay,
        month: currentMonthNumber + 1,
        year: currentYear,
        monthName: currentCalendar[currentMonthNumber].name,
        weekday: weekday(currentDay),
        instance: new Date(currentYear, currentMonthNumber, currentDay)
      });

      function weekday(day) {
        let weekdays = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(/\s+/);
        return weekdays[new Date(currentYear, currentMonthNumber, day).getDay()];
      }
    }

    increaseDay = function() {
      if(currentDay == currentCalendar[currentMonthNumber].days) {

        if(currentMonthNumber == 11) {
          if(yearSlider.increaseYear())
            currentMonthNumber = -1;
          else return false;
        }

        monthSlider.switchMonth(++currentMonthNumber);
        currentDay = 0;
      }
      switchDay(++currentDay);
    };

    decreaseDay = function() {
      if(currentDay == 1) {

        if(currentMonthNumber == 0) {
          if(yearSlider.decreaseYear())
            currentMonthNumber = 12;
          else return false;
        }

        monthSlider.switchMonth(--currentMonthNumber);
        currentDay = currentCalendar[currentMonthNumber].days + 1;
      }
      switchDay(--currentDay);
    };

  } //init events

  return $('.calendar-wrap');
};
