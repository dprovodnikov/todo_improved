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
        selector: '#chart-overdue',
        role: 'overdue',
        period: 20,
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
        Chart.bar({
          selector: this.selector,
          period: this.period,
          height: this.height,
          width: this.width,
          scale: 10,
          axis: false,
          hover: (data) => this.eventBus.$emit('chart-hovered', data),
          unhover: () => this.eventBus.$emit('chart-unhovered'),
          click: (data, event) => this.eventBus.$emit('chart-clicked', data, event),
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
    },

    ready: function() {
      this.build();
    }
  }

</script>