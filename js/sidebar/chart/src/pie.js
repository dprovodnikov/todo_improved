import Util from './util.js';

class Pie {
  constructor(settings) {
    this.height = settings.r * 3; // need more space than just radius to accommodate hints
    this.width = this.height;
    this.r = settings.r || 100;  // outer radius
    this.r2 = settings.r2,       // inner radius
    this.c = this.height / 2;    // center

    this.hintColor = settings.hintColor;

    /********************************************************************
    * We have to define either we've got a static set of sector definions or
    * we've got an array of data to parse.
    *********************************************************************/
    if(Array.isArray(settings.sectors))
      this.sectorsData = settings.sectors;
    else
      this.sectorsData = this._parse(settings.sectors);

    this.groups = [];
    this.hover = settings.hover;
    this.unhover = settings.unhover;
    this.animationDuration = settings.animationDuration;

    this.paper = Snap(settings.selector).attr({
      height: this.height,
      width: this.width
    });

    this._draw();

    setTimeout(() => this._bindEvents(), this.animationDuration + 300);
  }

  _parse(sectors) {
    let data, key, colors, summary, output;

    data = sectors.data;
    key = sectors.key;
    colors = sectors.colors;

    summary = {};

    for(let item of data)
      summary[ item[key] ] ? summary[ item[key] ]++ : summary[ item[key] ] = 1

    output = [];

    for(let [k, v] of Object.entries(summary)) {
      output.push({
        persent: Math.round(v * 100 / data.length),
        fill: colors[k]
      });
    }

    return output;
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
    return persent * 360 / 100
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
      fill: '#fff'
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
        }, 150);
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
          d: Util.describeSector(this.c, this.c, this.r - (this.r / 20), this.r2, 0, sector.data('angle'))
        }, 500, mina.elastic);

        this.hover();
      }, e => {
        this.unhover();
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
        strokeWidth: 0,
        stroke: sector.fill,
        fillOpacity: 0,
      }).transform(`r${totalAngle}, ${this.c}, ${this.c}`);

      s.data('angle', sector.angle);

      let t = this.paper.text(this.c, this.c, sector.persent + '%')
      .attr({
        textAnchor: 'middle',
        opacity: 0,
        fontFamily: 'Ubuntu Light',
        fill: this.hintColor
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