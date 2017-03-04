<template>
  
  <div class="folders-list-wrap">
    <ul class="folders-list">
      <li v-for="folder in folders" class="fl-folder" style="color: {{folder.color}}">
        <div class="fl-folder-hint">{{ folder.hint }}</div>
      </li>
      <li class="fl-add-folder">
        <div class="fl-folder-hint">New one</div>
      </li>
    </ul>
  </div>

</template>

<script>
  import * as FolderService from '../../../services/folder-service.js';
  
  export default {

    data: function() {
      return {
        folders: [],
      };
    },

    created: function() {
      FolderService.all()
        .then(res => {
          this.folders = res.folders;
        })
        .catch(err => {
          if (err) throw err;
        })
    }

  };

</script>
