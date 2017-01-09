<template>
  
  <sortbar @key-changed="changeKey"></sortbar>

  <div class="tasklist-global" v-if="tasksShow" v-click-outside>
    <div v-for="task in sortedTasks" transition="sort">
      <task @task-remove="removeTask(task)"
            :task="task"
            :show-delay="(100 * $index) / 2"
            :event-bus="eventBus">
      </task>
    </div>
  </div> 
  
  <context-menu :event-bus="eventBus"></context-menu>

</template>

<script>
  import taskList from './fake-tasks.js';
  import taskComponent from './task.vue';
  import sortbar from './sortbar.vue';
  import contextMenu from './context.vue';
  import clickOutsideDirective from '../directives/click-outside.js';
  import _ from '_';

  export default {
    props: ['eventBus'],

    components: {
      'task': taskComponent,
      'sortbar': sortbar,
      'context-menu': contextMenu,
    },

    directives: {
      'click-outside': clickOutsideDirective
    },

    data: function() {
      return {
        tasks: taskList,
        tasksShow: false,
        key: {}
      };
    },

    methods: {
      removeTask: function(task) {
        this.tasks.$remove(task);
      },

      changeKey: function(key) {
        this.key = key;
      },

      bindEvents: function() {
        this.$on('collapse-me', () => {
          this.eventBus.$emit('task-unfocus');
        });
      }
    },

    computed: {
      sortedTasks: function() {
        let iteratees = {};

        let _default = { key: ['date'], option: ['asc'] };

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

      this.bindEvents();
    }
  }

</script>

<style lang="stylus">
  .sort-move
    transition transform .3s cubic-bezier(.55,0,.1,1)
</style>