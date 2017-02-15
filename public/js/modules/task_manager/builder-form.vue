<template>
  <div class="b-form-wrap" @click="slideUp" :class="{'b-form-collapsed': isCollapsed}" v-click-outside> 

    <div class="b-form-tip">
      <i class="fa fa-pencil"></i>
    </div>
    
    <div class="form-unit">
      <div class="form-unit-top">
        <div class="unit-description">Task description</div>
        <div class="unit-counter">Characters: {{description.length}}/<u>{{max}}</u></div>
      </div>
      <div class="b-textfield-wrap">

        <div v-show="folders.dropdown" transition="dropdown" class="b-form-dropdown">
          <ul>
            <li v-for="folder in folders.list" @click="setFolder(folder.id)">
              <i class="fa fa-fw fa-folder" style="color: {{folder.color}};"></i>
              <span>{{folder.hint}}</span>
            </li>
          </ul>
        </div>

        <div contenteditable
             class="b-form-textfield"
             v-editable-model:max="description"
             v-placeholder="Example: Do some house cleaning every saturday morning">
        </div>

      </div>
    </div>

    <div class="b-form-footer">


      <div class="b-form-controls">

        <div class="b-priority-list" transition="dropdown" v-show="priorities.dropdown">

          <i class="fa fa-flag tl-priority-{{val}}"
             v-for="val of priorities.list"
             @click="setPriority(val)">
          </i>

        </div>

        <i class="fa fa-fw fa-flag{{ priorities.current == null ? '-o' : '' }} tl-priority-{{priorities.current}}"
           @click="priorities.dropdown = !priorities.dropdown">
        </i>

        <i class="fa fa-fw fa-folder{{ folders.current ? '' : '-o' }}"
           @click="folders.dropdown = !folders.dropdown"
           style="color: {{folders.current.color}};">

          <span class="b-hint hover-hint">Set folder</span>
        </i>

      </div>

      <button @click="save()" class="b-save-btn">Save task</button>

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

        priorities: {
          dropdown: false, // show / hide
          current: null,
          list: [0, 1, 2], // allowed values
        },

        folders: {
          dropdown: false, // show / hide
          current: null,
          list: [
           { id: 1, hint: 'Films', color: 'lightgreen' },
           { id: 2, hint: 'Friends', color: 'lightblue' },
           { id: 3, hint: 'Family', color: 'orange' },
           { id: 4, hint: 'Job', color: 'grey' },
           { id: 5, hint: 'Hobbies of harry', color: '#3d3d3d' },
          ],
        },

        isCollapsed: true,
      };
    },

    methods: {
      setFolder: function(id) {
        let folder = this.folders.list.filter(e => e.id == id)[0];
        this.folders.current = folder;

        this.folders.dropdown = false;
      },

      setPriority: function(value) {
        this.priorities.current = value;

        this.priorities.dropdown = false;
      },

      slideDown: function() {
        this.isCollapsed = true;
        this.$emit('down');
      },

      slideUp: function() {
        this.isCollapsed = false;
        this.$emit('up');
      },

      save: function() {
        // collect a task
        let task = {};

        setTimeout(() => this.slideDown(), 0);

        // throw it up
        this.$emit('save', task);
      },

      bindEvents: function() {
        this.$on('collapse-me', () => this.slideDown());
      },
    },

    ready: function() {
      this.bindEvents();

      this.slideUp();
    }
  }
</script>