<template>
  <div transition="task" class="tl-task {{getPriority(task.priority)}}"
    v-if="show"
    @click="check()"
    :class="{'tl-task-active': checked, 'tl-task-updating': updating}">
    
    <div class="tl-task-content" v-show="!updating">
      <div class="tl-task-text">{{task.text}}</div>
      <div class="tl-task-folder">
        <div class="fa fa-folder" style="color: {{task.folder.color}}"></div>
      </div>
    </div>

    <div class="tl-task-editor" v-show="updating">
    <i class="fa fa-close tl-te-cancel" @click="close()"></i>

      <textarea class="tl-te-text" v-model="newText" autofocus>{{task.text}}</textarea>

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

          <i class="fa fa-flag tl-te-tool tl-priority-0" @click="setPriority(0)"></i>
          <i class="fa fa-flag tl-te-tool tl-priority-1" @click="setPriority(1)"></i>
          <i class="fa fa-flag tl-te-tool tl-priority-2" @click="setPriority(2)"></i>
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
  import format from '../utils/date-converter.js';

  export default {

    filters: {
      date: function(value, pattern) {
        return format(pattern, new Date(value.toString()));
      }
    },

    props: ['eventBus', 'task', 'showDelay'],

    data: function() {
      return {
        affected: false,
        checked: false,
        show: false,
        updating: false,
        updated: false,
        doNotFocusOnMe: false,

        newText: '',
        newPriority: this.task.priority,
        newFolder: this.task.folder,
        newDate: this.task.date,

        old: {},

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
        if(this.updating || this.doNotFocusOnMe) return false
        this.eventBus.$emit('task-selected', this.task);
        this.checked = true;
      },

      switchToolset: function(toolset) {
        for(let [k, v] of Object.entries(this.toolsets))
          this.toolsets[k] = (k == toolset)
      },

      saveChanges: function() {
        let task = this.task;

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

        this.doNotFocusOnMe = true;
        setTimeout(() => this.doNotFocusOnMe = false, 1000);
      },

      undoChanges: function() {
        for(let [k, v] of Object.entries(this.old))
          this.task[k] = v;

        this.old = {};
        this.newPriority = this.task.priority;
        this.newFolder = this.task.folder;
        this.newDate = this.task.date;
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
        this.newPriority = priority;
        this.switchToolset('main');
      },

      setFolder: function(folder) {
        this.newFolder = folder;
        this.switchToolset('main');
      },

      setDeadline: function() {
        this.eventBus.$emit('open-calendar', {
          date: this.newDate, 
          onpick: (date) => this.newDate = date.instance
        });
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

      bindEvents: function() {
        this.eventBus.$on('task-selected', () => {
          this.close(); // helps to avoid simultaneous updating of different tasks
          this.checked = false;
        });

        this.eventBus.$on('task-unfocus', () => {
          this.checked = false;
        });

        this.eventBus.$on('toolbar-action', (task) => {
          if(task == this.task && task.status != 'updated') {
            this.affected = true;
            this.show = false;
          } else if (task == this.task)
            this.updating = true;
        });

        this.eventBus.$on('changes-undo', task => {
          if(task == this.task && task.status != 'updated')
            this.show = true;
          else if(task == this.task) {
            this.undoChanges();
          }
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
    }
  }
</script>

<style lang="stylus">
  
  .task-transition
    transition transform .3s cubic-bezier(.87,-.41,.19,1.44),
      background 50ms, opacity .3s cubic-bezier(.87,-.41,.19,1.44)
  
  .task-enter,
  .task-leave
    opacity 0
    transform scale(.7)
    
  .toolset-transition
    transition all .1s .1s
  .toolset-main-transition
    transition all .1s

  .toolset-enter
    transform rotateX(-90deg)
  .toolset-leave
    display none

  .toolset-main-enter,
  .toolset-main-leave
    transform rotateX(90deg)

</style>
