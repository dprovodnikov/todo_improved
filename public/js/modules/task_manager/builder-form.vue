<template>
  <div class="b-form-wrap" @click="slideUp()" :class="{'b-form-collapsed': isCollapsed}" v-click-outside> 

    <div class="b-form-tip">
      <i class="fa fa-pencil"></i>
    </div>
    
    <div class="form-unit">
      <div class="form-unit-top">
        <div class="unit-description">Task description</div>
        <div class="unit-counter">Characters: {{description.length}}/<u>{{max}}</u></div>
      </div>
      <div class="b-textfield-wrap">

        <div v-show="folders.dropdown" v-click-outside="folders-dropdown" transition="dropdown" class="b-form-dropdown">
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
             v-folders-list:#="folders.current"
             v-placeholder="Example: Do some house cleaning every saturday morning">
        </div>

      </div>
    </div>

    <div class="b-form-footer">
      <div class="b-form-controls">

        <div v-show="priorities.dropdown" v-click-outside="priorities-dropdown" class="b-priority-list" transition="dropdown">
          <i class="fa fa-flag tl-priority-{{val}}"
             v-for="val of priorities.list"
             @click="setPriority(val)">
          </i>
        </div>

        <i data-except="priorities-dropdown" class="fa fa-fw fa-flag{{ priorities.current == null ? '-o' : '' }} tl-priority-{{priorities.current}}"
           @click="togglePrioritiesDropdown()">
        </i>

        <i data-except="folders-dropdown" class="fa fa-fw fa-folder{{ folders.current ? '' : '-o' }}"
           @click="toggleFoldersDropdown()"
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
  import foldersList from '../../directives/folders-list.js';

  export default {
    props: ['deadline'],

    directives: {
      'editable-model': editableModel,
      'placeholder': placeholderDirective,
      'click-outside': clickOutsideDirective,
      'folders-list': foldersList,
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
           { id: 5, hint: 'Hobby', color: '#3d3d3d' },
          ],
        },

        isCollapsed: true,
      };
    },

    methods: {
      setFolder: function(id) {
        let folder = this.folders.list.filter(e => e.id == id)[0];
        this.folders.current = folder;
        this.hideFoldersDropdown();
      },

      setPriority: function(value) {
        this.priorities.current = value;
        this.hidePrioritiesDropdown();
      },

      togglePrioritiesDropdown() { this.priorities.dropdown = !this.priorities.dropdown; },

      hidePrioritiesDropdown() { this.priorities.dropdown = false; },

      toggleFoldersDropdown() { this.folders.dropdown = !this.folders.dropdown; },

      hideFoldersDropdown() { this.folders.dropdown = false; },

      slideDown: function() {
        this.isCollapsed = true;
        this.$emit('down');
      },

      slideUp: function() {
        this.isCollapsed = false;
        this.$emit('up');
      },

      save: function() {

        let task = {
          text: this.description,
          priority: this.priorities.current,
          folder: this.folders.current,
          date: this.deadline,
        };

        this.$emit('save', task);

        setTimeout(() => this.slideDown(), 0);
      },

      bindEvents: function() {
        this.$on('collapse-me', () => this.slideDown());
        this.$on('folders-dropdown', () => this.hideFoldersDropdown());
        this.$on('priorities-dropdown', () => this.hidePrioritiesDropdown());
      },
    },

    ready: function() { this.bindEvents(); this.slideUp(); }
  }
</script>