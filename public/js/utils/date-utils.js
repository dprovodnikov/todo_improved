export function rand(l, h) { return Math.floor((h-l+1)*Math.random())+Math.floor(l) }

export function tomorrow() {
  let curDate = new Date();
  return new Date(curDate.setDate(curDate.getDate() + 1));
};

export function thisDayNextWeek() {
  let curDate = new Date();
  return new Date(curDate.setDate(curDate.getDate() + 7));
}

export function weekday(date) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
}

export function daysInMonth(year, month) {
  return 32 - new Date(year, month, 32).getDate()
};

export function compare(a, b) {
  return a.getDate() == b.getDate() &&
         a.getMonth() == b.getMonth() &&
         a.getFullYear() == b.getFullYear();
}

export function getDatesForThePeriod(period) {
  let date, output, day;

  date = new Date();
  day = date.getDate();
  output = [];

  for(let i = 0; i < period; i++)
    output.push(
      new Date(date.getFullYear(), date.getMonth(), day--)
    );

  return output;
};

export function getDaysFromNowToTheEndOfTheMonth(from=false) {
  let curDate, day, output;

  curDate = new Date();
  day = curDate.getDate();
  output = [];
  from = from || day;

  for(let i = from; i <= daysInMonth(curDate.getFullYear(), curDate.getMonth()); i++)
    output.push(new Date(curDate.getFullYear(), curDate.getMonth(), i));

  return output;
}

export function format(format, date, settings) {
  if (!date) return '';

  let iFormat,
    dayNamesShort = '',
    dayNames = '',
    monthNamesShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    monthNames = ['January','February','March','April','May','Jun','July','August','September','October','Novemver','December'],

    // Check whether a format character is doubled
    lookAhead = function( match ) {
      let matches = (iFormat + 1 < format.length && format.charAt( iFormat + 1 ) === match);

      if (matches) {
        iFormat++;
      }

      return matches;
    },

    // Format a number, with leading zero if necessary
    formatNumber = function( match, value, len ) {
      let num = '' + value;
      if ( lookAhead( match ) ) {
        while ( num.length < len ) {
          num = "0" + num;
        }
      }
      return num;
    },

    // Format a name, short or long as requested
    formatName = function( match, value, shortNames, longNames ) {
      return ( lookAhead( match ) ? longNames[ value ] : shortNames[ value ] );
    },
    output = '',
    literal = false;

  if ( date ) {
    for ( iFormat = 0; iFormat < format.length; iFormat++ ) {
      if ( literal ) {
        if ( format.charAt( iFormat ) === "'" && !lookAhead( "'" ) ) {
          literal = false;
        } else {
          output += format.charAt( iFormat );
        }
      } else {
        switch ( format.charAt( iFormat ) ) {
          case "d":
            output += formatNumber( "d", date.getDate(), 2 );
            break;
          case "D":
            output += formatName( "D", date.getDay(), dayNamesShort, dayNames );
            break;
          case "o":
            output += formatNumber( "o",
              Math.round( ( new Date( date.getFullYear(), date.getMonth(), date.getDate() ).getTime() - new Date( date.getFullYear(), 0, 0 ).getTime() ) / 86400000 ), 3 );
            break;
          case "m":
            output += formatNumber( "m", date.getMonth() + 1, 2 );
            break;
          case "M":
            output += formatName( "M", date.getMonth(), monthNamesShort, monthNames );
            break;
          case "y":
            output += ( lookAhead( "y" ) ? date.getFullYear() :
              ( date.getFullYear() % 100 < 10 ? "0" : '' ) + date.getFullYear() % 100 );
            break;
          case "h":
            output += formatNumber( "H", date.getHours(), 2);
            break;
          case "t":
            output += formatNumber( "t", date.getMinutes(), 2);
            break;
          case "@":
            output += date.getTime();
            break;
          case "!":
            output += date.getTime() * 10000 + this._ticksTo1970;
            break;
          case "'":
            if ( lookAhead( "'" ) ) {
              output += "'";
            } else {
              literal = true;
            }
            break;
          default:
            output += format.charAt( iFormat );
        }
      }
    }
  }
  return output;
}
