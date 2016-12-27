<template>
  
  <nav class="app-sidebar">
    <ul class="main-nav">
      <li v-for="button in buttons"
          v-bind:class="{'sidebar-item-active': button.active}"
          v-bind:id="button.id"
          v-on:click="openPanel(button.id)">

        <i :class="button.icon"></i>
      </li>
    </ul>
    <div class="side-panel">
      <usercard v-if="buttons[1].panel.show"></usercard>
    </div>
  </nav>

</template>

<script>

  import usercard from './usercard/usercard.vue';

  export default {
    components: {
      'usercard': usercard,
    },
    props: ['eventBus'],
    data: function() {
      return {
        buttons: [
          {
            id: 'search',  
            active: false,
            icon: 'fa fa-search' , 
            panel: {
              show: false
            },
          },
          {
            id: 'user',   
            active: false,
            icon: 'fa fa-user' , 
            panel: {
              show: false
            },
          },
          {
            id: 'calendar',
            active: false,
            icon: 'fa fa-calendar' , 
            panel: {
              show: false
            },
          },
          {
            id: 'charts', 
            active: false,
            icon: 'fa fa-area-chart' , 
            panel: {
              show: false
            },
          },
          {
            id: 'weather',
            active: false,
            icon: 'fa fa-cloud' , 
            panel: {
              show: false
            },
          },
          {
            id: 'events', 
            active: false,
            icon: 'fa fa-bell' , 
            panel: {
              show: false
            },
          },
          {
            id: 'labels', 
            active: false,
            icon: 'fa fa-folder' , 
            panel: {
              show: false
            },
          },
          {
            id: 'exit',   
            active: false,
            icon: 'fa fa-sign-out' , panel: {
              show: false
            },
          },
        ],
      };
    },
    methods: {
      openPanel: function(id) {
        this.buttons.map(e => {
          if(id == e.id) {
            e.active = !e.active;
            e.panel.show = !e.panel.show;
          } else {
            e.active = false;
            e.panel.show = false;
          }
        });
      }
    },
  }
</script>

