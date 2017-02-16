<template>
  <div v-click-outside>

    <div class="builder-wrap" transition="builder" v-if="show">

      <div class="builder-topbar">
        <div v-show="stripe.show" transition="stripe" class="b-title-stripe">
          <i class="fa fa-fw fa-pencil"></i>
          {{title}}
        </div>
      </div>

      <div class="b-date-wrap">
  
        <date-widget v-show="calendar.disabled"
          class="opaque"
          transition="date-widget"
          :default-date="date">
        </date-widget>
      </div>
      
      <calendar :init-args="calendar.args"
        :class="{'disabled': calendar.disabled, 'tight': true}">
      </calendar>


      <builder-form v-ref:form
        transition="builder-form"
        v-on:up="calendar.disabled = true"
        v-on:down="calendar.disabled = false"
        v-bind:deadline="date"
        v-on:save="save">
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
  import dateWidget from '../date-widget/date-widget.vue';
  
  export default {

    props: ['eventBus'],

    data: function() {
      return {
        show: false,
        overlay: $('#overlay'),

        date: new Date(),

        stripe: {
          show: false,
        },

        calendar: {
          disabled: false,
          args: {},
        },
      };
    },

    filters: {
      date: function(value, pattern) {
        return format(pattern, new Date(value.toString()));
      },
    },

    components: {
      'calendar': calendar,
      'builder-form': builderForm,
      'date-widget': dateWidget,
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
      },

      save: function(task) {
        this.$emit('task-composed', task);
        this.hideBuilder();
      },

      pickDate(date) {
        this.date = date.instance;
        setTimeout(() => this.$refs.form.slideUp(date.instance), 10);
      },

      bindEvents: function() {
        this.$on('collapse-me', this.hideBuilder);
      },

    },

    computed: {
      title: function() {
        return this.calendar.disabled
          ? 'Describe the task'
          : 'Set a deadline'
      }
    },

    created: function() {
      this.bindEvents();

      this.calendar.args = {
        date: new Date(),
        onpick: this.pickDate,
      };

    },

  }

</script>
