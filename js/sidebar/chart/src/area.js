import ChartModel from './chart_model';

class Area extends ChartModel {
  constructor(settings, charts) {
    super(settings, charts);
  }

  build(columns, style) {
    let _offsetX = this.offsetX,
    _offsetY = this.offsetY;

    let chartPath = this.paper.path('')
    .attr({
     stroke: style.color,
     fill: style.fill,
     fillOpacity: 0,
     strokeWidth: style.width,
     strokeDasharray: 3000,
     strokeDashoffset: 3000,
     strokeLinejoin: 'round',
    });

    for(let col of columns) {
      let pathString = chartPath.attr('d'),
      coords = `${_offsetX},${-col.count * this.scale - _offsetY}`,
      startPos = `M${this.width - _offsetY},-${_offsetY} L${_offsetY},-${_offsetY}`;

      chartPath.attr({
       d: pathString ? pathString + `L ${coords}` : startPos + `L ${coords}`,
      });
      _offsetX += this.colWidth;
    }

    chartPath.attr({ d: chartPath.attr('d') + 'Z' });
    chartPath.animate({
      strokeDashoffset: 0,
    }, 2000);

    setTimeout(function() {
      chartPath.animate({fill: style.fill, fillOpacity: style.opacity}, 300);
    }, 1500);

  }
}

export default Area;