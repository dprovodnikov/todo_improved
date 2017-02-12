<template>
  <div class="b-form-wrap" @click="slideUp" :class="{'b-form-collapsed': isCollapsed}" v-click-outside> 
    
    <div class="form-unit">
      <div class="form-unit-top">
        <div class="unit-description">Task description</div>
        <div class="unit-counter">Characters: {{description.length}}/<u>{{max}}</u></div>
      </div>
      <div contenteditable
           class="b-form-textfield"
           v-editable-model:max="description"
           v-placeholder="Example: Do some house cleaning every saturday morning">
      </div>
    </div>

    <div class="b-form-footer">
      <div class="b-save-btn">Save task</div>
    </div>

  </div>
</template>

<script>

  import clickOutsideDirective from '../../directives/click-outside.js';
  import placeholderDirective from '../../directives/placeholder.js';
  import editableModel from '../../directives/editable-model.js';

  export default {
    directives: {
      'editable-model': editableModel,
      'placeholder': placeholderDirective,
      'click-outside': clickOutsideDirective,
    },

    data: function() {
      return {
        max: 130,
        description: '',

        isCollapsed: false,
      };
    },

    methods: {
      slideDown: function() {
        this.isCollapsed = true;
        this.$emit('down');
      },

      slideUp: function() {
        this.isCollapsed = false;
        this.$emit('up');
      },

      bindEvents: function() {
        this.$on('collapse-me', () => this.slideDown());
      },
    },

    ready: function() {
      this.bindEvents();
    }
  }
</script>