class TaskManager {
  constructor(targetSelector, tasks) {
    this.targetEl = $(targetSelector);
    this.tasks = tasks

    this.class = {
      priority: {
        low: 'tl-task-low',
        normal: 'tl-task-normal',
        high: 'tl-task-high',
      }
    }

    this._render();

    this.taskEls = $('.tl-task');
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
        <div class="tl-task ${priorityClass} tl-task-shifted">
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
          task.css('opacity', '1');
          task.removeClass('tl-task-shifted');
        }, 50);

      }, timeout)

      timeout += 100;
    }
  }
  
}

export default TaskManager;
