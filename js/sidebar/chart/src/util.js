class Util {

  static polarToCartesian(cx, cy, r, angle) {
    angle = (angle - 90) * Math.PI / 180
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  static describeArc(x, y, r, startAngle, endAngle, continueLine) {
    let start = this.polarToCartesian(x, y, r, startAngle %= 360),
    end = this.polarToCartesian(x, y, r, endAngle %= 360),
    large = Math.abs(endAngle - startAngle) >= 180,
    alter = endAngle > startAngle;

    return `${continueLine ? 'L' : 'M'} ${start.x},${start.y}
    A${r},${r},0 ${large ? 1 : 0},${alter ? 1 : 0},${end.x},${end.y}`;
  };

  static describeSector(x, y, r, r2, startAngle, endAngle) {

    return `
      ${this.describeArc(x, y, r, startAngle, endAngle)}
      ${this.describeArc(x, y, r2, endAngle, startAngle, true)}Z
    `;
  };

}

export default Util;