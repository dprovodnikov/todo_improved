<template>
  
  <div class="chart-info-popup" 
       :class="{'chart-info-popup-visible': visible}"
       style="top: {{coords.y}}px; left: {{coords.x}}px">
    {{date}}

    <ul v-if="details" class="c-info-list">
      <li v-for="task in tasks"> 
        {{task.text}}
      </li>
    </ul>
  </div>

</template>

<script>
  import {format, weekday} from '../../utils/date-utils.js';
  
  export default {
    props: ['eventBus'],

    data: function() {
      return {
        coords: { x: 0, y: 0 },
        date: '',
        visible: false, 
        tasks: [],
        details: false,
      };
    },

    methods: {
      move: function(event) {
        let appOffset = $('.application-container').offset();
        let sidebarEl = $('nav.app-sidebar');
        let selfEl = $(this.$el);
        let containerWidth = $(this.$parent.$el).outerWidth(true);

        let [x, y] = [
          event.pageX - appOffset.left - sidebarEl.width() + 10,
          event.pageY - appOffset.top - 40
        ];

        let diff = 0;
        if(x + selfEl.outerWidth(true) > containerWidth)
          diff = x + selfEl.outerWidth(true) - containerWidth + 5

        this.coords = {x: x - diff, y: y};
      },

      update: function(data) {
        let date = new Date(data.date);
        this.date = 
          `${data.count == 0 ? 'No' : data.count}
          tasks on ${weekday(date)} ${format("dd, M yy", date)}`;
        this.tasks = data.tasks
        this.visible = true;
      },

      hide: function() {
        this.visible = false;
      },

      bindEvents: function() {
        $(this.$parent.$el).on('mousemove', this.move);

        this.eventBus.$on('chart-hovered', this.update);
        this.eventBus.$on('chart-unhovered', this.hide);
      },

      unbindEvents: function() {
        $(this.$parent.$el).off('mousemove', this.move);
      },
    },

    ready: function() {
      this.bindEvents();
    },

    beforeDestroy: function() {
      this.unbindEvents();
    },
  }
  
</script>
