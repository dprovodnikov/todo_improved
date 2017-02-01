<template>
  <div v-click-outside>

    <div v-show="show" transition="builder" class="builder" >
      <header class="builder-topbar">
        <div class="b-title">Task builder</div>
        <div class="b-topbar-controls">
          <i class="fa fa-close" @click="hideBuilder"></i>
        </div>
      </header>
      
      <section class="builder-content">
        
      <div class="b-text-wrap">
        <div id="b-text"
          class="b-text"
          contenteditable
          v-editable-model="text"
          v-placeholder="Sometimes the same is different">
        </div>
        <div class="b-date">
          <i class="fa fa-fw fa-calendar-o"></i>
          {{new Date() | date 'dd M, w'}}
        </div>
      </div>


      </section>

      <footer class="builder-footer">
        <div class="b-save-btn">Save task</div>
        <div class="b-footer-controls">
          
          <i class="fa fa-flag-o">
            <span class="b-hint">Priority</span>
          </i>

          <i class="fa fa-folder-o">
            <span class="b-hint">Folders</span>
          </i>

        </div>
      </footer>
    </div>

    <button @click="showBuilder" class="add-button-global">
      <i class="fa fa-pencil"></i>
    </button>
  </div>
</template>

<script>
  import { format } from '../../utils/date-utils.js';
  import clickOutsideDirective from '../../directives/click-outside.js';
  import placeholderDirective from '../../directives/placeholder.js';
  import editableModel from '../../directives/editable-model.js';
  
  export default {

    props: ['eventBus'],

    data: function() {
      return {
        show: false,
        text: '',
        overlay: $('#overlay'),
      };
    },

    filters: {
      date: function(value, pattern) {
        return format(pattern, new Date(value.toString()));
      }
    },

    directives: {
      'click-outside': clickOutsideDirective,
      'editable-model': editableModel,
      'placeholder': placeholderDirective,
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
    }
  }

</script>
