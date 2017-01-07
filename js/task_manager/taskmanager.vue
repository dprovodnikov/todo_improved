<template>
  
  <div class="tl-task-filter">
    <div class="tl-filter-title">
      <i class="fa fa-th-list"></i>
      {{ f.active.hint }}
    </div>
    <div class="tl-filter-controls">

      <div class="tl-filter-select"
           @click="f.show = !f.show"
           :class="{'select-open': f.show, 'select-close': !f.show}">

        <div class="tl-filter-name">By {{ f.active.name }}</div>

        <i class="{{f.active.icon}} tl-filter-icon"></i>

        <div class="tl-filter-list">

          <li v-for="filter in f.list | available" @click="f.active = filter">
            <i :class="filter.icon"></i>
            {{ filter.name }}
          </li>

        </div>

      </div>

    </div>
  </div>

  <div class="tasklist-global" v-click-outside="task-unfocus" v-if="tasksShow">
    <task v-for="task in sortedTasks"
          :task-remove="removeTask(task)"
          :task="task"
          :show-delay="(100 * $index) / 2"
          :event-bus="eventBus">
    </task>
  </div> 

</template>

<script>
  import taskList from './fake-tasks.js';
  import taskComponent from './task.vue';
  import clickOutsideDirective from '../directives/click-outside.js';
  import _ from '_';

  export default {
    props: ['eventBus'],

    components: {
      task: taskComponent
    },

    filters: {
      available: function(array) {
        return array.filter(item => this.f.active != item);
      }
    },

    directives: {
      'click-outside': clickOutsideDirective
    },

    data: function() {
      return {
        tasks: taskList,
        f: { //filter
          list: [
            { icon: 'fa fa-calendar',        name: 'date',     hint: 'Tasks for today' },
            { icon: 'fa fa-flag',            name: 'priority', hint: 'High pripority first' },
            { icon: 'fa fa-sort-alpha-asc',  name: 'alphabet', hint: 'Tasks in alphabet order' },
            { icon: 'fa fa-sort-amount-desc', name: 'length',   hint: 'Longest tasks first' },
          ],
          active: {},
          show: false,
        },

        tasksShow: false,

      };
    },

    methods: {
      removeTask: function(task) {
        this.tasks.$remove(task);
      },
    },

    computed: {
      sortedTasks: function() {
        let iteratees = {};

        let _default = { key: ['priority'], option: ['desc'] };

        switch(this.f.active.name) {
          case 'date':
            iteratees = { key: ['date'], option: ['asc'] }; break;
          case 'priority':
            iteratees = _default; break;
          case 'length':
            iteratees = { key: ['text', task => task.text.length], option: ['asc'] }; break;
          case 'alphabet':
            iteratees = { key: ['text'], option: ['asc'] }; break;
          default: iteratees = _default;
        }


        return _.orderBy(this.tasks, iteratees.key, iteratees.option);
      }
    },

    created: function() {
      this.f.active = this.f.list[0];

      setTimeout(() => this.tasksShow = true, 50);
    }
  }

</script>

