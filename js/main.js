// Scripts
import nav from './sidebar/nav';
import ChangesManager from './changes_manager/main';
import TaskManager from './task_manager/manager';

// Styles
import styles from '../stylus/main.styl';

// Vues
import taskManager from './task_manager/taskmanager.vue';
import toolbar from './task_manager/toolbar.vue'

nav();

const app = new Vue({
  el: '.application-container',
  data: {
    eventBus: new Vue(),
  },
  components: {
    'task-manager': taskManager,
    'toolbar': toolbar
  },
});
