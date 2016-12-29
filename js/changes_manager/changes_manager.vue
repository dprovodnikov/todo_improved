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

    methods: {
      undoOne: function(task) {
        this.eventBus.$emit('changes-undo', task);
      },

      undoAll: function() {
        this.eventBus.$emit('changes-undo-all');
      },
    },

    created: function() {
      setTimeout(() => {
        this.cm = new ChangesManager('.' + this.$parent.$el.className);

        this.cm.addEventListener('undo', this.undoOne);
        this.cm.addEventListener('undoall', this.undoAll);

      }, 1000);

      this.eventBus.$on('toolbar-action', task => {
        this.cm.update(task);
      });
    }
  };

</script>

