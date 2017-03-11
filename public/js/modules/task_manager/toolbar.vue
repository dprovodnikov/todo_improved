<template>
  
  <div class="toolbar">
    <div v-show="show" @click="commit('completed')" transition="toolbar" class="tb-tool tb-tool-complete">
      <i class="fa fa-check"></i>
    </div>
    <div v-show="show"
         @click="commit('updated')"
         transition="toolbar"
         class="tb-tool tb-tool-update"
         :class="{'tb-tool-disabled': tasks.length > 1}">
      <i class="fa fa-pencil"></i>
    </div>
    <div v-show="show" @click="commit('deleted')" transition="toolbar" class="tb-tool tb-tool-delete">
      <i class="fa fa-trash"></i>
    </div>
  </div>

</template>

<script>

  export default {
    props: ['eventBus'],

    data: function() {
      return {
        show: false,
        tasks: []
      };
    },

    methods: {
      commit: function(status) {
        const tasks = this.tasks.map(task => Object.assign(task, { status }));

        this.eventBus.$emit('toolbar-action', tasks);

        this.tasks.length = 0;
      },
    },

    created: function() {
      this.eventBus.$on('task-selected', (task) => {
        this.show = true;
        this.tasks = new Array(task);
      });

      this.eventBus.$on('multiple-selection', (tasks) => {
        this.show = true;
        this.tasks = tasks;

        // ------------------------------------------------------------------------------
        // i am not sure whats the reason, but vue doesn't refresh
        // the dom if the tasks.length decreases, it does if the length increases though
        // That is why we have to remove the class manually
        // ------------------------------------------------------------------------------
        if (this.tasks.length <= 1) {
          $(this.$el).find('.tb-tool-disabled').removeClass('tb-tool-disabled');
        }

      });

      this.eventBus.$on('task-unfocus', () => {
        this.show = false;
      });
    },

  };

</script>


