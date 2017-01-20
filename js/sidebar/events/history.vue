<template>

  <div class="event-history">
    
    <div class="event-topbar" v-show="events.length">
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

    <div class="events-history-placeholder" v-else="events.length" transition="placeholder">
      <i class="fa fa-bell"></i>
      <p>
        Here you will see most recent notifications, events and reminders
      </p>
    </div>

    <div class="event-list">
      <div transition="task" v-show="showEvents" v-for="event of events" class="event-notification">
        <div class="event-time">{{event.time | date "dd M 'on' h:t'pm'"}}</div>
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

    filters: {
      date: function(value, pattern) {
        return format(pattern, new Date(value.toString()));
      }
    },

    data: function() {
      return {
        showEvents: false,
        events: [
          {
            title: 'Some bla bla were bla bla',
            description: 'Sometimes the same is different',
            time: new Date(),
            kind: 'completed',
          },
          {
            title: 'Some bla bla were bla bla',
            description: 'Sometimes the same is different',
            time: new Date(),
            kind: 'deleted',
          },
          {
            title: 'Some bla bla were bla bla',
            description: 'Sometimes the same is different',
            time: new Date(),
            kind: 'updated',
          },
          {
            title: 'Some bla bla were bla bla',
            description: 'Sometimes the same is different',
            time: new Date(),
            kind: 'reminder',
          },
        ],
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
            time: event.time
          });

          if(this.events.length > 4) {
            this.events.shift()
          }

          this.$emit('event-happen', this.events.length);
        });
      },
    },

    created: function() {
      this.bindEvents();

      setTimeout(() => this.showEvents = true, 200); //to achieve the init animation
    },

  }
</script>


