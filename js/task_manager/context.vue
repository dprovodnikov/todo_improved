<template>
  
  <div v-show="show"
       class="tm-context-menu"
       style="top: {{coords.y}}px; left: {{coords.x}}px"
       transition="context"
       v-click-outside>
    
    <button class="tm-context-button" @click="doAction('updated')">
      <i class="fa fa-pencil fa-fw"></i>
      <span>Update the task</span>
    </button>

    <div class="tm-context-splitter"></div>

    <div class="tm-context-toolset">
      <h2>Planning</h2>
      <ul>
        <li @click="setDeadline(new Date())">
          <i class="fa fa-calendar-check-o"></i>
          <span class="tm-ctx-toolset-hint">Today</span>
        </li>
        <li @click="setDeadline(tomorrow())">
          <i class="fa fa-calendar-plus-o"></i>
          <span class="tm-ctx-toolset-hint">Tomorrow</span>
        </li>
        <li @click="setDeadline(nextWeek())">
          <i class="fa fa-calendar"></i>
          <span class="tm-ctx-toolset-hint">Next week</span>
        </li>
        <li @click="setDeadline()">
          <i class="fa fa-calendar-o"></i>
          <span class="tm-ctx-toolset-hint">More</span>
        </li>
      </ul>
    </div>

    <div class="tm-context-toolset">
      <h2>Priorities</h2>
      <ul>
        <li @click="setPriority(0)">
          <i class="fa fa-flag tl-priority-0"></i>
          <span class="tm-ctx-toolset-hint">Low</span>
        </li>
        <li @click="setPriority(1)">
          <i class="fa fa-flag tl-priority-1"></i>
          <span class="tm-ctx-toolset-hint">Normal</span>
        </li>
        <li @click="setPriority(2)">
          <i class="fa fa-flag tl-priority-2"></i>
          <span class="tm-ctx-toolset-hint">High</span>
        </li>
      </ul>
    </div>

    <div class="tm-context-splitter"></div>

    <button class="tm-context-button" @click="doAction('completed')">
      <i class="fa fa-check fa-fw"></i>
      <span>Mark as complete</span>
    </button>

    <button class="tm-context-button" @click="doAction('deleted')">
      <i class="fa fa-trash fa-fw"></i>
      <span>Remove the task</span>
    </button>

   </div>

</template>

<script>
  import clickOutsideDirective from '../directives/click-outside.js';
  import {tomorrow, thisDayNextWeek} from '../utils/date-utils.js';
  
  export default {

    props: ['eventBus'],

    directives: {
      'click-outside': clickOutsideDirective
    },

    data: function() {
      return {
        show: false,
        coords: {},
        vm: null,
      };
    },

    methods: {
      doAction: function(status) {
        this.vm.task.status = status;
        this.eventBus.$emit('toolbar-action', this.vm.task);

        this.close();
      },

      setPriority: function(priority) {
        this.vm.newPriority = priority;
        this.vm.task.status = 'updated';
        this.vm.saveChanges();

        this.close();
      },

      setDeadline: function(date) {
        this.vm.task.status = 'updated';
        if(date)
          this.vm.setDeadline({date: date});
        else
          this.vm.setDeadline({autosave: true});

        this.close();
      },

      close: function() {
        this.show = false;
        if(this.vm)
          this.vm.contextOpen = false;
      },

      tomorrow: tomorrow,
      nextWeek: thisDayNextWeek,

      bindEvents: function() {
        this.$on('collapse-me', this.close);

        this.eventBus.$on('open-context', args => {
          if(this.show) {
            this.show = false;
            if(this.vm)
              this.vm.contextOpen = false;
            return false;
          }

          let rootEl, contextEl, rootOffset, difference;

          rootEl = $('.app-content');
          contextEl = $(this.$el);
          rootOffset = rootEl.offset();
          difference = 0; // amount of how far the context menu would be beyond the app borders

          let [x, y] = [
            args.event.pageX - rootOffset.left,
            args.event.pageY - rootOffset.top
          ];

          let [rootEnd, contextEnd] = [
            rootOffset.top + rootEl.outerHeight(true),
            y + contextEl.outerHeight(true) + rootOffset.top
          ];

          if(contextEnd > rootEnd)
            difference = contextEl.outerHeight(true)

          this.coords = {x: x, y: y - difference}
          this.vm = args.vm;

          this.show = true;
          this.vm.contextOpen = true;
        });
      }
    },

    created: function() {
      this.bindEvents();
    },

  }

</script>
