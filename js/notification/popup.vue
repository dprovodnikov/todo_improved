<template>
  
  <div v-show="show" class="notification-popup">
    <div class="np-icon">
      <i class="fa fa-bell"></i>
    </div>
    <span class="np-message">{{ message }}</span>
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
    border-radius 3px
    margin 20px
    font 500 1em 'Hind'
    color #fff
    position absolute
    bottom 0; left 0
    z-index 5
    overflow hidden
    box-shadow 0 5px 10px 1px rgba(0, 0, 0, .8);
    background #3d3d3d
    opacity .8

  .np-icon
    height 100%
    width 50px
    background #000
    display flex
    justify-content center
    align-items center
    i
      font-size 1em
      color #fff
  
  .np-message
    padding 20px

  .popup-transition
    transition all .4s
  .popup-enter,
  .popup-leave
    bottom -100%

</style>