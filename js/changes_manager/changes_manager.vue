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

      confirm: function() {
        this.eventBus.$emit('changes-confirm');
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

