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

        this.eventBus.$emit('notify', {
          title: `User refused to ${task.status.slice(0, -1) || 'update'} the task`,
          description: task.text,
          kind: task.status || 'updated',
          time: new Date(Date.now())
        });

      },

      undoAll: function(tasks) {
        this.eventBus.$emit(
          'changes-undo-all',
          `${tasks.length} ${tasks.length > 1 ? 'changes were' : 'change was'} rejected`
        );

      },

      confirm: function(tasks) {
        this.eventBus.$emit('changes-confirm');

        const categories = {
          completed: '',
          deleted: '',
          updated: '',
        };

        for (let task of tasks) {
          categories[task.status || 'updated'] += `${task.text}, `;
        }

        let description = '';
        for (let [key, value] of Object.entries(categories)) {
          if (value) {
            description += `<b>${key}:</b> ${value}<br/>`;
          }
        }

        this.eventBus.$emit('notify', {
          title: `Some changes were confirmed`,
          description: description,
          kind: 'updated',
          time: new Date(Date.now())
        });
      },

      bindEvents: function() {
        this.eventBus.$on('toolbar-action', (tasks) => {
          tasks.forEach(task => {
            if (task.status != 'updated') {
              this.cm.update(task);
            }
          });
        });

        this.eventBus.$on('task-updated', (task) => {
          this.cm.update(task);
        });
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

      this.bindEvents();
    }
  };

</script>

