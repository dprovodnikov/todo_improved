import {daysInMonth} from '../../../../utils/date-utils.js';

class ChartModel {
  constructor(settings, charts) {
    if(!settings || !charts) return false;
    
    document.querySelector(settings.selector).innerHTML = '';

    this.charts = charts;
    this.colWidth = settings.width / settings.period;
    this.offsetX = this.colWidth;
    this.offsetY = 5;
    this.scale = settings.scale || 10;
    this.period = settings.period || 30;
    this.gridOptions = settings.grid || {};
    this.hover = settings.hover;
    this.unhover = settings.unhover;
    this.click = settings.click;

    this.height = settings.height += this.offsetY;
    this.width = settings.width += this.offsetY * 2;

    this.paper = Snap(settings.selector).attr({
      height: this.height,
      width: this.width + 50,
      viewBox: `0 -${this.height - 5} ${this.width} ${this.height}`,
    });

    if(settings.grid.rows || settings.grid.columns) {
     this.buildGrid();
    }

    this.draw();
  }

  buildAxis() {
    this.paper.path(`M0,${-this.height} L0,${this.offsetY} L${this.width},${this.offsetY}`)
    .attr({
      fill: 'transparent',
      stroke: '#aaa',
      strokeWidth: '2px'
    });
  }

  buildGrid() {
    let rowsPathString = '',
        colsPathString = '',
        _offsetX = this.offsetX,
        rows = [];

    const gridStyle = {
      fill: 'transparent',
      stroke: this.gridOptions.color || '#aaa',
      strokeWidth: '1px'
    };

    this.gridOptions.text = this.gridOptions.text || {};

    let textStyle = {
      fontFamily: this.gridOptions.text.fontFamily || 'PT Sans',
      fontWeight: this.gridOptions.text.fontWeight || 'bold',
      fontSize: this.gridOptions.text.fontSize || '.8em',
      textAnchor: 'middle',
      fill: this.gridOptions.text.color || '#aaa'
    };

    if(this.gridOptions.rows) {
      for(let i = 0; i < this.height / this.scale; i++)
        if(i % 2 == 0) rows.push(i);
      for(let point of rows) {
        let y = point * this.scale + this.offsetY;
        this.paper.text(-15, -y + this.offsetY, `${point}`)
        .attr(textStyle);
        rowsPathString += ` M0,-${y} L${this.width + 15},-${y}`;
      }
      this.paper.path(rowsPathString).attr(gridStyle);
    }

    if(this.gridOptions.columns) {
      for(let i = 0; i < this.width / this.colWidth; i++) {
        if(i % 2 == 0) {
          colsPathString += `M${_offsetX},0 L${_offsetX},-${this.height}`;
        }
        _offsetX += this.colWidth;
      }
      this.paper.path(colsPathString).attr(gridStyle)
    }
  }

  getColumns(data) {
    let groups, output;

    groups = _.groupBy(data, 'date');
    output = [];

    for(let [date, tasks] of Object.entries(groups)) {
      output.push({
        date: date,
        tasks: tasks,
        count: tasks.length
      });
    }

    output = _.orderBy(output, (item) => new Date(item.date).getTime(), ['desc']);

    if(output.length > this.period)
      output = output.slice(0, this.period);

    return output.reverse();
  }

  draw() {
    let columns, type, defaultColor, chartStyle, point, line;

    for(let chartData of this.charts) {

      columns = this.getColumns(chartData.data);
      type = chartData.type || 'linear';

      defaultColor = '#aaa';

      point = chartData.point || {};
      line = chartData.line || {};

      chartStyle = {
        opacity: line.opacity || 0.5,
        color: line.color || defaultColor,
        fill: line.fill || defaultColor,
        width: line.width || 2,
        hover: line.hoverColor || defaultColor,
        point: {
          r: point.radius || 4,
          fill: point.innerColor || defaultColor,
          stroke: point.outerColor || defaultColor,
          strokeWidth: point.strokeWidth || 3
        }
      };

      //virtual method
      this.build(columns, chartStyle);
    }
  }


}

export default ChartModel;