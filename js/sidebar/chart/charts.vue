<template>

  <div class="chartzones">
    <div class="chartzone-wrap">
      <div class="chartzone-top">
        <div class="fa fa-sliders"></div>
      </div>
      <div class="chartzone">
        <svg :id="selectors.completed"></svg>
      </div>
    </div>
    <div class="chartzone-wrap">
      <div class="chartzone-top">
        <div class="fa fa-sliders"></div>
      </div>
      <div class="chartzone">
        <svg :id="selectors.overdue"></svg>
      </div>
    </div>
    <div class="chartzone-wrap">
      <div class="chartzone chartzone-double">
        <div class="chartzone-half">
          <svg :id="selectors.radial"></svg>
        </div>
        <div class="chartzone-half">
          <svg :id="selectors.pie"></svg>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

  import Chart from './dist/chart.js';
  import fakeData from './src/demo.js';
  
  export default {
    data: function() {
      return {
        height: 150,
        width: 350,
        selectors: {
          completed: 'chart-completed',
          overdue: 'chart-overdue',
          radial: 'radialchart',
          pie: 'piechart',
        }
      };
    },
    methods: {
      buildCompletedChart: function() {

        Chart.linear({
          selector: '#' + this.selectors.completed,
          period: 30,
          height: this.height,
          width: this.width,
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

      },

      buildOverdueChart: function() {

        Chart.bar({
          selector: '#' + this.selectors.overdue,
          period: 20,
          height: this.height - 15,
          width: this.width,
          axis: false,
          hover: function() {},
          grid: { columns: true, rows: true, color: '#eee' }
        }, [
          {
            data: fakeData[0],
            line: { color: '#fff', fill: '#db5e5e', hoverColor: '#b23636' },
          }
        ]);

      },

      buildRadialChart: function() {

        Chart.radial({
          selector: '#' + this.selectors.radial,
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

      },

      buildPieChart: function() {

        Chart.pie({
          selector: '#' + this.selectors.pie,
          r: 60, r2: 20,
          animationDuration: 700,
          hover: function() {},
          sectors: [
            {persent: 25, fill: '#B70C41'},
            {persent: 35, fill: '#EE0032'},
            {persent: 40, fill: '#F9738C'},
          ],
        });

      },

    },
    ready: function() {
      this.buildCompletedChart();
      this.buildOverdueChart();
      this.buildRadialChart();
      this.buildPieChart();
    },
  }

</script>