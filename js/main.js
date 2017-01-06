// Styles
import styles from '../stylus/main.styl';

// Vues
import taskManager from './task_manager/taskmanager.vue';
import toolbar from './task_manager/toolbar.vue';
import changesManager from './changes_manager/changes_manager.vue';
import sidebar from './sidebar/sidebar.vue';
import currentDate from './current-date/current-date.vue';
import notificationPopup from './notification/popup.vue';

// root vue component
const app = new Vue({ 
  el: '.application-container',
  data: {
    eventBus: new Vue(), // allows all the components to communicate using events
  },
  components: {
    'task-manager': taskManager,
    'toolbar': toolbar,
    'changes-manager': changesManager,
    'sidebar': sidebar,
    'current-date': currentDate,
    'notification-popup': notificationPopup
  },
});
