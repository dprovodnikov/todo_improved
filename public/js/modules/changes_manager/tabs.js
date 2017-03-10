class Tabs {
  constructor(targetEl, ops) {
    this.targetEl = targetEl;
    this.onundo = ops.onundo;
    this.onundoall = ops.onundoall;
    this.confirm = ops.confirm;

    this._render();

    this.class = {
      active: 'cm-tab-active',
      disabled: 'cm-tab-disabled'
    };

    this.tabs = [
      {
        id: 'completed',
        buttonEl: $('.tab-completed'),
        contentEl: $('.tab-completed-content') 
      },
      {
        id: 'deleted',
        buttonEl: $('.tab-deleted'),
        contentEl: $('.tab-deleted-content') 
      },
      {
        id: 'updated',
        buttonEl: $('.tab-updated'),
        contentEl: $('.tab-updated-content') 
      },
    ];

    this.tabUnderscore = $('.cm-tabs-underscore');
    this.contentsTape = $('.cm-tab-contents-wrap');
    this.tabButtons = $('.cm-tab');
    this.activeTab = {};
    this.tabsAvailable = [];

    this._bindEvents();
  }

  _bindEvents() {
    for (let tab of this.tabs) {
      tab.buttonEl.click(e => this._switchTab(tab));
    }
  }

  _render() {
    let template = `
      <div class="cm-body-top">
        <p>Manage the changes below</p>
        <div class="cm-top-btns">
          <button id="cm-confirm-all" class="cm-top-button">Confirm</button>
          <button id="cm-undo-all" class="cm-top-button">Undo all</button>
        </div>
      </div>
      <div class="cm-tabs-pane">
        <div class="cm-tabs-wrap">
          <div class="cm-tab cm-tab-disabled tab-completed">Completed</div>
          <div class="cm-tab cm-tab-disabled tab-deleted">Deleted</div>
          <div class="cm-tab cm-tab-disabled tab-updated">Updated</div>
        </div>
        <div class="cm-tabs-underscore-wrap">
          <div class="cm-tabs-underscore"></div>
        </div>
        <div class="cm-tab-contents-wrap">
          <div class="cm-tab-content tab-completed-content"></div>
          <div class="cm-tab-content tab-deleted-content"></div>
          <div class="cm-tab-content tab-updated-content"></div>
        </div>
      </div>
    `;

    this.targetEl.html(template);

    $('#cm-undo-all').click(e => this.onundoall());
    $('#cm-confirm-all').click(e => this.confirm());
  }

  _pushTask(task, tab) {
    tab.buttonEl.removeClass(this.class.disabled);
    this.tabsAvailable.push(tab);
    this._switchTab(tab, true);
    
    let template = 
    `<div class="cm-task-preview cm-preview-${task._id}">
      <div class="cm-preview-title">${task.text}</div>
      <div class="cm-undo-wrap">
        <div id="${task._id}" class="cm-undo-btn">
          <div class="fa fa-minus"></div>
        </div>
      </div>
    </div>`;
    tab.contentEl.append(template);

    if (tab.contentEl.outerHeight(true) > 300) {
      tab.contentEl.css({
        height: `300px`,
        overflowY: 'scroll',
      });
    }

    $(`.cm-undo-btn#${task._id}`).click(e => {
      this._undoOne(task);
    });
  }

  _undoOne(task) {
    const taskPreview = $(`.cm-preview-${task._id}`);
    const siblings = taskPreview.siblings();
    const removePreview = function() {
      taskPreview.css({
        width: taskPreview.width() + 'px',
        transform: 'translateX(-120%)',
        opacity: 0,
      });

      setTimeout(function() {
        taskPreview.animate({height: 0}, 100);
        setTimeout(() => taskPreview.remove(), 100);
      }, 150);
    };

    if (siblings.length == 0) {
      this.tabsAvailable = this.tabsAvailable.filter(tab => tab.id != this.activeTab.id );

      this.activeTab.buttonEl.addClass(this.class.disabled);

      if (this.tabsAvailable.length) {
        this._switchTab(this.tabsAvailable[0]);
      } else {
        this.onundo(task, true);
        return removePreview();
      }
    }

    removePreview();

    this.onundo(task);
  }

  pushUpdated(task) { this._pushTask(task, this.tabs[2]); }
  pushCompleted(task) { this._pushTask(task, this.tabs[0])}
  pushDeleted(task) { this._pushTask(task, this.tabs[1])}

  _switchTab(tab, delay=false) {
    if (tab.buttonEl.hasClass(this.class.disabled)) return false;

    this.tabButtons.removeClass(this.class.active);
    tab.buttonEl.addClass(this.class.active);

    this.activeTab = tab;

    /* Move underscore below the active tab */
    const slideDuration = parseFloat(
      this.contentsTape.css('transition-duration')
    ) * 1000;

    setTimeout(() => {
      const tabOffset = tab.buttonEl.position().left;
      const tabWidth = tab.buttonEl.outerWidth(true);
      this.tabUnderscore.css({
        width: tabWidth + 'px',
        left: tabOffset + 'px',
      });
    }, delay ? slideDuration : 0);

    /* Slide tab content panes */

    const contentOffset = tab.contentEl.position().left;
    this.contentsTape.css('left', `${-contentOffset}px`);
  }
}

export default Tabs;