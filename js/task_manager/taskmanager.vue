<template>

  <div class="tasklist-global">
    <div v-for="task in tasks" @click="check(task)" class="tl-task {{task.priorityClass}}">
      <div class="tl-task-text">{{task.text}}</div>
      <div class="tl-task-folder">
        <div class="fa fa-folder" style="color: {{task.folder.color}}"></div>
      </div>
    </div>
  </div> 


</template>

<script>
  import taskList from './fake-tasks.js';

  export default {
    props: ['eventBus'],
    data: function() {
      return {
        tasks: [],
        priority: {
          low: 'tl-task-low',
          normal: 'tl-task-normal',
          high: 'tl-task-high',
        },
      };
    },
    methods: {
      check: function(task) {
        this.eventBus.$emit('task-selected', task);
      },
      prioritize: function(taskList) {

        let getPriority = (priority) => {
          let priorityClass = '';
          switch(priority) {
            case 0: priorityClass = this.priority.low; break;
            case 1: priorityClass = this.priority.normal; break;
            case 2: priorityClass = this.priority.high; break;
          }
          return priorityClass;
        }

        return taskList.map(e => {
          e.priorityClass = getPriority(e.priority);
          return e;
        });

      },
    },
    created: function() {
      this.tasks = this.prioritize(taskList);
    }
  }

</script>
