<template>
  <div v-click-outside>

    <div class="builder-wrap" transition="builder" v-if="show">

      <div class="builder-topbar">
        <div v-show="stripe.show" transition="stripe" class="b-title-stripe">
          <i class="fa fa-fw fa-pencil"></i>
          {{stripe.title}}
        </div>
      </div>
      
      <calendar :class="{'disabled': calendarDisabled, 'tight': true}" :init-args="calendarArgs"></calendar>

      <builder-form v-ref:form
        transition="builder-form"
        v-show="formVisible"
        v-on:up="calendarDisabled = true"
        v-on:down="calendarDisabled = false">
      </builder-form>

    </div>

    <button @click="showBuilder" class="add-button-global">
      <i class="fa fa-pencil"></i>
    </button>

  </div>
</template>

<script>
  import { format } from '../../utils/date-utils.js';
  import clickOutsideDirective from '../../directives/click-outside.js';
  import calendar from '../sidebar/calendar/calendar.vue';
  import builderForm from './builder-form.vue';
  
  export default {

    props: ['eventBus'],

    data: function() {
      return {
        show: false,
        overlay: $('#overlay'),

        stripe: {
          title: 'Describe a new task',
          show: false,
        },

        calendarDisabled: false,
        formVisible: false,

        calendarArgs: {},
      };
    },

    filters: {
      date: function(value, pattern) {
        return format(pattern, new Date(value.toString()));
      }
    },

    components: {
      'calendar': calendar,
      'builder-form': builderForm,
    },

    directives: {
      'click-outside': clickOutsideDirective,
    },

    methods: {

      showBuilder: function() {
        this.overlay.show();
        this.show = true;

        setTimeout(() => this.stripe.show = true, 100);
      },

      hideBuilder: function() {
        this.overlay.hide();
        this.show = false;

        this.stripe.show = false;

        this.formVisible = false;
      },

      pickDate(date) {

        this.formVisible = true;
        setTimeout(() => this.$refs.form.slideUp(), 10);

      },

      bindEvents: function() {
        this.$on('collapse-me', this.hideBuilder);
      },

    },

    created: function() {
      this.bindEvents();

      this.calendarArgs = {
        date: new Date(),
        onpick: this.pickDate,
      };

      this.showBuilder();
    },

  }

</script>
