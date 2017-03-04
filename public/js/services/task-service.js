import $ from 'jquery';

export function getCurrent() {
  return $.get('/tasks/current');
}

export function getOverdue() {
  return $.get('/tasks/overdue');
}

export function getCompleted() {
  return $.get('/tasks/completed');
}

export function create(task) {
  return $.post('/tasks/create', task);
}

export function update(task) {
  return $.post('/tasks/update', task);
}

export function remove({ _id }) {
  return $.post('/tasks/delete', { _id });
}

export function complete({ _id }) {
  return $.post('/tasks/complete', { _id });
}