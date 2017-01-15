import ChartModel from './chart_model';

class Bar extends ChartModel {
  constructor(settings, charts) {
    super(settings, charts);
  }

  build(columns, style) {
    let timeout = 0,
    _offsetX = this.offsetX / 2,
    _offsetY = this.offsetY;

    for(let col of columns) {
      if(col.count) {
        let bar = this.paper.rect(_offsetX, -_offsetY, this.colWidth, 0)
        .attr({
          fill: style.fill,
          stroke: style.color 
         });

        setTimeout(() => {
          bar.animate({
            y: -col.count * this.scale - _offsetY,
            height: col.count *this.scale 
          }, 1500, mina.elastic);
        }, timeout);

        bar.hover(e => {
          bar.stop().animate({fill: style.hover}, 200, mina.easeinout);
          this.hover(col, e);
        }, () => {
          this.unhover();
          bar.stop().animate({fill: style.fill}, 200, mina.easeinout);
        });

        // call "click" callback function
        bar.click(e => this.click(col, e));

      }
      timeout += 40;
      _offsetX += this.colWidth;
    }
  }
}

export default Bar;