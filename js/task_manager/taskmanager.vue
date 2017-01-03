<template>

  <div class="tasklist-global" v-click-outside="task-unfocus">
    <task v-for="task in tasks"
          v-on:task-remove="removeTask(task)"
          v-bind:task="task"
          v-bind:event-bus="eventBus">
    </task>
  </div> 

</template>

<script>
  import taskList from './fake-tasks.js';
  import taskComponent from './task.vue';
  import clickOutsideDirective from '../directives/click-outside.js';

  export default {
    props: ['eventBus'],
    components: {
      task: taskComponent
    },
    directives: {
      'click-outside': clickOutsideDirective
    },
    data: function() {
      return {
        tasks: taskList
      };
    },
    methods: {
      removeTask: function(task) {
        this.tasks.$remove(task);
      }
    },
  }

</script>

