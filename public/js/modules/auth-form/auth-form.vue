<template>
  
  <div class="auth-form">
    <div class="auth-form__track">

      <div class="form-hint form-hint--left-aligned">
        <h2 class="form-hint__h">Don't Have an account?</h2>
        <p class="form-hint__text">Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Exercitationem eligendi repudiandae
        </p>
        <div class="form-hint__footer">
          <button class="form-button">Sign up</button>
        </div>
      </div>

      <div class="form-hint form-hint--right-aligned">
        <h2 class="form-hint__h">Have an account?</h2>
        <p class="form-hint__text">Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Exercitationem eligendi repudiandae
        </p>
        <div class="form-hint__footer">
          <button class="form-button">Sign in</button>
        </div>
      </div>

    </div>

    <div class="form-instance form-instance--left-aligned">
      <form>
        <h class="form-instance__title">Sign Up</h>
        
        <fieldset>
          <input type="text" placeholder="Full name">
          <input type="text" placeholder="E-mail">
          <input type="password" placeholder="Password">
        </fieldset>

        <div class="form-instance__footer">
          <a href="#" class="form-instance__link">Forgot password?</a>
          <button class="form-button form-button--filled">Sign Up</button>
        </div>

      </form>
    </div>

    <div class="auth-form__box"></div>
  </div>

</template>

<script>
  export default {}
</script>