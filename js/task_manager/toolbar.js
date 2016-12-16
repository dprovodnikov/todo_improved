class Toolbar {
  constructor(selector) {
    this.rootEl = $(selector);

    this._render();

    this.toolEls = $('.tb-tool');

    this._bindEvents();
  }

  _render() {
    let template = `
    <div class="toolbar">
      <div class="tb-tool tb-tool-complete tb-tool-hidden">
        <div class="fa fa-check"></div>
      </div>
      <div class="tb-tool tb-tool-update tb-tool-hidden">
        <div class="fa fa-pencil"></div>
      </div>
      <div class="tb-tool tb-tool-delete tb-tool-hidden">
        <div class="fa fa-trash"></div>
      </div>
    </div>
    `;

    this.rootEl.append(template);
  };

  _bindEvents() {
    this.toolEls.filter('.tb-tool-complete').click(e => {
      this.oncomplete();
    });
    this.toolEls.filter('.tb-tool-update').click(e => {
      this.onupdate();
    });
    this.toolEls.filter('.tb-tool-delete').click(e => {
      this.ondelete();
    });
  }

  show(args) {
    let timeout = 0;

    for(let toolEl of this.toolEls) {
      toolEl = $(toolEl);
      setTimeout(function() {
        toolEl.removeClass('tb-tool-hidden');
      }, timeout)
      timeout += 100;
    }

    this.oncomplete = args.oncomplete;
    this.ondelete = args.ondelete;
    this.onupdate = args.onupdate;
  };
  
  hide() {};
}

export default Toolbar;