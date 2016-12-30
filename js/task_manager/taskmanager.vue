<template>

  <div class="tasklist-global" v-click-outside="task-unfocus">
    <task @task-remove="removeTask(task)" v-for="task in tasks" :task="task" :event-bus="eventBus"></task>
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
        tasks: [],
      };
    },
    methods: {
      prioritize: function(taskList) {

        function getPriority(priority) {
          return priority == 0 ? 'tl-task-low' : (priority == 1 ? 'tl-task-normal' : 'tl-task-high');
        }

        return taskList.map(e => {
          e.priorityClass = getPriority(e.priority);
          return e;
        });

      },

      removeTask: function(task) {
        this.tasks.$remove(task);
      }
    },
    created: function() {
      this.tasks = this.prioritize(taskList);
    }
  }

</script>
