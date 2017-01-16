<template>

  <div class="event-history">
    
    <div class="event-topbar">
      <div class="event-topbar-title">
        <i class="fa fa-bell" style="transform: rotate(20deg)"></i>
        Recent events
      </div>
      <div class="event-topbar-controls">

        <i class="fa fa-trash fa-fw">
          <span class="event-topbar-hint">Delete these</span>
        </i>
        <i class="i fa fa-bell-slash fa-fw">
          <span class="event-topbar-hint">Disable notifications</span>
        </i>

      </div>
    </div>

    <div class="event-list">
      <div v-for="event of events" class="event-notification">
        <div class="event-time">{{event.time}}</div>
        <div class="event-action-label event-{{event.kind}}"></div>
        <div class="event-title">{{event.title}}</div>
        <div class="event-description">{{event.description}}</div>
      </div>
    </div>

  </div>

</template>

<script>
  export default {
    data: function() {
      return {
        events: [
          {
            title: 'The task was deleted',
            description: 'Manage to accomplish all the tasks until something bad happened',
            kind: 'deleted',
            time: '27 Jan on 9:23pm',
          }, {
            title: 'The task was completed',
            description: 'Sometimest hes same is different but mostly its the same',
            kind: 'completed',
            time: '24 Jan on 9:23pm',
          }, {
            title: 'The task was updated',
            description: 'Sometimest hes same is different',
            kind: 'updated',
            time: '22 Jan on 9:23pm',
          }, {
            title: 'The deadline is coming',
            description: 'Lorem ipsum dolor sit amet',
            kind: 'reminder',
            time: '15 Jan on 9:23pm',
          },
        ],
      };
    },

    methods: {
      bindEvents: function() {

      },
    },

    created: function() {
      this.bindEvents();
    },

  }
</script>
