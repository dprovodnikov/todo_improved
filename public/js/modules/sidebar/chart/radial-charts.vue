<template>
  
  <div class="chartzone-wrap">
    <div class="chartzone chartzone-double">
      <div class="chartzone-half">
        <div class="chartzone-title">
          <i class="fa fa-hourglass-start fa-fw"></i>
          {{circle.title}}
        </div>
        <svg :id="circle.id.slice(1)"></svg>
      </div>
      <div class="chartzone-half">
        <div class="chartzone-title">
          <i class="fa fa-flag fa-fw"></i>
          {{pie.title}}
        </div>
        <svg :id="pie.id.slice(1)"></svg>
      </div>
    </div>
  </div>
  
</template>

<script>
  import Chart from './dist/chart.js';
  import fakeData from './src/demo.js';
  
  export default {
    props: ['eventBus'],

    data: function() {
      return {
        pie: {
          id:'#pie-chart',
          title: 'Priorities pie'
        },
        circle: {
          id:'#circle-chart',
          title: 'Today\'s progress'
        },
      };
    },

    methods: {
      buildCircle: function() {
        Chart.radial({
          selector: this.circle.id,
          persent: 83, 
          r: 60,
          width: 8,
          duration: 700,
          strokeFilled: '#B70C41',
          strokeEmpty: '#fff',
          fill: '#eee',
          fontFamily: 'Hind',
          fontWeight: '500',
          fontColor: '#3d3d3d',
        });
      },

      buildPie: function() {
        Chart.pie({
          selector: this.pie.id,
          r: 60, r2: 30,
          animationDuration: 700,
          hintColor: '#3d3d3d',
          hover: (data) => this.eventBus.$emit('pie-hovered', data),
          unhover: () => this.eventBus.$emit('chart-unhovered'),
          sectors: {
            data: fakeData[0],
            key: 'priority',
            colors: { 
              0: '#F9738C',
              1: '#EE0032',
              2: '#B70C41',
            },
            aliases: {
              0: 'Low',
              1: 'Normal',
              2: 'High'
            },
          }
        });
      }
    },

    ready: function() {
      this.buildCircle();
      this.buildPie();
    },
  }

</script>