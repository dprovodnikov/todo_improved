<template>
  


</template>


<script>

  import ChangesManager from './main.js';

  export default {
    props: ['eventBus'],
    data: function() {
      return {
        cm: null,
      };
    },
    created: function() {
      setTimeout(() => {
        this.cm = new ChangesManager('.' + this.$parent.$el.className);
      }, 1000);

      this.eventBus.$on('toolbar-action', task => {
        this.cm.update(task);
      });
    }
  };

</script>

