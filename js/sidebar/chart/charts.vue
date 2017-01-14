<template>

  <div class="chartzones">
    <div class="chartzone-wrap">
      <div class="chartzone-top">
        <div class="chartzone-title">
          <i class="fa fa-calendar-check-o fa-fw"></i>
          Completed tasks for the last 30 days
        </div>

        <period-select :period="charts.completed.period"
            @period-changed="setCompletedChartPeriod">
        </period-select>

      </div>
      <div class="chartzone">
        <svg :id="charts.completed.id"></svg>
      </div>
    </div>
    <div class="chartzone-wrap">
      <div class="chartzone-top">
        <div class="chartzone-title">
          <i class="fa fa-calendar-times-o fa-fw"></i>
          Overdue tasks for the last 30 days
        </div> 

        <period-select :period="charts.overdue.period"
            @period-changed="setOverdueChartPeriod">
        </period-select>

      </div>
      <div class="chartzone">
        <svg :id="charts.overdue.id"></svg>
      </div>
    </div>
    <div class="chartzone-wrap">
      <div class="chartzone chartzone-double">
        <div class="chartzone-half">
          <div class="chartzone-title">
            <i class="fa fa-hourglass-start fa-fw"></i>
            Today's progress
          </div>
          <svg :id="charts.radial.id"></svg>
        </div>
        <div class="chartzone-half">
          <div class="chartzone-title">
            <i class="fa fa-flag fa-fw"></i>
            Priorities pie
          </div>
          <svg :id="charts.pie.id"></svg>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

  import Chart from './dist/chart.js';
  import fakeData from './src/demo.js';
  import periodSelect from './period-select.vue';
  
  export default {
    components: {
      'period-select': periodSelect,
    },

    data: function() {
      return {
        height: 120,
        width: 350,
        charts: {
          completed: { id: 'chart-completed', period: 30 },
          overdue: { id: 'chart-overdue', period: 20 },
          radial: { id: 'radialchart' },
          pie: { id: 'piechart' },
        }
      };
    },

    methods: {
      setCompletedChartPeriod: function(period) {
        this.charts.completed.period = period;
        this.buildCompletedChart();
      },

      setOverdueChartPeriod: function(period) {
        this.charts.overdue.period = period;
        this.buildOverdueChart();
      },

      buildCompletedChart: function() {

        Chart.linear({
          selector: '#' + this.charts.completed.id,
          period: this.charts.completed.period,
          height: this.height,
          width: this.width,
          axis: false,
          hover: function() {},
          grid: {
            color: '#eee',
            rows: true,
            columns: false,
            text: {
              fontWeight: 'normal',
              fontFamily: 'Hind',
            }
          }
        }, [
          {
            data: fakeData[0],
            line: { color: '#cc5656', width: '3px' },
            point: {
              radius: 4,
              innerColor: '#cc5656',
              outerColor: '#fff',
              strokeWidth: 1,
            },
          }
        ]);

      },

      buildOverdueChart: function() {

        Chart.bar({
          selector: '#' + this.charts.overdue.id,
          period: this.charts.overdue.period,
          height: this.height - 10,
          width: this.width,
          scale: 10,
          axis: false,
          hover: function() {},
          grid: {
            columns: true,
            rows: true,
            color: '#eee',
            text: {
              fontFamily: 'Hind',
              fontWeight: 'normal',
              color: '#aaa'
            },
          }
        }, [
          {
            data: fakeData[0],
            line: { color: '#fff', fill: '#db5e5e', hoverColor: '#b23636' },
          }
        ]);

      },

      buildRadialChart: function() {

        Chart.radial({
          selector: '#' + this.charts.radial.id,
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
          selector: '#' + this.charts.pie.id,
          r: 60, r2: 30,
          animationDuration: 700,
          hintColor: '#3d3d3d',
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