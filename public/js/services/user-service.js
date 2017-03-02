import $ from 'jquery';

export function signUp(credentials) {
  return $.post('/user/signup', credentials);
}

export function signIn(credentials) {
  return $.post('/user/signin', credentials);
}

export function getUser() {
  // get user from the current session
  console.log('getting user...');
}

export function logout() {
  return $.get('/user/logout');
}
