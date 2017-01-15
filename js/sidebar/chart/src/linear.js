import ChartModel from './chart_model';

class Linear extends ChartModel {
  constructor(settings, charts) {
    super(settings, charts);
  }

  build(columns, style) {

    let chartPath = this.paper.path('')
    .attr({
       stroke: style.color,
       fill: 'transparent',
       fillOpacity: style.opacity,
       strokeWidth: style.width,
       strokeDasharray: 3000,
       strokeDashoffset: 3000,
       strokeLinejoin: 'round',
    });

    let timeout = 0,
    _offsetX = this.offsetX,
    _offsetY = this.offsetY;

    for(let col of columns) {

      let pointCoords = {
        x: _offsetX,
        y: -col.count * this.scale - _offsetY,
      };

      let point = this.paper.circle(pointCoords.x, pointCoords.y, 0)
      .attr({
        strokeWidth: style.point.strokeWidth,
        stroke: style.point.stroke,
        fill: style.point.fill,
        id: 'point',
      });

      setTimeout(function() {
        point.animate({r: style.point.r}, 200, mina.easein);
      }, timeout);
      timeout += 30;

      let timer;
      point.hover(e => {
        point.stop().animate({r: style.point.r * 2}, 1000, mina.elastic);
        this.hover(col, e);
      }, e => {
        this.unhover();
        clearTimeout(timer);
        point.stop().animate({r: style.point.r}, 1000, mina.elastic);
      });

      //call "click" callback function
      point.click(e => this.click(col, e));

      let pathString = chartPath.attr('d'),
      coords = `${_offsetX}, ${-col.count * this.scale - _offsetY}`;

      chartPath.attr({
        d: pathString ? pathString + `L ${coords}` : `M ${coords}`,
      });
      _offsetX += this.colWidth;

    }

     chartPath.animate({
       strokeDashoffset: 0
     }, 3000); 
 

  }
}

export default Linear;