export default {

  radialChart: function(args) {
    if(args.persent > 100) args.persent = 100;
    if(args.persent < 0) args.persent = 0;

    /********************************************
    * INIT
    ********************************************/
    let persent = args.persent,
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

      let path;

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
      let start = polarToCartesian(x, y, r, startAngle),
          end = polarToCartesian(x, y, r, endAngle),
          large = Math.abs(endAngle - startAngle) >= 180;
      return `M${start.x},${start.y} A${r},${r},0,${large ? 1 : 0}1,${end.x},${end.y}`;
    }

    function updatePath(coords, radius, persents) {
      let deg = persents * 359.9999 / 100;
      path.attr({
        d: describeArc(coords.x, coords.y, radius, 0, deg)
      });
    }

    function draw(duration) {
      const sector = Snap(parent).attr({
        height: r * 2 + width * 2,
        width: r * 2 + width * 2
      });

      let circle = sector
      .circle(r + width, r + width, r)
      .attr({
        fill: fill,
        stroke: strokeEmpty,
        strokeWidth: width
      });

      path = sector.path('').attr({
        fill: 'transparent',
        stroke: strokeFilled,
        strokeWidth: width
      });

      let currentPersent = 1;

      let t = sector.text(0, 0, currentPersent < 10 ? '0%' : '00%')
      .attr({
        fontSize: r / 2.7 + 'px',
        textAnchor: 'middle',
        fill: fontColor,
        fontFamily: fontFamily,
        fontWeight: fontWeight
      })
      .addClass(fontClass);

      t.attr({
        y: (r + width) + t.getBBox().h / 2,
        x: (r + width),
        text: 75 + '%',
      });

      let coords = {
        x: r + width,
        y: r + width
      }

      let timer = setInterval(() => {
        if(currentPersent >= persent) clearInterval(timer);
        updatePath(coords, r, currentPersent);
        t.attr({text: currentPersent + '%'})

        currentPersent++;
      }, duration / persent);

      path.attr({strokeWidth: width || 10})
    }

    draw(duration);

  },

  plainChart: function(settings, charts) {
    if(!settings || !charts) return false;

    let colWidth = settings.width / settings.period,
    offsetX = colWidth,
    offsetY = 5,
    scale = settings.scale || 10;

    settings.width += offsetX;
    settings.height += offsetY * 2;

    const paper = Snap(settings.selector).attr({
      height: settings.height,
      width: settings.width + 50,
      viewBox: `0 -${settings.height-5} ${settings.width} ${settings.height}`,
    });

    if(settings.grid.rows || settings.grid.columns) {
      buildGrid(paper, offsetX, offsetY, scale, settings.width, settings.height, colWidth, settings.grid);
    }

    for(let chartData of charts) {

      let columns = getColumns(chartData.data, settings.period),
      type = chartData.type || 'linear';

      let defaultColor = '#aaa';

      chartData.point = chartData.point || {};
      chartData.line = chartData.line || {};

      let chartStyle = {
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

      switch(type) {
        case 'area': buildAreaPath(paper, columns, offsetX, offsetY, scale, settings.width, colWidth, chartStyle); break;
        case 'linear': buildLinearPath(paper, columns, offsetX, offsetY, scale, colWidth, chartStyle, settings.hover); break;
        case 'bar': buildBarChart(paper, columns, offsetX, offsetY, scale, colWidth, chartStyle, settings.hover); break;
        default: buildLinearPath(paper, columns, offsetX, offsetY, scale, colWidth, chartStyle, settings.hover);
      }

    } // for

    if(settings.axis)
      buildAxis(paper, settings.height, settings.width, offsetY);

    /*****************************************************
    *  FUNCTIONS
    *****************************************************/

    function buildAxis(_paper, _height, _width, _offsetY) {
      _paper.path(`M0,${-_height} L0,${_offsetY} L${_width},${_offsetY}`)
      .attr({
        fill: 'transparent',
        stroke: '#aaa',
        strokeWidth: '2px'
      });
    }

    function buildGrid(_paper, _offsetX, _offsetY, _scale, _width, _height, _colWidth, gridOps) {
      let rowsPathString = '',
      colsPathString = '',
      rows = [];

      const gridStyle = {
        fill: 'transparent',
        stroke: gridOps.color || '#aaa',
        strokeWidth: '1px'
      };

      gridOps.text = gridOps.text || {};

      let textStyle = {
        fontFamily: gridOps.text.fontFamily || 'PT Sans',
        fontWeight: gridOps.text.fontWeight || 'bold',
        fontSize: gridOps.text.fontSize || '.8em',
        textAnchor: 'middle',
        fill: gridOps.text.color || '#aaa'
      };

      if(gridOps.rows) {
        for(let i = 0; i < _height / _scale; i++)
          if(i % 2 == 0) rows.push(i);
        for(let point of rows) {
          let y = point * _scale + _offsetY;
          _paper.text(-15, -y+_offsetY, `${point}`)
            .attr(textStyle);
          rowsPathString += ` M0,-${y} L${_width},-${y}`;
        }
        _paper.path(rowsPathString).attr(gridStyle);
      }

      if(gridOps.columns) {
        for(let i = 0; i < _width / _colWidth; i++) {
          if(i % 2 == 0) {
            colsPathString += `M${_offsetX},0 L${_offsetX},-${_height}`;
          }
          _offsetX += _colWidth;
        }
        _paper.path(colsPathString).attr(gridStyle)
      }
    }

    function buildAreaPath(_paper, _columns, _offsetX, _offsetY, _scale, _width, _colWidth, style) {

      let chartPath = _paper.path().attr({
        stroke: style.color,
        fill: style.fill,
        fillOpacity: 0,
        strokeWidth: style.width,
        strokeDasharray: 3000,
        strokeDashoffset: 3000,
        strokeLinejoin: 'round',
      });

      for(let col of _columns) {

        let pathString = chartPath.attr('d'),
        coords = `${_offsetX},${-col.count * _scale - _offsetY}`,
        startPos = `M${_width - _offsetY},-${_offsetY} L${_offsetY},-${_offsetY}`;

        chartPath.attr({
          d: pathString ? pathString + `L ${coords}` : startPos + `L ${coords}`,
        });
        _offsetX += _colWidth;
      }

      chartPath.attr({ d: chartPath.attr('d') + 'Z' });
      chartPath.animate({
        strokeDashoffset: 0,
      }, 2000);

      setTimeout(function() {
        chartPath.animate({fill: style.fill, fillOpacity: style.opacity}, 300);
      }, 1500)
    }

    function buildLinearPath(_paper, _columns, _offsetX, _offsetY, _scale, _colWidth, style, callback) {

      let chartPath = paper.path().attr({
        stroke: style.color,
        fill: 'transparent',
        fillOpacity: style.opacity,
        strokeWidth: style.width,
        strokeDasharray: 3000,
        strokeDashoffset: 3000,
        strokeLinejoin: 'round',
      });

      let timeout = 0;

      for(let col of _columns) {

        let pointCoords = {
          x: _offsetX,
          y: -col.count * _scale - _offsetY
        };

        let point = _paper.circle(pointCoords.x, pointCoords.y, 0).attr({
          strokeWidth: style.point.strokeWidth,
          stroke: style.point.stroke,
          fill: style.point.fill,
          cursor: 'pointer',
        });

        setTimeout(function() {
          point.animate({r: style.point.r}, 200, mina.easein);
        }, timeout);
        timeout += 30;

        let timer;
        point.hover(function(e) {
          this.stop().animate({r: style.point.r * 2}, 1000, mina.elastic);
          callback(e, col);
        }, function() {
          clearTimeout(timer);
          this.stop().animate({r: style.point.r}, 1000, mina.elastic);
        });

        let pathString = chartPath.attr('d'),
            coords = `${_offsetX}, ${-col.count * _scale - _offsetY}`;

        chartPath.attr({
          d: pathString ? pathString + `L ${coords}` : `M ${coords}`,
        });
        _offsetX += _colWidth;
      }

      chartPath.animate({
        strokeDashoffset: 0
      }, 3000); 
    }

    function buildBarChart(_paper, _columns, _offsetX, _offsetY, _scale, _colWidth, style, callback) {
      let timeout = 0;

      _offsetX /= 2;

      for(let col of _columns) {
        if(col.count) {
          let bar = _paper.rect(_offsetX, -_offsetY, _colWidth, 0)
          .attr({
            fill: style.fill,
            stroke: style.color,
            cursor: 'pointer'
           });

          setTimeout(() => {
            bar.animate({
              y: -col.count * _scale - _offsetY,
              height: col.count * _scale
            }, 1500, mina.elastic);
          }, timeout);

          bar.hover(function(e) {
            this.stop().animate({fill: style.hover}, 200, mina.easeinout);
            callback(e, col);
          }, function() {
            this.stop().animate({fill: style.fill}, 200, mina.easeinout);
          });

        }
        timeout += 40;
        _offsetX += _colWidth;
      }
    }

    function getColumns(tasks, _period) {
      _period = _period || 30;


      const daysInMonth = function(year, month) {
        return 32 - new Date(year, month, 32).getDate();
      };

      let curDate = new Date(),
      columns = [],
      curDay = curDate.getDate(),
      curMonth = curDate.getMonth(),
      curYear = curDate.getFullYear();

      --curDay;
      /*************************************************
      * CREATE LIST OF CHART COLUMNS
      *************************************************/
      for(let i = 0; i < _period; i++) {
        if(curDay == 0)
          curDay = daysInMonth(curYear, --curMonth);

        columns.push({
          date: new Date(curYear, curMonth, curDay--).getTime(),
          count: 0,
          tasks: [],
        });
      }

      /*************************************************
      * CREATE CHART POINTS
      *************************************************/
      for(let task of tasks) {
        let taskTime = task.date.setHours(0,0,0,0);

        for(let col of columns)
          if(col.date == taskTime) {
            col.count++;
            col.tasks.push(task);
          }
      }

      return columns.reverse();
    }
  },

}

