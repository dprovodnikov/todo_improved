<template>

  <div class="event-history">
    
    <div class="event-topbar">
      <div class="event-topbar-title">
        <i class="fa fa-bell" style="transform: rotate(20deg)"></i>
        Recent events
      </div>
      <div class="event-topbar-controls">

        <i class="fa fa-trash fa-fw" @click="clear">
          <span class="event-topbar-hint">Delete these</span>
        </i>
        <i class="i fa fa-bell-slash fa-fw">
          <span class="event-topbar-hint">Disable notifications</span>
        </i>

      </div>
    </div>

    <div class="event-list">
      <div transition="task" v-show="showEvents" v-for="event of events" class="event-notification">
        <div class="event-time">{{event.time}}</div>
        <div class="event-action-label event-{{event.kind}}"></div>
        <div class="event-title">{{event.title}}</div>
        <div class="event-description">{{{event.description}}}</div>
      </div>
    </div>

  </div>

</template>

<script>
  import {format} from '../../utils/date-utils.js';

  export default {

    props: ['eventBus'],

    data: function() {
      return {
        showEvents: false,
        events: [],
      };
    },

    methods: {
      clear: function() {
        this.events = [];
        this.$emit('events-cleared');
      },

      bindEvents: function() {
        this.eventBus.$on('notify', (event) => {
          this.events.push({
            title: event.title,
            description: event.description,
            kind: event.kind,
            time: format("dd M 'on' h:t'pm'", event.time)
          });

          if(this.events.length > 4) {
            this.events.shift()
          }
        });
      },
    },

    created: function() {
      this.bindEvents();

      setTimeout(() => this.showEvents = true, 200); //to achieve the init animation
    },

  }
</script>
