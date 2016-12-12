import Util from './util';

class Radial {
  constructor(settings) {

    this.persent = settings.persent,
    this.r = settings.r,
    this.width = settings.width,
    this.strokeFilled = settings.strokeFilled || '#3d3d3d',
    this.strokeEmpty = settings.strokeEmpty || settings.fill || '#eee',
    this.fill = settings.fill || settings.strokeEmpty || 'transparent',
    this.fontClass = settings.fontClass,
    this.fontColor = settings.fontColor || settings.strokeFilled,
    this.fontFamily = settings.fontFamily,
    this.fontWeight = settings.fontWeight,
    this.duration = settings.duration;

    this.paper = Snap(settings.selector)
    .attr({
      height: this.r * 2 + this.width * 2,
      width: this.r * 2 + this.width * 2
    });

    this._draw();
  }

  _updatePath(coords, radius, persents) {
    let deg = persents * 359.9999 / 100;
    this.path.attr({
      d: Util.describeArc(coords.x, coords.y, radius, 0, deg)
    });
  }

  _draw() {
    this.paper.circle(this.r + this.width, this.r + this.width, this.r)
    .attr({
      fill: this.fill,
      stroke: this.strokeEmpty,
      strokeWidth: this.width
    });

    this.path = this.paper.path('')
    .attr({
      fill: 'transparent',
      stroke: this.strokeFilled,
      strokeWidth: this.width
    });

    let currentPersent = 1;

    let t = this.paper.text(0, 0, currentPersent < 10 ? '0%' : '00%')
    .attr({
      fontSize: this.r / 2.7 + 'px',
      textAnchor: 'middle',
      fill: this.fontColor,
      fontFamily: this.fontFamily,
      fontWeight: this.fontWeight
    })
    .addClass(this.fontClass);

    t.attr({
      y: (this.r + this.width) + t.getBBox().h / 2,
      x: (this.r + this.width),
    });

    let coords = {
      x: this.r + this.width,
      y: this.r + this.width 
    }

    let timer = setInterval(() => {
      if(currentPersent >= this.persent) {
        clearInterval(timer);
      }

      this._updatePath(coords, this.r, currentPersent);
      t.attr({text: currentPersent + '%'})

      currentPersent++;
    }, this.duration / this.persent);

    this.path.attr({strokeWidth: this.width || 10})
  }
}

export default Radial;