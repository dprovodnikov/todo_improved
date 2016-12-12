import nav from './sidebar/nav';
import ChangesManager from './changes_manager/main'

nav();

let tasks = [
  { id: 'task-1', status: 'completed', title: 'Sometimes the same is different'},
  { id: 'task-2', status: 'updated', title: 'Make someone to do something'},
  { id: 'task-3', status: 'deleted', title: 'Another high-priority task'},
  { id: 'task-4', status: 'completed', title: 'Some very important work to do'},
  { id: 'task-5', status: 'completed', title: 'Some very important work to do'},
  { id: 'task-6', status: 'completed', title: 'Some very important work to do'},
];

let cm = new ChangesManager('.application-container');
cm.update(tasks[0]);
cm.update(tasks[1]);
cm.update(tasks[2]);
cm.update(tasks[3]);
cm.update(tasks[4]);
cm.update(tasks[5]);
