<template>

  <div class="chartzones">

    <linear-chart :event-bus="eventBus"></linear-chart>
    <bar-chart :event-bus="eventBus"></bar-chart>
    <radial-charts :event-bus="eventBus"></radial-charts>

    <chart-info :event-bus="eventBus"></chart-info>

  </div>


</template>

<script>

  import linearChart from './linear-chart.vue';
  import barChart from './bar-chart.vue';
  import radialCharts from './radial-charts.vue';
  import chartInfo from './chart-info.vue';
  
  export default {
    props: ['eventBus'],

    components: {
      'linear-chart': linearChart,
      'bar-chart': barChart,
      'radial-charts': radialCharts,
      'chart-info': chartInfo,
    },

    data: function() {
      return {};
    },

  }

</script>