<template>
  
  <div class="toolbar">
    <div v-show="show" @click="complete()" transition="toolbar" class="tb-tool tb-tool-complete">
      <i class="fa fa-check"></i>
    </div>
    <div v-show="show" @click="update()" transition="toolbar" class="tb-tool tb-tool-update">
      <i class="fa fa-pencil"></i>
    </div>
    <div v-show="show" @click="delete()" transition="toolbar" class="tb-tool tb-tool-delete">
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
        task: {}
      };
    },
    methods: {

      complete: function() {
        this.task.status = 'completed';
        this.eventBus.$emit('toolbar-action', this.task);
      },
      update: function() {
        this.task.status = 'updated';
        this.eventBus.$emit('toolbar-action', this.task);
      },
      delete: function() {
        this.task.status = 'deleted';
        this.eventBus.$emit('toolbar-action', this.task);
      },

    },
    created: function() {
      this.eventBus.$on('task-selected', task => {
        this.show = true;
        this.task = task;
      });

      this.eventBus.$on('task-unfocus', () => {
        this.show = false;
      });
    }
  };

</script>


