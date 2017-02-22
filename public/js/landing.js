// styles
import styles from '../stylus/landing/main.styl'

// Vues
import authForm from './modules/auth-form/auth-form.vue';

new Vue({

  el: 'body',

  components: {
    'auth-form': authForm,
  }

});
