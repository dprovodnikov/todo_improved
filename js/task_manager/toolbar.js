class Toolbar {
  constructor(selector) {
    this.rootEl = $(selector);

    this._render();

    this.toolEls = $('.tb-tool');
  }

  _render() {
    let template = `
    <div class="toolbar">
      <div class="tb-tool tb-tool-hidden">
        <div class="fa fa-check"></div>
      </div>
      <div class="tb-tool tb-tool-hidden">
        <div class="fa fa-pencil"></div>
      </div>
      <div class="tb-tool tb-tool-hidden">
        <div class="fa fa-trash"></div>
      </div>
    </div>
    `;

    this.rootEl.append(template);
  };

  show() {
    let timeout = 0;

    for(let toolEl of this.toolEls) {
      toolEl = $(toolEl);

      setTimeout(function() {
        toolEl.removeClass('tb-tool-hidden');
      }, timeout)

      timeout += 100;
    }
  };
  
  hide() {};
}

export default Toolbar;