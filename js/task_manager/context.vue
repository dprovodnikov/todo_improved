<template>
  
  <div v-show="show"
       class="tm-context-menu"
       style="top: {{coords.y}}px; left: {{coords.x}}px"
       transition="context"
       v-click-outside>
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
          this.vm = args.vm;

          let applicationContainer = $('.app-content').offset();

          this.coords = {
            x: args.event.pageX - applicationContainer.left,
            y: args.event.pageY - applicationContainer.top
          }

          if(this.show) {
            this.show = false;
            setTimeout(() => this.show = true, 300);
          } else
            this.show = true;

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