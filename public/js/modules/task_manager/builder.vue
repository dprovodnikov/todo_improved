<template>
  <div v-click-outside>

    <div v-show="show" transition="builder" class="builder" >
      <header class="builder-topbar">
        <div class="b-title">Task builder</div>
        <div class="b-topbar-controls">
          <i class="fa fa-close"></i>
        </div>
      </header>
      
      <section class="builder-content">
        
        <div id="b-text" class="b-text" contenteditable v-editable-model="text"></div>

      </section>

      <footer class="builder-footer">

        <button class="b-btn">Save</button>
      </footer>
    </div>

    <button @click="showBuilder" class="add-button-global">
      <i class="fa fa-pencil"></i>
    </button>
  </div>
</template>

<script>
  import clickOutsideDirective from '../../directives/click-outside.js';
  import editableModel from '../../directives/editable-model.js';
  
  export default {

    props: ['eventBus'],

    data: function() {
      return {
        show: false,
        overlay: $('#overlay'),
      };
    },

    directives: {
      'click-outside': clickOutsideDirective,
      'editable-model': editableModel,
    },

    methods: {

      showBuilder: function() {
        this.overlay.show();
        this.show = true;
      },

      hideBuilder: function() {
        this.overlay.hide();
        this.show = false;
      },

      bindEvents: function() {
        this.$on('collapse-me', this.hideBuilder);
      }
    },

    created: function() {

      this.bindEvents();
    },

    ready: function() {
      let el = document.getElementById('b-text');
      setTimeout(() => el.focus(), 10)
    }
  }

</script>
