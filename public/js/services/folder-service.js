import $ from 'jquery';

export function all() {
  return $.get('/folders/');
}

export function create(credentials) {
  return $.post('/folders/create', credentials);
}

export function update(credentials) {
  return $.post('/folders/update', credentials);
}

export function remove(_id) {
  return $.post('/folders/delete', { _id });
}
