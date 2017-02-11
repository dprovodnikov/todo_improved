<template>
  <div v-click-outside>

    <div class="builder-wrap" transition="builder" v-show="show">

      <div class="builder-topbar">
        <div v-show="stripe.show" transition="stripe" class="b-title-stripe">Set a deadline</div>
      </div>

      <calendar :tight="true" :event-bus="eventBus" :init-args="{ date: new Date() }"></calendar>

    </div>

    <button @click="showBuilder" class="add-button-global">
      <i class="fa fa-pencil"></i>
    </button>

  </div>
</template>

<script>
  import { format } from '../../utils/date-utils.js';
  import clickOutsideDirective from '../../directives/click-outside.js';
  import placeholderDirective from '../../directives/placeholder.js';
  import editableModel from '../../directives/editable-model.js';
  import calendar from '../sidebar/calendar/calendar.vue';
  
  export default {

    props: ['eventBus'],

    data: function() {
      return {
        show: true,
        text: '',
        overlay: $('#overlay'),

        stripe: {
          title: 'Set a deadline',
          show: false,
        },

        priorities: {
          show: false,
        },
      };
    },

    filters: {
      date: function(value, pattern) {
        return format(pattern, new Date(value.toString()));
      }
    },

    components: {
      'calendar': calendar,
    },

    directives: {
      'click-outside': clickOutsideDirective,
      'editable-model': editableModel,
      'placeholder': placeholderDirective,
    },

    methods: {

      showBuilder: function() {
        this.overlay.show();
        this.show = true;

        setTimeout(() => this.stripe.show = true, 100);
      },

      hideBuilder: function() {
        this.priorities.show = false;

        this.overlay.hide();
        this.show = false;

        this.stripe.show = false;
      },

      bindEvents: function() {
        this.$on('collapse-me', this.hideBuilder);
      },

    },

    created: function() {
      this.bindEvents();
    },

  }

</script>
