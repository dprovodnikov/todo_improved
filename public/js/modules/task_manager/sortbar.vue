<template>

   <div class="tl-task-sortbar" v-click-outside>
    <div class="tl-sortbar-title">
      <i class="fa fa-th-list"></i>
      {{ active.hint }}
    </div>
    <div class="tl-sortbar-controls">

      <div class="tl-sortbar-select"
           @click="show = !show"
           :class="{'select-open': show, 'select-close': !show}">

        <div class="tl-sortbar-name">By {{ active.name }}</div>

        <i class="{{active.icon}} tl-sortbar-icon"></i>

        <div class="tl-sortbar-list">

          <li v-for="key in list | available" @click="pickKey(key)">
            <i :class="key.icon"></i>
            {{ key.name }}
          </li>

        </div>

      </div>

    </div>
  </div>
 
</template>

<script>
  import clickOutsideDirective from '../../directives/click-outside.js';

  export default {

    data: function() {
      return {
        list: [
          { icon: 'fa fa-calendar',         name: 'date',     hint: 'Tasks for today' },
          { icon: 'fa fa-flag',             name: 'priority', hint: 'High pripority first' },
          { icon: 'fa fa-sort-alpha-asc',   name: 'alphabet', hint: 'Tasks in alphabet order' },
          { icon: 'fa fa-sort-amount-desc', name: 'length',   hint: 'Longest tasks first' },
        ],
        active: {},
        show: false,
      };
    },

    filters: {
      available: function(array) {
        return array.filter(item => this.active != item);
      }
    },

    directives: {
      'click-outside': clickOutsideDirective,
    },

    methods: {
      pickKey: function(key) {
        this.active = key;
        this.$emit('key-changed', this.active);
      },

      bindEvents: function() {
        this.$on('collapse-me', () => {
          this.show = false;
        });
      },
    },

    created: function() {
      this.active = this.list[0];
      this.bindEvents();
    }

  }

</script>
