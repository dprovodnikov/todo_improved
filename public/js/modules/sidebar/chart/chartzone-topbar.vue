<template>

  <div class="chartzone-top">
    <div class="chartzone-title">
      <i v-if="role == 'completed'" class="fa fa-calendar-check-o fa-fw"></i>
      <i v-else="role == 'overdue'" class="fa fa-calendar-times-o fa-fw"></i>
      {{role | capitalize}} tasks for the last
      <span class="chartzone-period-active">{{period}}</span>
      days
    </div>

    <div class="chartzone-settings-wrap" v-click-outside>
      <div class="chartzone-settings" @click="show = !show"
           :class="{'period-open': show, 'period-close': !show}">
        

        <i class="fa fa-clock-o">
          <span class="chartzone-settings-hint">Change period</span>
        </i>
        <div class="chartzone-settings-list">
          <ul>
            <li v-for="period of periods"
                :class="{'chartzone-period-active': period == active}"
                @click="setPeriod(period)">

              last {{period}} days
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import clickOutsideDirective from '../../../directives/click-outside.js';
  export default {

    props: ['period', 'role'],

    directives: {
      'click-outside': clickOutsideDirective
    },

    filters: {
      'capitalize': function(word) {
        return word.replace(/\b\w/, l => l.toUpperCase())
      },
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
