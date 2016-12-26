// Scripts
import nav from './sidebar/nav';
import ChangesManager from './changes_manager/main';
import TaskManager from './task_manager/manager';
import taskList from './task_manager/fake-tasks';

// Styles
import styles from '../stylus/main.styl';

// Vues
import taskManager from './taskmanager.vue';

nav();

const app = new Vue({
  el: '.application-container',
  data: {},
  components: {
    'task-manager': taskManager
  },
});

// let tm = new TaskManager('.app-content', taskList);
// tm.list();