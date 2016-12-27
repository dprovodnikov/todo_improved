// Scripts
import nav from './sidebar/nav';

// Styles
import styles from '../stylus/main.styl';

// Vues
import taskManager from './task_manager/taskmanager.vue';
import toolbar from './task_manager/toolbar.vue';
import changesManager from './changes_manager/changes_manager.vue';

nav();

// root vue component
const app = new Vue({
  el: '.application-container',
  data: {
    eventBus: new Vue(),
  },
  components: {
    'task-manager': taskManager,
    'toolbar': toolbar,
    'changes-manager': changesManager,
  },
});
