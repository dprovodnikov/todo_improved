<template>
  
  <nav class="app-sidebar" v-click-outside>

    <ul class="main-nav">
      <li v-for="button in buttons"
          v-bind:class="{'sidebar-item-active': button.active}"
          v-bind:id="button.id"
          v-on:click="openPanel(button.id)">
        
        <div v-show="button.hint" class="main-nav-hint">{{button.hint}}</div>
        <i :class="button.icon"></i>
      </li>
    </ul>

    <div transition="slide" class="side-panel" v-if="buttons[1].panel.show">
      <usercard :event-bus="eventBus"></usercard>
    </div>

    <div transition="slide" class="side-panel" v-if="buttons[2].panel.show">
      <calendar @close="closePanel()" :init-args="initArgs" :event-bus="eventBus"></calendar>
    </div>

    <div transition="slide" class="side-panel" v-if="buttons[3].panel.show">
      <charts :event-bus="eventBus"></charts>
    </div>

    <div transition="slide" class="side-panel" v-show="buttons[5].panel.show">
      <event-history @event-happen="updateHint"
                     @events-cleared="setEventsToZero"
                     :event-bus="eventBus">
      </event-history>
    </div>

    <div transition="slide" class="side-panel transparent" v-if="buttons[6].panel.show">
      <folders :event-bus="eventBus"></folders>
    </div>

  </nav>

</template>

<script>

  import clickOutsideDirective from '../directives/click-outside.js';
  import usercard from './usercard/usercard.vue';
  import calendar from './calendar/calendar.vue';
  import charts from './chart/charts.vue';
  import folders from './folders/folders.vue';
  import eventHistory from './events/history.vue';

  export default {
    components: {
      'usercard': usercard,
      'calendar': calendar,
      'charts': charts,
      'folders': folders,
      'event-history': eventHistory,
    },

    directives: {
      'click-outside': clickOutsideDirective,
    },

    props: ['eventBus'],

    data: function() {
      return {
        activeButton: null,
        initArgs: {},
        buttons: [
          {
            id: 'search',  
            active: false,
            icon: 'fa fa-search', 
            panel: {show: false },
          }, {
            id: 'user',
            active: false,
            icon: 'fa fa-user',
            panel: { show: false },
          }, {
            id: 'calendar',
            active: false,
            icon: 'fa fa-calendar',
            panel: { show: false },
          }, {
            id: 'charts',
            active: false,
            icon: 'fa fa-pie-chart',
            panel: { show: false },
          }, {
            id: 'weather',
            active: false,
            icon: 'fa fa-cloud',
            panel: { show: false },
          }, {
            id: 'events',
            active: false,
            icon: 'fa fa-bell',
            panel: { show: false },
            hint: 4,
          }, {
            id: 'folders',
            active: false,
            icon: 'fa fa-folder',
            panel: { show: false },
          }, {
            id: 'exit',
            active: false,
            icon: 'fa fa-sign-out',
            panel: { show: false },
          },
        ],
      };
    },

    methods: {
      openPanel: function(id) {
        this.buttons.forEach(button => {
          if(id == button.id) {
            button.active = !button.active;
            button.panel.show = !button.panel.show;
            this.activeButton = button;
          } else {
            button.active = false;
            button.panel.show = false;
          }
        });
      },

      closePanel: function() {
        if(this.activeButton) {
          this.activeButton.active = false;
          this.activeButton.panel.show = false;

          this.initArgs = {};
        }
      },

      updateHint: function(count) {this.buttons[5].hint = count},

      setEventsToZero: function() {
        this.buttons[5].hint = 0
        this.closePanel();
      },

      bindEvents: function() {
        this.eventBus.$on('sidebar-focus-lost', () => {
          this.closePanel();
        });

        this.eventBus.$on('open-calendar', args => {
          this.openPanel('calendar');
          this.initArgs = args;
        });

        this.$on('collapse-me', () => {
          this.closePanel();
        });
      }
    },

    created: function() {
      this.bindEvents()

      this.openPanel('charts');
    }

  }
</script>



