<template>
  
  <div class="tl-task-filter">
    <div class="tl-filter-title tl-filter-today">Tasks for today</div>
    <div class="tl-filter-controls">
      <div class="tl-filter-select"
           @click="f.show = !f.show"
           v-bind:class="{'select-open': f.show, 'select-close': !f.show}">

        <div class="tl-filter-name">By date</div>

        <i class="fa fa-filter tl-filter-icon"></i>

        <div class="tl-filter-list">
          <li v-for="filter in f.list">
            <i :class="filter.icon"></i>
            {{filter.text}}
          </li>
        </div>

      </div>
    </div>
  </div>

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
        tasks: taskList,
        f: {
          list: [
           { icon: 'fa fa-flag', text: 'Priority' },
           { icon: 'fa fa-sort-alpha-asc', text: 'Alphabet' },
           { icon: 'fa fa-sort-amount-asc', text: 'Length' },
          ],
          show: false,
        }
      };
    },
    methods: {
      removeTask: function(task) {
        this.tasks.$remove(task);
      }
    },
  }

</script>

