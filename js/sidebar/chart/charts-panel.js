import Chart from './dist/chart';
import fakeData from './src/demo';

export default function() {
  let panelSelector = '.side-panel';
  const panel = $(panelSelector),
  selectors = [
    '#chart-completed',
    '#chart-overdue',
    '#radialchart',
    '#piechart'
  ];

  let template = `
    <div class="chartzones">
      <div class="chartzone-wrap">
        <div class="chartzone-top">
          <div class="fa fa-sliders"></div>
        </div>
        <div class="chartzone">
          <svg id="${selectors[0].slice(1)}"></svg>
        </div>
      </div>
      <div class="chartzone-wrap">
        <div class="chartzone-top">
          <div class="fa fa-sliders"></div>
        </div>
        <div class="chartzone">
          <svg id="${selectors[1].slice(1)}"></svg>
        </div>
      </div>
      <div class="chartzone-wrap">
        <div class="chartzone chartzone-double">
          <div class="chartzone-half">
            <svg id="${selectors[2].slice(1)}"></svg>
          </div>
          <div class="chartzone-half">
            <svg id="${selectors[3].slice(1)}"></svg>
          </div>
        </div>
      </div>
    </div>
  `;

  const show = function() {
    const height = 130, width = 350;

    panel.html(template);

    Chart.linear({
      selector: selectors[0],
      period: 30,
      height: height,
      width: width,
      axis: false,
      hover: function() {},
      grid: { color: '#eee', rows: true, columns: false }
    }, [
      {
        data: fakeData[0],
        line: { color: '#cc5656' },
        point: {
          radius: 3,
          innerColor: '#cc5656',
          outerColor: '#fff',
          strokeWidth: 1,
        },
      }
    ]);

    Chart.bar({
      selector: selectors[1],
      period: 20,
      height: height - 15,
      width: width,
      axis: false,
      hover: function() {},
      grid: { columns: true, rows: true, color: '#eee' }
    }, [
      {
        data: fakeData[0],
        line: { color: '#fff', fill: '#db5e5e', hoverColor: '#b23636' },
      }
    ]);

    Chart.radial({
      selector: selectors[2],
      persent: 83, 
      r: 60,
      width: 7,
      duration: 700,
      strokeFilled: '#EE0032',
      strokeEmpty: 'transparent',
      fontFamily: 'Muli',
      fontWeight: '0',
      fontColor: '#3d3d3d',
    });

    Chart.pie({
      selector: selectors[3],
      r: 60, r2: 30,
      animationDuration: 700,
      hover: function() { console.log('hover'); },
      sectors: [
        {angle: 90, fill: '#B70C41'},
        {angle: 126, fill: '#EE0032'},
        {angle: 144, fill: '#F9738C'},
      ],
    });

    panel.css({
      width: `${width + 100}px`,
      background: '#fff',
    });

  };

  const hide = function() {
    panel.css('width', 0);
    panel.empty();
  };

  return {
    show: show,
    hide: hide
  };
}