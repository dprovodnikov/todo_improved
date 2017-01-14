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
          hover: (data) => {
            this.eventBus.$emit('pie-hovered', data);
          },
          unhover: () => {
            this.eventBus.$emit('pie-unhovered');
          },
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