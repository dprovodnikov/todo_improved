<template>
  
  <div v-show="show" class="notification-popup">
    <span>{{ message }}</span>
  </div>

</template>

<script>
  
  export default {

    props: ['eventBus', 'duration'],

    data: function() {
      return {
        show: false,
        message: 'Sometimes the same is different'
      }
    },

    created: function() {
      this.eventBus.$on('notify', message => {
        this.message = message;
        this.show = true;

        setTimeout(() => {this.show = false}, this.duration || 1500);
      });
    }
  }

</script>

<style lang="stylus">

  .notification-popup
    display flex
    align-items center
    height 50px
    background #1d1d1d
    border-radius 3px
    opacity .8
    margin 20px
    padding 20px
    font 500 1em 'Hind'
    color #fff
    position absolute
    bottom 0; left 0
    z-index 5
  
  .popup-transition
    transition all .4s
  .popup-enter,
  .popup-leave
    bottom -100%

</style>