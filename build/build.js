(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _sidepanel = require('./sidepanel');

var _sidepanel2 = _interopRequireDefault(_sidepanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _sidepanel2.default();

},{"./sidepanel":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var navItems = $('.main-nav li'),
      activeNavItemClass = 'sidebar-item-active',
      panel = $('.side-panel');
  panel.opened = false;

  this.openPanel = function (e) {
    navItems.removeClass(activeNavItemClass);
    $(e.target).addClass(activeNavItemClass);
    panel.css('width', '400px');

    var calendar = new window.Calendar({
      yearFirst: 2012,
      yearLast: 2018,
      yearPrimary: 2016
    });
  };

  this._initEvents = function () {
    navItems.click(this.openPanel);
  };

  this._initEvents();
};

},{}]},{},[1]);
