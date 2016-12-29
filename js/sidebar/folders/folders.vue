<template>
  
  <div class="folders-list-wrap">
    <ul class="folders-list">
      <li v-for="folder in folders" class="fl-folder" style="color: {{folder.color}}">
        <div class="fl-folder-hint">{{ folder.hint }}</div>
      </li>
    </ul>
  </div>

</template>

<script>
  
  export default {

    data: function() {
      return {
        folders: [
         { hint: 'Films', color: 'lightgreen' },
         { hint: 'Friends', color: 'lightblue' },
         { hint: 'Family', color: 'orange' },
         { hint: 'Job', color: 'grey' },
         { hint: 'Hobbies of harry', color: '#3d3d3d' },
        ],
      };
    },

  };

</script>
