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
  
  export default {

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
          width: 7,
          duration: 700,
          strokeFilled: '#EE0032',
          strokeEmpty: 'transparent',
          fontFamily: 'Muli',
          fontWeight: '0',
          fontColor: '#3d3d3d',
        });
      },

      buildPie: function() {
        Chart.pie({
          selector: this.pie.id,
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
      }
    },

    ready: function() {
      this.buildCircle();
      this.buildPie();
    },
  }

</script>