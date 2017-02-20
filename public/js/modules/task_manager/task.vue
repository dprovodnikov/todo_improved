<template>
  <div  class="tl-task {{getPriority(task.priority)}}"
    transition="task"
    v-if="show"
    v-right-click="openContext"
    @click="check()"
    :class="{'tl-task-active': checked, 'tl-task-updating': updating, 'tl-task-highlight': contextOpen}">
    
    <div class="tl-task-content" v-show="!updating">
      <div class="tl-task-text">{{task.text}}</div>
      <div class="tl-task-date">{{task.date | date 'dd, M'}}</div>
      <div class="tl-task-folder">
        <i class="fa fa-folder" style="color: {{task.folder.color}}"></i>
      </div>
    </div>

    <div class="tl-task-editor" v-show="updating">
    <i class="fa fa-close tl-te-cancel" @click="close()"></i>

      <div class="tl-te-text" v-editable-model="newText" contenteditable></div>

      <div class="tl-te-toolbar">

        <div class="tl-te-tools-wrap" v-show="toolsets.main" transition="toolset-main">
          <i class="fa fa-calendar tl-te-tool" @click="setDeadline()">
            <span class="tl-te-tool-hint">Deadline</span>
            <span class="tl-te-date">{{newDate | date 'dd-mm-yy'}}</span>
          </i>
          <i class="fa fa-flag tl-te-tool tl-priority-{{newPriority}}" @click="switchToolset('priorities')">
            <span class="tl-te-tool-hint">Priority</span>
          </i>
          <i class="fa fa-folder tl-te-tool" @click="switchToolset('folders')" style="color: {{newFolder.color}}">
            <span class="tl-te-tool-hint">Folder</span>
          </i>
        </div>

        <div class="tl-te-toolset" v-show="toolsets.priorities" transition="toolset">
          <i class="fa fa-long-arrow-left tl-te-back" @click="switchToolset('main')"></i>

          <i :class="{'priority-current': newPriority == 0 }"
             class="fa fa-flag tl-te-tool tl-priority-0"
             @click="setPriority(0)">
          </i>
          <i :class="{'priority-current': newPriority == 1 }"
             class="fa fa-flag tl-te-tool tl-priority-1"
             @click="setPriority(1)">
          </i>
          <i :class="{'priority-current': newPriority == 2 }"
             class="fa fa-flag tl-te-tool tl-priority-2"
             @click="setPriority(2)">
          </i>
        </div>

        <div class="tl-te-toolset" v-show="toolsets.folders" transition="toolset">
          <i class="fa fa-long-arrow-left tl-te-back" @click="switchToolset('main')"></i>

          <i v-for="folder in folders"
             class="fa fa-folder tl-te-tool" 
             style="color: {{folder.color}}"
             @click="setFolder(folder)">
          </i>
        </div>

        <button class="tl-te-btn" @click="saveChanges()">Save</button>
      </div>
    </div>
    
  </div>


</template>

