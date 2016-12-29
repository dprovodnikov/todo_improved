import Util from './util';

class Pie {
  constructor(settings) {
    this.height = settings.r * 3;
    this.width = this.height;
    this.r = settings.r || 100;
    this.r2 = settings.r2,
    this.c = this.height / 2;
    this.sectorsData = settings.sectors;
    this.groups = [];
    this.cb = settings.hover;
    this.animationDuration = settings.animationDuration;

    this.paper = Snap(settings.selector).attr({
      height: this.height,
      width: this.width
    });

    this._draw();
    this._bindEvents();
  }

  _sector(angle) {
    return this.paper.path(
      Util.describeSector(this.c, this.c, this.r, this.r2, 0, angle)
    );
  }

  _group(sector, text) {
    this.groups.push(this.paper.g(sector, text));
  }

  _getAngle(persent) {
    return persent * 360 / 100;
  }


  _getMissingSector(totalAngle) {
    let angle = 360 - Math.round(totalAngle);
    let s = this._sector(angle)
    .attr({
      fill: 'rgba(255,255,255,.3)',
      strokeDasharray: 2 * Math.PI * (360 - totalAngle),
      strokeDashoffset: 2 * Math.PI * (360 - totalAngle),
      strokeWidth: 1,
      fillOpacity: 0,
      stroke: 'rgba(255,255,255,.1)'
    })
    .transform(`r${totalAngle}, ${this.c}, ${this.c}`);

    s.data('angle', angle);

    let t = this.paper.text(this.c, this.c, 'Others')
    .attr({
      textAnchor: 'middle',
      opacity: 0,
      fontFamily: 'Ubuntu Light',
      fill: '#3d3d3d'
    }).transform(`r${totalAngle + angle / 2}, ${this.c}, ${this.c}`);

    this._group(s, t);
  }

  _animate(duration) {
    for(let g of this.groups) {
      let sector = g[0], text = g[1]

      let textBox = text.getBBox();
      let sectorBox = Snap.path.getBBox(sector);

      sector.animate({
        strokeDashoffset: 0
      }, duration);

      setTimeout(() => {
        sector.animate({
          fillOpacity: 1
        }, 500);
      }, duration);

      setTimeout(() => {
        text.animate({
          opacity: 1,
          y: sectorBox.y - textBox.height / 2
        }, 800, mina.elastic);
      }, duration * 1.4);
    }

  }

  _bindEvents() {
      for(let g of this.groups) {
      let sector = g[0], text = g[1];

      sector.hover(e => {
        sector.animate({
          d: Util.describeSector(this.c, this.c, this.r - (this.r / 15), this.r2, 0, sector.data('angle'))
        }, 500, mina.elastic);

        this.cb();
      }, e => {
        sector.stop().animate({
          d: Util.describeSector(this.c, this.c, this.r, this.r2, 0, sector.data('angle'))
        }, 500, mina.elastic);
      });
    }
  }

  _draw() {
    let totalAngle = 0;
    for(let sector of this.sectorsData) {

      sector.angle = this._getAngle(sector.persent);

      let s = this._sector(sector.angle).attr({
        fill: sector.fill,
        strokeDasharray: 2 * Math.PI * sector.angle,
        strokeDashoffset: 2 * Math.PI * sector.angle,
        strokeWidth: 1,
        stroke: sector.fill,
        fillOpacity: 0,
      }).transform(`r${totalAngle}, ${this.c}, ${this.c}`);

      s.data('angle', sector.angle);

      let t = this.paper.text(this.c, this.c, sector.persent + '%')
      .attr({
        textAnchor: 'middle',
        opacity: 0,
        fontFamily: 'Ubuntu Light',
        fill: '#3d3d3d'
      }).transform(`r${totalAngle + sector.angle / 2}, ${this.c}, ${this.c}`);

      this._group(s, t);

      totalAngle += sector.angle;
    }

    if(Math.round(totalAngle) < 360) {
      this._getMissingSector(totalAngle);
    }

    this._animate(this.animationDuration);
  }
}

export default Pie;