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

    this.height = settings.height += this.offsetX;
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
      strokeWidth: '.5px'
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

  getColumns(tasks) {

    const daysInMonth = function(year, month) {
      return 32 - new Date(year, month, 32).getDate();
    };

    let curDate = new Date(),
    columns = [],
    curDay = curDate.getDate(),
    curMonth = curDate.getMonth(),
    curYear = curDate.getFullYear();

    --curDay;

    for(let i = 0; i < this.period; i++) {
      if(curDay == 0)
        curDay = daysInMonth(curYear, --curMonth);

      columns.push({
        date: new Date(curYear, curMonth, curDay--).getTime(),
        count: 0,
        tasks: [],
      });
    }

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
  
  draw() {

    for(let chartData of this.charts) {

      let columns = this.getColumns(chartData.data),
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

      this.build(columns, chartStyle);
    }
  }


}

export default ChartModel;