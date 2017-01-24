<template>
  
  <div class="chartzone-wrap">

    <chartzone-topbar :period="period"
        :role="role"
        @period-changed="setPeriod">
    </chartzone-topbar>

    <div class="chartzone">
      <svg :id="selector.slice(1)"></svg>
    </div>
  </div>

</template>

<script>
  import periodSelect from './chartzone-topbar.vue';
  import fakeData from './src/demo.js';
  import Chart from './dist/chart.js';
  
  export default {
    props: ['eventBus'],

    components: {
      'chartzone-topbar': periodSelect,
    },

    data: function() {
      return {
        selector: '#chart-completed',
        period: 30,
        role: 'completed',
        height: 150,
        width: 400,
      };
    },

    methods: {

      setPeriod(period) {
        this.period = period;
        this.build();
      },

      build: function() {
        Chart.linear({
          selector: this.selector,
          period: this.period,
          height: this.height,
          width: this.width,
          axis: false,
          hover: (data) => this.eventBus.$emit('chart-hovered', data),
          unhover: () => this.eventBus.$emit('chart-unhovered'),
          click: (data, event) => this.eventBus.$emit('chart-clicked', data, event),
          grid: {
            color: '#eee',
            rows: true,
            columns: true,
            text: {
              fontWeight: 'normal',
              fontFamily: 'Hind',
            }
          }
        }, [
          {
            data: fakeData[0],
            line: { color: '#cc5656', width: 3 },
            point: {
              radius: 5,
              innerColor: '#cc5656',
              outerColor: '#fff',
              strokeWidth: 1.5,
            },
          }
        ]);
      },
    },

    ready: function() {
      this.build();
    }
  }

</script>