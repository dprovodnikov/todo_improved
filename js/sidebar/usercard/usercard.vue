<template>

  <div class="usercard-wrap">
    <div class="usercard-avatar">
      <div class="avatar-wrap">
        <img :src="user.avatar" class="avatar"/>
        <div class="avatar-settings">
          <i class="fa fa-cog">
            <div class="avatar-settings-hint">Edit photo</div>
          </i>
        </div>
      </div>
      <div class="usercard-username-wrap">
        <div class="username">{{ user.username }}</div>
        <div class="usercard-email">
          <p>{{ user.email }}</p>
        </div>
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
        <span>{{ user.tasks.completed }}</span>
      </div>
      <div class="summary">
        <span>Overdue:</span>
        <span>{{ user.tasks.overdue }}</span>
      </div>
    </div>

    <div class="social-wrap">
      <i class="fa fa-facebook"></i>
      <i class="fa fa-github"></i>
      <i class="fa fa-linkedin"></i>
      <i class="fa fa-google-plus"></i>
    </div>
    
  </div>`;  
  
</template>

<script>

  export default {
    data: function() {
      return {
        user: {
          username: 'John Doe',
          email: 'email@gmail.com',
          avatar: 'img/avatar.jpg',
          tasks: {
            completed: 126,
            overdue: 14
          }
        },
      };
    },
  };

</script>