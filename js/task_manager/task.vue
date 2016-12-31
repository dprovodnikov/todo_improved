<template>
  <div class="tl-task {{task.priorityClass}}"
    v-if="show"
    v-on:click="check()"
    v-bind:class="{'tl-task-active': checked}">

    <div class="tl-task-text">{{task.text}}</div>
    <div class="tl-task-folder">
      <div class="fa fa-folder" style="color: {{task.folder.color}}"></div>
    </div>

    <div class="tl-task-editor">
      <div class="tl-te-priority task-priority-{{task.priority}}">
        <i class="fa fa-flag priority-available task-priority-{{priority[0]}}"></i>
        <i class="fa fa-flag priority-current"></i>
        <i class="fa fa-flag priority-available task-priority-{{priority[1]}}"></i>
      </div>

      <input type="text" v-model="task.text" class="tl-te-text"/>
    </div>

  </div>
</template>

<script>
  export default {
    props: ['eventBus', 'task'],

    data: function() {
      return {
        affected: false,
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

    computed: {
      priority: function() {
        let p = this.task.priority;
        return p === 0 ? [1, 2] : (p === 1 ? [0, 2] : [0, 1]);
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
        if(task == this.task && task.status != 'updated') {
          this.affected = true;
          this.show = false;
        }
      });

      this.eventBus.$on('changes-undo', task => {
        if(task == this.task && task.status != 'updated')
          this.show = true;
      });

      this.eventBus.$on('changes-undo-all', () => {
        if(!this.show) this.show = true;
      });

      this.eventBus.$on('changes-confirm', () => {
        if(this.affected)
          this.$emit('task-remove', this);
      });
    }
  }
</script>