import Tabs from './tabs';

class ChangesManager {
  constructor(rootSelector) {
    this._render(rootSelector);

    this.el = $('.changes-manager');
    this.header = this.el.find('.cm-header');
    this.body = this.el.find('.cm-body');
    this.title = this.header.find('.cm-header-title');
    this.curtain = $('.cm-curtain');
    this.tasks = [];

    this.events = {};

    this.openedClass = 'cm-opened';

    this._bindEvents();
  }

  /*********************
  * PRIVATE
  *********************/
  _render(rootSelector) {
    let rootEl = $(rootSelector);
    
    rootEl.append('<div class="cm-curtain"></div>');

    let template = `
    <div class="changes-manager">
      <div class="cm-header">
        <div class="cm-header-title"></div>
        <div class="cm-header-controls">
          <i class="fa fa-check"></i>
        </div>
      </div>
      <div class="cm-body"></div>
    </div>`;

    rootEl.find('.app-content').append(template);
  }

  _bindEvents() {
    
    this.header.click(e => {
      if( e.target.tagName == 'I' )
        this._event('confirm', 300);
      else
        this._toggle();
    });

    this.curtain.click(e => this._toggle());
  }

  addEventListener(event, callback) {
    this.events[event] = callback;
  }

  _event(eventString, curtainAnimationDuration) {
    let tasksCount = this.tasks.length;

    this.tasks = [];
    this.opened = false;
    this.body.height(0);
    this.curtain.fadeTo(50, 0);
    this.el.removeClass(this.openedClass);

    setTimeout(() => {
      this.curtain.hide();
    }, curtainAnimationDuration);

    this.el.animate({'bottom': '-100%'}, 300);

    let cb = this.events[eventString];
    if(cb) cb(tasksCount);
  }

  _undoOne(task) {
    this.tasks = this.tasks.filter(item => item.id != task.id);

    this.title.html(`${this.tasks.length} tasks were affected`);

    let cb = this.events['undo'];
    if(cb) cb(task);
  }

  _slideUpDown(title, duration=200) {
    let transitionString = `all ${duration / 1000}s`;

    const slideUp = () => {
      this.body.css({
        transition: transitionString,
        height: 60 + 'px',
      });
    };

    const slideDown = () => {
      setTimeout(() => {
        this.body.height(0);
      }, duration * 5);

      this.el.css({
        transition: transitionString,
        bottom: 0,
      });

    };

    const showPreview = () => {
      let template = `
      <div class="cm-preview-container">
        <div class="cm-task-preview">
          <div class="cm-preview-title">${title}</div>
          <div class="cm-undo-wrap">
            <div class="cm-undo-btn">
              <div class="fa fa-minus"></div>
            </div>
          </div>
        </div>
      </div>
      `;

      this.body.html(template);

      setTimeout(() => {
        $('.cm-task-preview').animate({
          marginLeft: 0
        }, duration / 2);
      }, duration / 2);
    }

    slideUp();
    showPreview();
    slideDown();

  }

  _toggle(duration=400) {
    let curtainAnimationDuration = parseFloat(
      this.curtain.css('transition-duration')
    ) * 1000;

    this.el.toggleClass(this.openedClass);

    const open = () => {
      this.opened = true;
      this.curtain.show();
      setTimeout(() => {
        this.curtain.fadeTo(100, .5)
      }, curtainAnimationDuration / 10);

      let tabs = new Tabs(this.body, {
        onundo: task => this._undoOne(task),
        onundoall: () => this._event('undoall', curtainAnimationDuration),
        confirm: () => this._event('confirm', curtainAnimationDuration),
      });

      for(let task of this.tasks) {
        switch(task.status) {
          case 'completed': tabs.pushCompleted(task); break;
          case 'updated': tabs.pushUpdated(task); break;
          case 'deleted': tabs.pushDeleted(task); break;
          default: tabs.pushCompleted(task);
        }
      }

      this.body.css({
        height: 400 + 'px',
        transitionDuration: duration / 1000 + 's',
      });
    }

    const close = () => {
      this.opened = false;
      this.body.height(0)
      this.curtain.fadeTo(50, 0);
      setTimeout(() => {
        this.curtain.hide();
      }, curtainAnimationDuration)
    }

    this.opened ? close() : open();
  }

  _replaceIfExists(task) {
    let exists, index;

    for(let [i, t] of this.tasks.entries())
      t.id == task.id ? (exists = true, index = i) : exists = false;

    exists ? (this.tasks[index] = task) : (this.tasks.push(task))
  }

  /*********************
  * PUBLIC
  *********************/
  update(task) {
    this._replaceIfExists(task);

    this.title.html(
      `${this.tasks.length} tasks were affected`
    );
    this._slideUpDown(task.text);
  };
}


export default ChangesManager;
