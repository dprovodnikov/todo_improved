import nav from './sidebar/nav';
import ChangesManager from './changes_manager/main';
import TaskManager from './task_manager/manager';

nav();

/***************************************
* CHANGES MANAGER TEST CALL
****************************************/

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

/***************************************
* TASK MANAGER TEST CALL
****************************************/

let taskList = [
  {
    text: 'Sometimes the same is different',
    priority: 0,
    folder: 'folder',
    id: 'task-1',
    date: new Date(),
    folder: {color: '#5ED2D3'}
  },
  {
    text: 'We have actually a lot of work to do',
    priority: 1,
    folder: 'folder',
    id: 'task-2',
    date: new Date(),
    folder: {color: '#D75555'}
  },
  {
    text: 'Make coffee, make a bed, go to work, beet people and so on',
    priority: 2,
    folder: 'folder',
    id: 'task-3',
    date: new Date(),
    folder: {color: '#597DA3'}

  },
  {
    text: 'Manage to accomplish all the tasks until the deadline is coming',
    priority: 1,
    folder: 'folder',
    id: 'task-4',
    date: new Date(),
    folder: {color: '#5EB571'}
  },
  {
    text: 'Some other motherfucking task to do, fuck',
    priority: 0,
    folder: 'folder',
    id: 'task-5',
    date: new Date(),
    folder: {color: '#CC5FC3'}
  },
];


let tm = new TaskManager('.app-content', taskList);
tm.list();