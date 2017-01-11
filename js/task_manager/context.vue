<template>
  
  <div v-show="show"
       class="tm-context-menu"
       style="top: {{coords.y}}px; left: {{coords.x}}px"
       transition="context"
       v-click-outside>
    
    <div class="tm-context-toolset"></div>

    <div class="tm-context-splitter"></div>

    <div class="tm-context-toolset"></div>

    <div class="tm-context-splitter"></div>

    <div class="tm-context-toolset"></div>

    <div class="tm-context-splitter"></div>

    <div class="tm-context-toolset"></div>

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
          this.show = !this.show 
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