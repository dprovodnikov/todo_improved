<template>
  
  <div class="auth-form">
    <div class="auth-form__track">

      <div v-show="!mode" class="form-hint form-hint--left-aligned">
        <h2 class="form-hint__h">Don't Have an account?</h2>
        <p class="form-hint__text">Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Exercitationem eligendi repudiandae
        </p>
        <div class="form-hint__footer">
          <button class="form-button" @click="toggleMode">Sign up</button>
        </div>
      </div>

      <div v-show="mode" class="form-hint form-hint--right-aligned">
        <h2 class="form-hint__h">Have an account?</h2>
        <p class="form-hint__text">Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Exercitationem eligendi repudiandae
        </p>
        <div class="form-hint__footer">
          <button class="form-button" @click="toggleMode">Sign in</button>
        </div>
      </div>

    </div>

    <div class="form-instance form-instance--{{boxAlignClass}}-aligned">
      <form>
        <h1 class="form-instance__title">{{title}}</h2>
        
        <fieldset>
          <input v-if="mode" v-model="fullName" type="text" placeholder="Full name">
          <input v-model="email" type="text" placeholder="E-mail">
          <input v-model="password" type="password" placeholder="Password">
        </fieldset>

        <div class="form-instance__footer">
          <a href="#" class="form-instance__link">Forgot password?</a>
          <button class="form-button form-button--filled" @click.prevent="execute">{{title}}</button>
        </div>

      </form>
    </div>

    <div class="auth-form__box auth-form__box--{{boxAlignClass}}-aligned"></div>
  </div>

</template>

<script>
  import * as UserService from '../../services/user-service';

  export default {
    data: function() {
      return {
        mode: false,
        fullName: '',
        password: 'somesome',
        email: 'wireden@yandex.ru',
      }
    },

    methods: {
      toggleMode: function() {
        this.mode = !this.mode;
        this.emptyForm();
      },

      emptyForm() {
        this.fullName = '';
        this.password = '';
        this.email = '';
      },

      execute: function() {
        if (this.mode && !this.email.trim()) {
          return false
        }

        const { fullName, password, email } = this;

        if (this.mode) {

          UserService.signUp({ fullName, password, email })
            .then(user => {
              alert(`user ${user.email} signed up successfully`);
              this.toggleMode();
            })
            .catch(err => {
              alert(err.message || 'Something went wrong');
            })

        } else {

          UserService.signIn({ email, password })
            .then(user => {
              location.reload();
            })
            .catch(err => {
              alert(err.message || 'Something went wrong');
            });

        }

      },
    },

    computed: {
      boxAlignClass: function() {
        return this.mode ? 'left' : 'right'
      },

      title: function() {
        return this.mode ? 'Sign Up' : 'Sign In';
      }
    }
  }
</script>




















