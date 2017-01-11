<template>
  
  <div v-show="show"
       class="tm-context-menu"
       style="top: {{coords.y}}px; left: {{coords.x}}px"
       transition="context"
       v-click-outside>
    
    <button class="tm-context-button">
      <i class="fa fa-pencil"></i>
      <span>Update the task</span>
    </button>

    <div class="tm-context-splitter"></div>

    <div class="tm-context-toolset">
      <h2>Planning</h2>
      <ul>
        <li>
          <i class="fa fa-calendar-check-o"></i>
          <span class="tm-ctx-toolset-hint">Today</span>
        </li>
        <li>
          <i class="fa fa-calendar-plus-o"></i>
          <span class="tm-ctx-toolset-hint">Tomorrow</span>
        </li>
        <li>
          <i class="fa fa-calendar"></i>
          <span class="tm-ctx-toolset-hint">Next week</span>
        </li>
        <li>
          <i class="fa fa-sliders"></i>
          <span class="tm-ctx-toolset-hint">More</span>
        </li>
      </ul>
    </div>

    <div class="tm-context-toolset">
      <h2>Priorities</h2>
      <ul>
        <li>
          <i class="fa fa-flag tl-priority-0"></i>
          <span class="tm-ctx-toolset-hint">Low</span>
        </li>
        <li>
          <i class="fa fa-flag tl-priority-1"></i>
          <span class="tm-ctx-toolset-hint">Normal</span>
        </li>
        <li>
          <i class="fa fa-flag tl-priority-2"></i>
          <span class="tm-ctx-toolset-hint">High</span>
        </li>
      </ul>
    </div>

    <div class="tm-context-splitter"></div>

    <button class="tm-context-button">
      <i class="fa fa-check"></i>
      <span>Mark as complete</span>
    </button>

    <button class="tm-context-button">
      <i class="fa fa-trash"></i>
      <span>Remove the task</span>
    </button>

   </div>

</template>

<script>
  import clickOutsideDirective from '../directives/click-outside.js';
  
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
      bindEvents: function() {
        this.$on('collapse-me', () => this.show = false);

        this.eventBus.$on('open-context', args => {
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

          this.show = !this.show;
        });
      }
    },

    created: function() {
      this.bindEvents();
    },

  }

</script>

<style lang="stylus">
  
  .context-transition
    transition transform .1s, opacity .1s, left .1s .2s, top .1s .2s

  .context-enter,
  .context-leave
    opacity 0
    transform translateY(5%)

</style>