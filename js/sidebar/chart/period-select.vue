<template>

  <div class="chartzone-settings-wrap" v-click-outside>
    <div class="chartzone-settings" 
         @click="show = !show"
         :class="{'period-open': show, 'period-close': !show}">

      <i class="fa fa-clock-o"></i>
      <div class="chartzone-settings-list">
        <ul>
          <li v-for="period of periods"
              :class="{'chartzone-period-active': period == active}"
              @click="setPeriod(period)">

            {{period}}
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script>
  import clickOutsideDirective from '../../directives/click-outside.js';
  export default {

    props: ['period'],

    directives: {
      'click-outside': clickOutsideDirective
    },

    data: function() {
      return {
        show: false,
        periods: [15, 20, 25, 30],
        active: 0
      }
    },

    methods: {
      bindEvents: function() {
        this.$on('collapse-me', () => {
          this.show = false;
        });
      },

      setPeriod(period) {
        this.active = period;
        this.$emit('period-changed', period);
      }
    },

    created: function() {
      this.bindEvents();

      this.active = this.period;
    }

  }

</script>
