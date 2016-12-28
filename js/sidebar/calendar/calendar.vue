<template>
  
  <div class="calendar-wrap">
    <div class="year-slider">
      <div class="year-slider-left-control">
        <div class="fa fa-chevron-left"></div>
      </div>
      <div class="year-slider-tape-wrap">
        <div class="year-slider-tape"></div>
      </div>
      <div class="year-slider-right-control">
        <div class="fa fa-chevron-right"></div>
      </div>
    </div>
    <div class="month-slider">
      <div class="month-numbers"></div>
      <div class="month-line">
        <div class="slider-circle"></div>
      </div>
      <div class="month-title"></div>
    </div>
    <div class="weekdays-wrap">
      <div>SUN</div>
      <div>MON</div>
      <div>TUE</div>
      <div>WED</div>
      <div>THU</div>
      <div>FRI</div>
      <div>SAT</div>
    </div>
    <div class="calendar-cells-wrap"></div>
  </div>

</template>

<script>

  import Calendar from './calendar.js';


  export default {
    props: ['eventBus'],
    data: function() {
      return {
        calendar: null
      };
    },
    methods: {
      pickDay: function(date) {}
    },
    created: function() {
      setTimeout(() => {

        let currentYear = new Date().getFullYear();

        this.calendar = new Calendar({
          container: '.' + this.$el.parentNode.className,
          yearFirst: currentYear - 3,
          yearLast: currentYear + 3,
          yearPrimary: currentYear,
          onclick: this.pickDay
        });

      }, 0);
    },
  }
  
</script>