import $ form 'jquery';

export function getCurrent() {
  return $.get('/tasks/current');
}

export function getOverdue() {
  return $.get('/tasks/overdue');
}

export function getCompleted() {
  return $.get('/tasks/completed');
}

export function create(credentials) {
  return $.post('/tasks/save', credentials);
}

export function update(credentials) {
  return $.post('/tasks/update', credentials);
}

export function remove(_id) {
  return $.post('/tasks/delete', { _id });
}

export function complete(_id) {
  return $.post('/tasks/complete', { _id });
}