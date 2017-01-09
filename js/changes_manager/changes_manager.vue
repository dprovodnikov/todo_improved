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

        this.eventBus.$emit('notify', 'One change was undone');
      },

      undoAll: function(count) {
        this.eventBus.$emit('changes-undo-all');

        let pluralExpression = (count == 1) ? 'change was' : 'changes were';

        this.eventBus.$emit('notify', `${count == 1 ? 'One' : count} ${pluralExpression} undone`);
      },

      confirm: function(count) {
        this.eventBus.$emit('changes-confirm');

        let pluralExpression = (count == 1) ? 'change was' : 'changes were';

        this.eventBus.$emit('notify', `${count == 1 ? 'One' : count} ${pluralExpression} confirmed`);
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

