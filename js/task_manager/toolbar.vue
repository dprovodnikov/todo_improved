<template>
  
  <div class="toolbar">
    <div @click="complete()" class="tb-tool tb-tool-complete {{ show ? '' : 'tb-tool-hidden' }}">
      <i class="fa fa-check"></i>
    </div>
    <div @click="update()" class="tb-tool tb-tool-update {{ show ? '' : 'tb-tool-hidden' }}">
      <i class="fa fa-pencil"></i>
    </div>
    <div @click="delete()" class="tb-tool tb-tool-delete {{ show ? '' : 'tb-tool-hidden' }}">
      <i class="fa fa-trash"></i>
    </div>
  </div>

</template>

<script>

  export default {
    props: ['eventBus'],
    data: function() {
      return {
        show: false,
        task: {}
      };
    },
    methods: {

      complete: function() {
        this.eventBus.$emit('complete-action', task);
      },
      update: function() {
        this.eventBus.$emit('update-action', task);
      },
      delete: function() {
        this.eventBus.$emit('delete-action', task);
      },

    },
    created: function() {
      this.eventBus.$on('task-selected', task => {
        this.show = true;
        this.task = task;
      });
    }
  };

</script>