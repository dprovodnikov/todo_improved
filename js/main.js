// Styles
import styles from '../stylus/main.styl';

// Vues
import taskManager from './task_manager/taskmanager.vue';
import toolbar from './task_manager/toolbar.vue';
import changesManager from './changes_manager/changes_manager.vue';
import sidebar from './sidebar/sidebar.vue';
import currentDate from './current-date/current-date.vue';
import notificationPopup from './sidebar/events/popup.vue';

/*
* A Vue.js plugin for easily animating v-for rendered lists.
* Repository: https://github.com/vuejs/vue-animated-list
*/
Vue.use(require('../vendor/vue-animated-list'));

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
