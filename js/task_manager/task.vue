<template>
  <div v-if="show" class="tl-task {{task.priorityClass}}" @click="check()" :class="{'tl-task-active': checked}">
    <div class="tl-task-text">{{task.text}}</div>
    <div class="tl-task-folder">
      <div class="fa fa-folder" style="color: {{task.folder.color}}"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['eventBus', 'task'],

    data: function() {
      return {
        checked: false,
        show: true,
      };
    },

    methods: {
      check: function() {
        this.eventBus.$emit('task-selected', this.task);
        this.checked = true;
      }
    },

    created: function() {
      this.eventBus.$on('task-selected', () => {
        this.checked = false;
      });

      this.eventBus.$on('task-unfocus', () => {
        this.checked = false;
      });

      this.eventBus.$on('toolbar-action', (task) => {
        if(task == this.task && task.status != 'updated')
          this.show = false;
      });

      this.eventBus.$on('changes-undo', task => {
        if(task == this.task && task.status != 'updated')
          this.show = true;
      });

      this.eventBus.$on('changes-undo-all', () => {
        if(!this.show) this.show = true;
      });
    }
  }
</script>