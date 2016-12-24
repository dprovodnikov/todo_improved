import Toolbar from './toolbar';
import ChangesManager from '../changes_manager/main';

class TaskManager {
  constructor(targetSelector, tasks) {
    this.targetEl = $(targetSelector);
    this.tasks = tasks;
    this.changesManager = new ChangesManager('.application-container');

    this.class = {
      main: 'tl-task',
      active: 'tl-task-active',
      removed: 'tl-task-removed',
      priority: {
        low: 'tl-task-low',
        normal: 'tl-task-normal',
        high: 'tl-task-high',
      },
    }

    this._render();

    this.toolbar = new Toolbar(targetSelector);
    this.taskEls = $(`.${this.class.main}`);

    this._bindEvents();
  }

  _getTask(id) {
    return this.tasks.filter(e => e.id == id)[0];
  }

  _removeFromList(el) {
    el.addClass(this.class.removed);
    el.css('margin-top', -el.height() - parseInt(el.css('margin-bottom')) );

    let transitionDuration = parseFloat(el.css('transition-duration')) * 1000;

    setTimeout(() => {
      el.hide();
    }, transitionDuration);
  }

  _bindEvents() {
    this.taskEls.click(e => {
      this.taskEls.removeClass(this.class.active)

      const el = $(e.target);
      const id = el.attr('id');

      this.toolbar.show({
        oncomplete: () => { 
          let task = this._getTask(id);
          task.status = 'completed';
          this.changesManager.update(task);
          this._removeFromList(el);
        },
        onupdate: () => { 
          let task = this._getTask(id);
          task.status = 'updated';
          this.changesManager.update(task);
          this._removeFromList(el);
        },
        ondelete: () => { 
          let task = this._getTask(id);
          task.status = 'deleted';
          this.changesManager.update(task);
          this._removeFromList(el);
        },
      });

      $(e.target).addClass(this.class.active);
    });

    $(document).click(e => {
      if(!$(e.target).hasClass(this.class.main)) {
        this.toolbar.hide();
        this.taskEls.removeClass(this.class.active);
      }
    });
  }

  _render() {
    let template = '';

    for(let task of this.tasks) {
      let priorityClass = '';
      switch(task.priority) {
        case 0: priorityClass = this.class.priority.low; break;
        case 1: priorityClass = this.class.priority.normal; break;
        case 2: priorityClass = this.class.priority.high; break;
      }

      template += `
        <div id="${task.id}" class="tl-task ${priorityClass} tl-task-shifted">
          <div class="tl-task-text">${task.text}</div>
          <div class="tl-task-folder">
            <div class="fa fa-folder" style="color: ${task.folder.color}"></div>
          </div>
        </div>
      `;
    }

    this.targetEl.append(`<div class="tasklist-global">${template}</div>`);
  }

  list() {
    let timeout = 100;

    for(let task of this.taskEls) {
      task = $(task);
      setTimeout(function() {

        task.show();
        setTimeout(function() {
          task.removeClass('tl-task-shifted');
        }, 50);

      }, timeout)

      timeout += 100;
    }
  }
  
}

export default TaskManager;