<script>
  import { format, compare } from '../../utils/date-utils.js';
  import rightClickDirective from '../../directives/right-click.js';
  import editableModelDirective from '../../directives/editable-model.js';

  export default {

    directives: {
      'right-click': rightClickDirective,
      'editable-model': editableModelDirective,
    },

    filters: {
      date: function(value, pattern) {
        return format(pattern, new Date(value.toString()));
      }
    },

    props: ['eventBus', 'task', 'showDelay'],

    data: function() {
      return {
        affected: false, // means "deleted" of "completed" but not confirmed yet
        checked: false,
        show: false,
        updating: false, // means the editor is open and changes are being done now
        updated: false, // means "updated" but not confirmed yet

        newText: this.task.text,
        newPriority: this.task.priority,
        newFolder: this.task.folder,
        newDate: this.task.date,

        isEdited: false,

        old: {},

        contextOpen: false,

        toolsets: {
          main: true,
          folders: false,
          priorities: false
        },

        folders: [
         { hint: 'Films', color: 'lightgreen' },
         { hint: 'Friends', color: 'lightblue' },
         { hint: 'Family', color: 'orange' },
         { hint: 'Job', color: 'grey' },
         { hint: 'Hobbies', color: '#3d3d3d' },
        ],

      };
    },

    methods: {
      check: function() {
        if(this.updating) return false
        this.eventBus.$emit('task-selected', this.task);
        this.checked = true;
      },

      switchToolset: function(toolset) {
        for(let [k, v] of Object.entries(this.toolsets))
          this.toolsets[k] = (k == toolset)
      },

      saveChanges: function() {
        let task = this.task;

        if(!this.isEdited && task.text == this.newText) {
          this.updating = false;
          return;
        }

        this.old = this.updated ? this.old : {
          text: task.text,
          priority: task.priority,
          folder: task.folder,
          date: task.date,
        };

        task.text = this.newText;
        task.priority = this.newPriority;
        task.folder = this.newFolder;
        task.date = this.newDate;
        this.eventBus.$emit('task-updated', task);
        this.updated = true;
        this.updating = false;

        this.isEdited = false;
      },

      undoChanges: function() {
        for(let [k, v] of Object.entries(this.old))
          this.task[k] = v;

        this.old = {};
        this.newPriority = this.task.priority;
        this.newFolder = this.task.folder;
        this.newDate = this.task.date;
        this.newText = this.task.text;
        this.task.status = '';
        this.updated = false;
      },

      confirmChanges: function() {
        this.old = {};
        this.newPriority = this.task.priority;
        this.newFolder = this.task.folder;
        this.newDate = this.task.date;
        this.updated = false;
        this.task.status = '';
      },

      setPriority: function(priority) {

        if(priority != this.newPriority) {
          this.isEdited = true;
          this.newPriority = priority;
        }

        this.switchToolset('main');
      },

      setFolder: function(folder) {

        if(folder != this.newFolder) {
          this.isEdited = true;
          this.newFolder = folder;
        }

        this.switchToolset('main');
      },

      setDeadline: function(ops={}) {
        if(ops.date) {

          if(compare(ops.date, this.newDate)) {
            return false
          }

          this.newDate = ops.date;
          this.isEdited = true;
          this.saveChanges()

        } else {
          setTimeout(() => {
            this.eventBus.$emit('open-calendar', {
              date: this.newDate, 

              onpick: (date) => {

                if(compare(date.instance, this.newDate)) {
                  return false
                }

                this.isEdited = true;
                this.newDate = date.instance

                if(ops.autosave) {
                  this.saveChanges()
                }

              }

            });
          }, 10);
        }

      },

      getPriority: function(priority) {
        return priority == 0 ? 'tl-task-low' : (priority == 1 ? 'tl-task-normal' : 'tl-task-high');
      },

      close: function() {
        this.updating = false;
        this.newPriority = this.task.priority;
        this.newFolder = this.task.folder;
        this.newDate = this.task.date;
        this.switchToolset('main');
      },

      openContext: function(e) {
        if(this.updating) return false;
        this.eventBus.$emit('open-context', {vm: this, event: e});
        this.eventBus.$emit('task-unfocus');
      },

      markAsDeleted: function(task) {
        this.affected = true;
        this.show = false;
      },

      bindEvents: function() {
        this.eventBus.$on('task-selected', () => {
          this.close(); // helps to avoid simultaneous updating of different tasks
          this.checked = false;
        });

        this.eventBus.$on('task-unfocus', () => this.checked = false);

        this.eventBus.$on('toolbar-action', task => {
          if(task != this.task) return false;

          if(task.status != 'updated')
            this.markAsDeleted();
          else {
            this.eventBus.$emit('task-selected');
            this.updating = true;
          }
        });

        this.eventBus.$on('changes-undo', task => {
          if(task != this.task) return false;

          if(task.status != 'updated') {
            this.show = true;
            this.affected = false;
          }
          else
            this.undoChanges();
        });

        this.eventBus.$on('changes-undo-all', () => {
          if(!this.show) {
            this.show = true;
            this.affected = false;
          }

          if(this.updated)
            this.undoChanges();
        });

        this.eventBus.$on('changes-confirm', () => {
          if(this.affected)
            this.$emit('task-remove', this);

          if(this.updated)
            this.confirmChanges();
        });
      },

    },

    computed: {
      priority: function() {
        let p = this.task.priority;
        return p === 0 ? [1, 2] : (p === 1 ? [0, 2] : [0, 1]);
      },
    },

    created: function() {
      setTimeout(() => this.show = true, this.showDelay)
      this.bindEvents();
    },

  }
</script>

<style lang="stylus"></style>
