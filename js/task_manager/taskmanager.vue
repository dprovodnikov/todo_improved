<template>
  
  <div class="tl-task-filter">
    <div class="tl-filter-title tl-filter-today">{{ f.active.hint }}</div>
    <div class="tl-filter-controls">

      <div class="tl-filter-select"
           @click="f.show = !f.show"
           :class="{'select-open': f.show, 'select-close': !f.show}">

        <div class="tl-filter-name">By {{ f.active.name }}</div>

        <i class="fa fa-filter tl-filter-icon"></i>

        <div class="tl-filter-list">

          <li v-for="filter in f.list | available" @click="f.active = filter">
            <i :class="filter.icon"></i>
            {{ filter.name }}
          </li>

        </div>

      </div>

    </div>
  </div>

  <div class="tasklist-global" v-click-outside="task-unfocus">
    <task v-for="task in tasks"
          :task-remove="removeTask(task)"
          :task="task"
          :event-bus="eventBus">
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
        f: {
          list: [
            { icon: 'fa fa-calendar', name: 'date', hint: 'Tasks for today' },
            { icon: 'fa fa-flag', name: 'priority', hint: 'High pripority first' },
            { icon: 'fa fa-sort-alpha-asc', name: 'alphabet', hint: 'Tasks in alphabet order' },
            { icon: 'fa fa-sort-amount-asc', name: 'length', hint: 'Longest tasks first' },
          ],
          active: {},
          show: false,
        }
      };
    },

    methods: {
      removeTask: function(task) {
        this.tasks.$remove(task);
      }
    },

    created: function() {
      this.f.active = this.f.list[0];
    }
  }

</script>

