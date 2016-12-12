export default function(selector) {
  
  const template = `
    <div class="usercard-wrap">

      <div class="usercard-avatar">
        <img src="img/avatar.jpg"class="avatar"/>
        <div class="username">john doe</div>
        <div class="usercard-email">
          <p>email@gmail.com</p>
        </div>
      </div>

      <div class="usercard-progress-view">
        <div class="progress-view-title">Today's progress</div>
        <div class="usercard-progressbar">
          <div style="width: 80%" class="progressbar-fill"></div>
        </div>
        <div class="progress-view-title">Total progress</div>
        <div class="usercard-progressbar">
          <div style="width: 40%" class="progressbar-fill"></div>
        </div>
      </div>
      
      <div class="usercard-summary-view">
        <div class="summary">
          <span>Completed:</span>
          <span>126</span>
        </div>
        <div class="summary">
          <span>Overdue:</span>
          <span>14</span>
        </div>
      </div>

      <div class="social-wrap">
        <i class="fa fa-facebook"></i>
        <i class="fa fa-github"></i>
        <i class="fa fa-linkedin"></i>
        <i class="fa fa-google-plus"></i>
      </div>
      
    </div>`;

    $(selector).html(template);

    let el = $('.usercard-wrap');

    return el;
};