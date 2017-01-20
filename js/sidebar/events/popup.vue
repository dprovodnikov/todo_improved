<template>
  
  <div v-show="show" class="notification-popup" transition="popup">
    <div class="np-icon">
      <i class="fa fa-bell"></i>
    </div>
    <span class="np-message">{{ message }}</span>
  </div>

</template>

<script>
  
  export default {

    props: ['eventBus', 'duration'],

    data: function() {
      return {
        show: false,
        message: 'Sometimes the same is different'
      }
    },

    methods:  {

      showPopup(message) {
        this.message = message;
        this.show = true;
        setTimeout(() => {this.show = false}, this.duration || 1500);
      },

      bindEvents: function() {

        this.eventBus.$on('notify', (event) => {
          this.showPopup(event.title);
        });

        this.eventBus.$on('changes-undo-all', (message) => {
          this.showPopup(message);
        });

      },
    },

    created: function() {
      this.bindEvents();
    }
  }

</script>
