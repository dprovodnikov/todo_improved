import Chart from './charts/chart';
import fakeData from './charts/demo';

export default function() {
  let panelSelector = '.side-panel';
  const panel = $(panelSelector),
  selectors = [
    '#chart-completed',
    '#chart-overdue',
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
        <div class="chartzone-top"></div>
        <div class="chartzone"></div>
      </div>
    </div>
  `;

  const show = function() {


    const height = 150, width = 450;

    panel.html(template);

    Chart.plainChart({
      selector: selectors[0],
      period: 30,
      height: height,
      width: width,
      axis: false,
      hover: function() {},
      grid: { color: '#eee', rows: true, columns: true }
    }, [
      {
        data: fakeData[0],
        type: 'linear',
        line: { color: '#cc5656' },
        point: {
          outerColor: '#cc5656',
          innerColor: '#fff',
          strokeWidth: 2,
        },
      }
    ]);

    Chart.plainChart({
      selector: selectors[1],
      period: 20,
      height: height,
      width: width,
      axis: false,
      hover: function() {},
      grid: { columns: true, rows: true, color: '#eee' }
    }, [
      {
        data: fakeData[0],
        type: 'bar',
        line: { color: '#fff', fill: '#db5e5e', hoverColor: '#b23636' },
      }
    ]);

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