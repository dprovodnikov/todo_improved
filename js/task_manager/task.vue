<template>
  <div class="tl-task {{task.priorityClass}}"
    v-if="show"
    v-on:click="check()"
    v-bind:class="{'tl-task-active': checked, 'tl-task-updating': updating}">

    <div class="tl-task-content" v-if="!updating">
      <div class="tl-task-text">{{task.text}}</div>
      <div class="tl-task-folder">
        <div class="fa fa-folder" style="color: {{task.folder.color}}"></div>
      </div>
    </div>

    <div class="tl-task-editor" v-if="updating">
    <i class="fa fa-close tl-te-cancel" @click="updating = false"></i>

      <textarea class="tl-te-text" v-model="newText" autofocus>{{task.text}}</textarea>

      <div class="tl-te-toolbar">

        <div class="tl-te-tools-wrap" v-if="toolsets.main">
          <i class="fa fa-calendar tl-te-tool">
            <span class="tl-te-tool-hint">Deadline</span>
          </i>
          <i class="fa fa-flag tl-te-tool tl-priority-{{task.priority}}" @click="switchToolset('priorities')">
            <span class="tl-te-tool-hint">Priority</span>
          </i>
          <i class="fa fa-folder tl-te-tool" @click="switchToolset('folders')" style="color: {{task.folder.color}}">
            <span class="tl-te-tool-hint">Folder</span>
          </i>
        </div>

        <div v-if="toolsets.priorities">
          <i class="fa fa-long-arrow-left tl-te-back" @click="switchToolset('main')"></i>

          <i class="fa fa-flag tl-te-tool tl-priority-1"></i>
          <i class="fa fa-flag tl-te-tool tl-priority-2"></i>
          <i class="fa fa-flag tl-te-tool tl-priority-3"></i>
        </div>

        <div v-if="toolsets.folders">
          <i class="fa fa-long-arrow-left tl-te-back" @click="switchToolset('main')"></i>

          <i v-for="folder in folders"
             class="fa fa-folder tl-te-tool" 
             style="color: {{folder.color}}">
          </i>
        </div>

        <button class="tl-te-btn" @click="saveChanges()">Save</button>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props: ['eventBus', 'task'],

    data: function() {
      return {
        affected: false,
        checked: false,
        show: true,
        updating: false,
        updated: false,

        newText: '',

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
         { hint: 'Hobbies of harry', color: '#3d3d3d' },
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
        for(let [k, v] of Object.entries(this.toolsets)) {
          if(k == toolset)
            this.toolsets[k] = true;
          else
            this.toolsets[k] = false;
        };
      },

      saveChanges: function() {
        let task = this.task;

        task.old = {
          text: task.text,
          priority: task.priority,
          folder: {
            color: task.folder.color
          }
        };

        task.text = this.newText;
        this.eventBus.$emit('task-updated', task);
        this.updating = false;
        this.updated = true;
      },

      undoChanges: function() {
        for(let [k, v] of Object.entries(this.task.old)) {
          this.task[k] = v;
        }
      },
    },

    computed: {
      priority: function() {
        let p = this.task.priority;
        return p === 0 ? [1, 2] : (p === 1 ? [0, 2] : [0, 1]);
      }
    },

    created: function() {
      this.eventBus.$on('task-selected', () => {
        this.checked = false;
      });

      this.eventBus.$on('task-unfocus', () => {
        this.checked = false;
      });

      this.eventBus.$on('toolbar-action', (task) => {
        if(task == this.task && task.status != 'updated') {
          this.affected = true;
          this.show = false;
        } else if (task == this.task) {
          this.updating = true;
        }
      });

      this.eventBus.$on('changes-undo', task => {
        if(task == this.task && task.status != 'updated')
          this.show = true;
        else
          this.undoChanges();
      });

      this.eventBus.$on('changes-undo-all', () => {
        if(!this.show)
          this.show = true;
        if(this.updated)
          this.undoChanges();
      });

      this.eventBus.$on('changes-confirm', () => {
        if(this.affected)
          this.$emit('task-remove', this);

        if(this.updated)
          this.task.old = {};

      });
    }
  }
</script>