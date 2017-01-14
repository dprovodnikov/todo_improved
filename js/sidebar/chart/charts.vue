<template>

  <div class="chartzones">

    <linear-chart></linear-chart>
    <bar-chart></bar-chart>
    <radial-charts></radial-charts>

  </div>

</template>

<script>

  import linearChart from './linear-chart.vue';
  import barChart from './bar-chart.vue';
  import radialCharts from './radial-charts.vue';
  
  export default {
    components: {
      'linear-chart': linearChart,
      'bar-chart': barChart,
      'radial-charts': radialCharts,
    },

    data: function() {
      return {};
    },
  }

</script>