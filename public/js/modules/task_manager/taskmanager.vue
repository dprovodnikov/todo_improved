<template>
  
  <sortbar @key-changed="changeKey"></sortbar>

  <div class="tasklist-global" v-if="tasksShow" v-click-outside>
    <div v-for="task in sortedTasks" transition="sort">
      <task @task-remove="removeTask(task)"
            @task-update="updateTask(task)"
            @task-complete="completeTask(task)"
            :task="task"
            :show-delay="(100 * $index) / 2"
            :event-bus="eventBus">
      </task>
    </div>
  </div> 
  
  <context-menu :event-bus="eventBus"></context-menu>

  <builder @task-composed="saveTask" :event-bus="eventBus"></builder>


</template>

<script>
  // import taskList from './fake-tasks.js';
  import taskComponent from './task.vue';
  import sortbar from './sortbar.vue';
  import contextMenu from './context.vue';
  import builder from './builder.vue';
  import clickOutsideDirective from '../../directives/click-outside.js';
  import _ from '_';
  import * as TaskService from '../../services/task-service.js';

  export default {
    props: ['eventBus'],

    components: {
      'task': taskComponent,
      'sortbar': sortbar,
      'context-menu': contextMenu,
      'builder': builder,
    },
    
    directives: {
      'click-outside': clickOutsideDirective
    },

    data: function() {
      return {
        tasks: [],
        tasksShow: false,
        key: {}
      };
    },

    methods: {
      removeTask: function(task) {
        TaskService.remove(task)
          .then(() => {
            this.tasks.$remove(task);
          })
          .catch(err => {
            if (err) throw err;
          });
      },

      updateTask: function(task) {
        TaskService.update(task)
          .catch(err => {
            if (err) throw err;
          })
      },

      completeTask: function(task) {
        TaskService.complete(task)
          .catch(err => {
            if (err) throw err;
          })
      },

      changeKey: function(key) {
        this.key = key;
      },

      saveTask: function(task) {
        TaskService.create(task)
          .then(() => {
            this.tasks.push(task);
          })
          .catch(err => {
            if (err) throw err;
          });
      },

      bindEvents: function() {
        this.$on('collapse-me', () => {
          this.eventBus.$emit('task-unfocus');
        });
      },
    },

    computed: {
      sortedTasks: function() {
        let iteratees = {};

        const _default = { key: ['date'], option: ['asc'] };

        switch(this.key.name) {
          case 'date':
            iteratees = _default; break;
          case 'priority':
            iteratees = { key: ['priority'], option: ['desc'] }; break;
          case 'length':
            iteratees = { key: (task) => task.text.length, option: ['desc'] }; break;
          case 'alphabet':
            iteratees = { key: ['text'], option: ['asc'] }; break;
          default: iteratees = _default;
        }

        return _.orderBy(this.tasks, iteratees.key, iteratees.option);
      }
    },

    created: function() {
      //to achieve init transition
      setTimeout(() => this.tasksShow = true, 50);
      
      TaskService.getCurrent()
        .then(res => {
          this.tasks = res.tasks;
        })
        .catch(err => {
          if(err) throw err;
        })


      this.bindEvents();
    }
  }

</script>
