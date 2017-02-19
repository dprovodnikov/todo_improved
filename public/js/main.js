//Styles
import styles from '../stylus/app/main.styl'

// Vues
import taskManager from './modules/task_manager/taskmanager.vue';
import toolbar from './modules/task_manager/toolbar.vue';
import changesManager from './modules/changes_manager/changes_manager.vue';
import sidebar from './modules/sidebar/sidebar.vue';
import dateWidget from './modules/date-widget/date-widget.vue';
import notificationPopup from './modules/sidebar/events/popup.vue';

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
    'date-widget': dateWidget,
    'notification-popup': notificationPopup
  },
});
