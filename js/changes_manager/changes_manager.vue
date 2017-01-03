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

      undoAll: function(count) {
        this.eventBus.$emit('changes-undo-all');
        this.eventBus.$emit('notify', `${count} changes were undone`);
      },

      confirm: function(count) {
        this.eventBus.$emit('changes-confirm');
        this.eventBus.$emit('notify', `${count} changes were confirmed`);
      }
    },

    created: function() {
      setTimeout(() => {
        let cm = new ChangesManager('.' + this.$parent.$el.className);

        cm.addEventListener('undo', this.undoOne);
        cm.addEventListener('undoall', this.undoAll);
        cm.addEventListener('confirm', this.confirm);

        this.cm = cm;
      }, 1000);

      this.eventBus.$on('toolbar-action', task => {
        if(task.status != 'updated')
          this.cm.update(task);
      });

      this.eventBus.$on('task-updated', task => {
        this.cm.update(task);
      });
    }
  };

</script>

