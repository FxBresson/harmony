(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _listUsers = require('./views/chat/listUsers.js');

var _listUsers2 = _interopRequireDefault(_listUsers);

var _listPrivates = require('./views/chat/listPrivates.js');

var _listPrivates2 = _interopRequireDefault(_listPrivates);

var _listMessages = require('./views/chat/listMessages.js');

var _listMessages2 = _interopRequireDefault(_listMessages);

var _listChannels = require('./views/chat/listChannels.js');

var _listChannels2 = _interopRequireDefault(_listChannels);

var _chatbox = require('./views/chat/chatbox.js');

var _chatbox2 = _interopRequireDefault(_chatbox);

var _loader = require('./views/chat/loader.js');

var _loader2 = _interopRequireDefault(_loader);

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _signin = require('./views/signin.js');

var _signin2 = _interopRequireDefault(_signin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
	function App() {
		_classCallCheck(this, App);

		this.socket = io(window.location.origin + ':3000');
	}

	_createClass(App, [{
		key: 'initChat',
		value: function initChat() {
			if (_jsCookie2.default.get('current_user') === undefined) {
				document.location.href = window.location.origin;
			}
			window.current_user = _jsCookie2.default.get('current_user');
			(0, _listUsers2.default)(this.socket);
			(0, _listMessages2.default)(this.socket);
			(0, _listPrivates2.default)(this.socket);
			(0, _listChannels2.default)(this.socket);
			(0, _chatbox2.default)(this.socket);
			(0, _loader2.default)(this.socket);
		}
	}, {
		key: 'initSignin',
		value: function initSignin() {
			(0, _signin2.default)(this.socket);
		}
	}]);

	return App;
}();

document.addEventListener("DOMContentLoaded", function (event) {
	var app = new App();
	var $body = document.getElementsByTagName('body')[0];
	if ($body.classList.contains('signin')) {
		if (_jsCookie2.default.get('current_user')) {
			document.location.href = window.location.origin + '/?action=chat';
		} else {
			app.initSignin();
		}
	} else if ($body.classList.contains('chat')) {
		app.initChat();
	}
});

},{"./views/chat/chatbox.js":2,"./views/chat/listChannels.js":3,"./views/chat/listMessages.js":4,"./views/chat/listPrivates.js":5,"./views/chat/listUsers.js":6,"./views/chat/loader.js":7,"./views/signin.js":8,"js-cookie":9}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var chatbox = function chatbox(socket) {
	var $chatbox = document.getElementById('section-input');
	if ($chatbox) {
		var $submit = document.getElementsByClassName('send')[0];
		var $input = document.getElementById('send-message');
		var vuechatbox = new Vue({
			delimiters: ['${', '}'],
			el: '#section-input',
			data: {
				message: '',
				currentChan: document.getElementById('selectedChannel').value
			},
			methods: {
				send: function send() {
					$input = document.getElementById('submit');
					// Check if the current message is empty or not
					if (this.message && this.message != '') {
						this.currentChan = document.getElementById('selectedChannel').value;
						// Creating a nex message
						// reinitialise the input and blur it
						var message = {
							content: this.message,
							id_user: 1,
							id_channel: this.currentChan
						};

						socket.emit('send_message', message);
						this.message = '';
					}
				}
			}
		});

		socket.on('success_send_message', function () {
			socket.emit('get_channel_messages', document.getElementById('selectedChannel').value);
		});
	}
};
exports.default = chatbox;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var listChannels = function listChannels(socket) {
	var $listChannels = document.getElementById('listChannels');
	if ($listChannels) {
		var error = null;
		var $selected = document.getElementById('selectedChannel');
		socket.emit('get_channels');
		socket.on('return_channels', function (data) {
			if (data === null) {
				data = [];
				error = 'Aucun channel trouvé...';
			}
			var vueListChannels = new Vue({
				delimiters: ['${', '}'],
				el: '#listChannels',
				data: {
					channels: data,
					error: error,
					selected: null
				},
				methods: {
					selectChan: function selectChan(id) {
						this.selected = id;
						$selected.value = id;
						socket.emit('get_channel_messages', id);
					}
				}
			});
		});
	}
};
exports.default = listChannels;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var listMessages = function listMessages(socket) {
	var $listMessages = document.getElementById('listMessages');
	if ($listMessages) {
		var error = null;
		var vueListMessages = new Vue({
			delimiters: ['${', '}'],
			el: '#listMessages',
			data: {
				messages: [],
				error: null
			}
		});
		socket.on('return_messages', function (data) {
			if (data === null) {
				data = [];
				error = 'Aucun message trouvé...';
			}
			vueListMessages.messages = data;
			vueListMessages.error = error;
		});
	}
};
exports.default = listMessages;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var listPrivates = function listPrivates(socket) {
	var $listPrivates = document.getElementById('listPrivates');
	if ($listPrivates) {
		var error = null;
		socket.emit('get_privates', window.current_user);
		socket.on('return_privates', function (data) {
			console.log(data);
			if (data === null) {
				data = [];
				error = 'Aucun channel privé';
			}
			Vue.component('modal', {
				template: '#modal-create',
				props: ['show', 'title'],
				data: function data() {
					return {
						internalShow: '',
						internalTitle: '',
						internalDesc: ''
					};
				},
				watch: {
					'internalShow': function internalShow() {
						if (!this.internalShow) {
							this.$emit('close', this.internalShow);
						}
					}
				},
				created: function created() {
					this.internalShow = this.show;
					this.internalTitle = this.title;
					this.internalDesc = this.description;
				}
			});

			var vueListPrivates = new Vue({
				delimiters: ['${', '}'],
				el: '#listPrivates',
				data: {
					privates: data,
					error: error,
					showModal: false,
					title: '',
					description: ''
				},
				methods: {
					closeModal: function closeModal() {
						this.showModal = false;
						this.$children[0].internalShow = false;
					},
					createNewChan: function createNewChan() {
						this.title = this.$children[0].internalTitle;
						this.description = this.$children[0].internalDesc;
						this.closeModal();
						var privateChan = {
							id_type: 2,
							position: null,
							name: this.title,
							description: this.description,
							id_user: 1
						};
						socket.emit('create_channel', privateChan);
					}
				}
			});
		});

		socket.on('success_create_channel', function () {
			socket.emit('return_privates', window.current_user);
		});
	}
};
exports.default = listPrivates;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var listUsers = function listUsers(socket) {
	var $listUsers = document.getElementById('listUsers');
	if ($listUsers) {
		var error = null;
		socket.emit('get_users');
		socket.on('return_users', function (data) {
			if (data === null) {
				data = [];
				error = 'Aucun user trouvé...';
			}
			var vueListUsers = new Vue({
				delimiters: ['${', '}'],
				el: '#listUsers',
				data: {
					users: data,
					error: error
				}
			});
		});
	}
};
exports.default = listUsers;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var loader = function loader(socket) {
	var currentChan = void 0;
	if (document.getElementById('selectedChannel')) {
		currentChan = document.getElementById('selectedChannel').value;
	}

	var $loader = document.getElementById('mainLoader');
	if ($loader) {
		var $submit = document.getElementsByClassName('send')[0];
		var $input = document.getElementById('send-message');
		var vueloader = new Vue({
			delimiters: ['${', '}'],
			el: '#mainLoader',
			data: {
				currentChan: currentChan
			},
			methods: {}
		});
	}
};
exports.default = loader;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var signin = function signin(socket) {

  var vueSignin = new Vue({
    delimiters: ['${', '}'],
    el: '#signin',
    data: {
      current: 'login',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorConfirmPassword: false,
      globalError: false,
      loading: false
    },
    methods: {
      toggle: function toggle(_toggle) {
        this.current = _toggle;
      },
      login: function login() {
        this.loading = true;
        var user = {
          username: this.name,
          password: this.password
        };
        socket.emit('connect_user', user);
      },
      newAccount: function newAccount() {
        this.loading = true;

        if (this.password != this.confirmPassword) {
          this.errorConfirmPassword = true;
          this.loading = false;
        } else {
          var user = {
            username: this.name,
            email: this.email,
            password: this.password
          };
          socket.emit('create_user', user);
        }
      }
    }
  });

  socket.on('success_connect', function (res) {
    vueSignin.loading = false;
    if (_jsCookie2.default.get('current_user') == undefined) {
      _jsCookie2.default.set('current_user', res.userId, { expires: 7, path: '/' });
    } else {
      _jsCookie2.default.remove('current_user');
      _jsCookie2.default.set('current_user', res.userId, { expires: 7, path: '/' });
    }

    document.location.href = res.url;
  });

  socket.on('error_connect', function (error) {
    vueSignin.globalError = error;
    vueSignin.loading = false;
  });
};
exports.default = signin;

},{"js-cookie":9}],9:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
})(function () {
	function extend() {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[i];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init(converter) {
		function api(key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return document.cookie = key + '=' + value + stringifiedAttributes;
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!this.json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ? converter.read(cookie, name) : converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2NoYXRib3guanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0Q2hhbm5lbHMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0VXNlcnMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9sb2FkZXIuanMiLCJkZXYvanMvdmlld3Mvc2lnbmluLmpzIiwibm9kZV9tb2R1bGVzL2pzLWNvb2tpZS9zcmMvanMuY29va2llLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0E7Ozs7Ozs7O0lBR00sRztBQUVMLGdCQUFjO0FBQUE7O0FBQ1YsT0FBSyxNQUFMLEdBQWMsR0FBRyxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsR0FBdUIsT0FBMUIsQ0FBZDtBQUNIOzs7OzZCQUVVO0FBQ1YsT0FBRyxtQkFBTyxHQUFQLENBQVcsY0FBWCxNQUErQixTQUFsQyxFQUE0QztBQUFDLGFBQVMsUUFBVCxDQUFrQixJQUFsQixHQUF5QixPQUFPLFFBQVAsQ0FBZ0IsTUFBekM7QUFBZ0Q7QUFDN0YsVUFBTyxZQUFQLEdBQXNCLG1CQUFPLEdBQVAsQ0FBVyxjQUFYLENBQXRCO0FBQ0EsNEJBQVMsS0FBSyxNQUFkO0FBQ0EsK0JBQWEsS0FBSyxNQUFsQjtBQUNBLCtCQUFhLEtBQUssTUFBbEI7QUFDQSwrQkFBYSxLQUFLLE1BQWxCO0FBQ0EsMEJBQVEsS0FBSyxNQUFiO0FBQ0EseUJBQU8sS0FBSyxNQUFaO0FBQ0E7OzsrQkFFWTtBQUNaLHlCQUFPLEtBQUssTUFBWjtBQUNBOzs7Ozs7QUFHRixTQUFTLGdCQUFU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akIsZUFBUyxNQUFUO0FBQ0E7QUFDQTs7QUFFRCxTQUFJLENBQUMsR0FBTCxFQUFVO0FBQ1QsYUFBTyxJQUFQLElBQWUsTUFBZjtBQUNBO0FBQ0QsS0FwQkQsQ0FvQkUsT0FBTyxDQUFQLEVBQVUsQ0FBRTtBQUNkOztBQUVELFVBQU8sTUFBUDtBQUNBOztBQUVELE1BQUksR0FBSixHQUFVLEdBQVY7QUFDQSxNQUFJLEdBQUosR0FBVSxVQUFVLEdBQVYsRUFBZTtBQUN4QixVQUFPLElBQUksSUFBSixDQUFTLEdBQVQsRUFBYyxHQUFkLENBQVA7QUFDQSxHQUZEO0FBR0EsTUFBSSxPQUFKLEdBQWMsWUFBWTtBQUN6QixVQUFPLElBQUksS0FBSixDQUFVO0FBQ2hCLFVBQU07QUFEVSxJQUFWLEVBRUosR0FBRyxLQUFILENBQVMsSUFBVCxDQUFjLFNBQWQsQ0FGSSxDQUFQO0FBR0EsR0FKRDtBQUtBLE1BQUksUUFBSixHQUFlLEVBQWY7O0FBRUEsTUFBSSxNQUFKLEdBQWEsVUFBVSxHQUFWLEVBQWUsVUFBZixFQUEyQjtBQUN2QyxPQUFJLEdBQUosRUFBUyxFQUFULEVBQWEsT0FBTyxVQUFQLEVBQW1CO0FBQy9CLGFBQVMsQ0FBQztBQURxQixJQUFuQixDQUFiO0FBR0EsR0FKRDs7QUFNQSxNQUFJLGFBQUosR0FBb0IsSUFBcEI7O0FBRUEsU0FBTyxHQUFQO0FBQ0E7O0FBRUQsUUFBTyxLQUFLLFlBQVksQ0FBRSxDQUFuQixDQUFQO0FBQ0EsQ0E3SkMsQ0FBRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgdXNlckxpc3QgXHRmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdFVzZXJzLmpzJ1xuaW1wb3J0IHByaXZhdGVzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdFByaXZhdGVzLmpzJ1xuaW1wb3J0IG1lc3NhZ2VzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdE1lc3NhZ2VzLmpzJ1xuaW1wb3J0IGNoYW5uZWxzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdENoYW5uZWxzLmpzJ1xuaW1wb3J0IGNoYXRib3ggXHRcdGZyb20gJy4vdmlld3MvY2hhdC9jaGF0Ym94LmpzJ1xuaW1wb3J0IGxvYWRlciBcdFx0ZnJvbSAnLi92aWV3cy9jaGF0L2xvYWRlci5qcydcbmltcG9ydCBDb29raWUgICAgICAgZnJvbSAnanMtY29va2llJ1xuXG5cbmltcG9ydCBzaWduaW4gICAgICAgZnJvbSAnLi92aWV3cy9zaWduaW4uanMnXG5cblxuY2xhc3MgQXBwIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0ICAgIHRoaXMuc29ja2V0ID0gaW8od2luZG93LmxvY2F0aW9uLm9yaWdpbisnOjMwMDAnKVxuXHR9XG5cblx0aW5pdENoYXQoKSB7XG5cdFx0aWYoQ29va2llLmdldCgnY3VycmVudF91c2VyJykgPT09IHVuZGVmaW5lZCl7ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW59XG5cdFx0d2luZG93LmN1cnJlbnRfdXNlciA9IENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpXG5cdFx0dXNlckxpc3QodGhpcy5zb2NrZXQpXG5cdFx0bWVzc2FnZXNMaXN0KHRoaXMuc29ja2V0KVxuXHRcdHByaXZhdGVzTGlzdCh0aGlzLnNvY2tldClcblx0XHRjaGFubmVsc0xpc3QodGhpcy5zb2NrZXQpXG5cdFx0Y2hhdGJveCh0aGlzLnNvY2tldClcblx0XHRsb2FkZXIodGhpcy5zb2NrZXQpXG5cdH1cblxuXHRpbml0U2lnbmluKCkge1xuXHRcdHNpZ25pbih0aGlzLnNvY2tldClcblx0fVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoZXZlbnQpICA9PntcbiAgXHRsZXQgYXBwID0gbmV3IEFwcFxuICBcdGxldCAkYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF1cbiAgXHRpZiAoICRib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2lnbmluJykgKSB7XG4gIFx0XHRpZiAoQ29va2llLmdldCgnY3VycmVudF91c2VyJykpIHtcbiAgXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4rJy8/YWN0aW9uPWNoYXQnXG4gIFx0XHR9IGVsc2UgIHtcbiAgXHRcdFx0YXBwLmluaXRTaWduaW4oKVxuICBcdFx0fVxuXG4gIFx0fSBlbHNlIGlmICgkYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoYXQnKSkge1xuICBcdFx0YXBwLmluaXRDaGF0KClcbiAgXHR9XG5cbn0pXG5cbiIsImxldCBjaGF0Ym94ID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGNoYXRib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VjdGlvbi1pbnB1dCcpXG5cdGlmKCRjaGF0Ym94KSB7XG5cdFx0bGV0ICRzdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZW5kJylbMF1cblx0XHRsZXQgJGlucHV0ICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZW5kLW1lc3NhZ2UnKVxuXHRcdGxldCB2dWVjaGF0Ym94ID0gbmV3IFZ1ZSh7XG5cdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0ICAgICAgICBlbDogJyNzZWN0aW9uLWlucHV0Jyxcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgXHRtZXNzYWdlOiAnJyxcblx0ICAgICAgICBcdGN1cnJlbnRDaGFuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJykudmFsdWVcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6e1xuXHQgICAgICAgIFx0c2VuZDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgXHRcdCRpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXQnKVxuXHRcdFx0ICAgIFx0Ly8gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgbWVzc2FnZSBpcyBlbXB0eSBvciBub3Rcblx0XHRcdCAgICBcdGlmICh0aGlzLm1lc3NhZ2UgJiYgdGhpcy5tZXNzYWdlICE9ICcnKSB7XG5cdFx0XHQgICAgXHRcdHRoaXMuY3VycmVudENoYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJykudmFsdWVcblx0XHRcdCAgICBcdFx0Ly8gQ3JlYXRpbmcgYSBuZXggbWVzc2FnZVxuXHRcdCAgICBcdFx0ICBcdC8vIHJlaW5pdGlhbGlzZSB0aGUgaW5wdXQgYW5kIGJsdXIgaXRcblx0XHQgICAgICAgIFx0XHRsZXQgbWVzc2FnZSA9IHtcblx0XHQgICAgICAgIFx0XHRcdGNvbnRlbnQ6IHRoaXMubWVzc2FnZSxcblx0XHQgICAgICAgIFx0XHRcdGlkX3VzZXI6IDEsXG5cdFx0ICAgICAgICBcdFx0XHRpZF9jaGFubmVsOiB0aGlzLmN1cnJlbnRDaGFuLFxuXHRcdCAgICAgICAgXHRcdH1cblxuXHRcdCAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdzZW5kX21lc3NhZ2UnLCBtZXNzYWdlKVxuXHRcdCAgICAgICAgXHRcdHRoaXMubWVzc2FnZSA9ICcnXG5cdFx0ICAgICAgICBcdH1cblx0ICAgICAgICBcdH1cblx0ICAgICAgICB9XG5cdCAgICB9KVxuXG5cdCAgICBzb2NrZXQub24oJ3N1Y2Nlc3Nfc2VuZF9tZXNzYWdlJywgKCkgPT4ge1xuXHQgICAgXHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxfbWVzc2FnZXMnLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJykudmFsdWUpXG5cdCAgICB9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBjaGF0Ym94IiwibGV0IGxpc3RDaGFubmVscyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0Q2hhbm5lbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdENoYW5uZWxzJylcblx0aWYoJGxpc3RDaGFubmVscykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRsZXQgJHNlbGVjdGVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpXG5cdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVscycpXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fY2hhbm5lbHMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gY2hhbm5lbCB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0bGV0IHZ1ZUxpc3RDaGFubmVscyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RDaGFubmVscycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdGNoYW5uZWxzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjogZXJyb3IsXG5cdFx0ICAgICAgICBcdHNlbGVjdGVkOiBudWxsXG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgbWV0aG9kczp7XG5cdFx0ICAgICAgICBcdHNlbGVjdENoYW46IGZ1bmN0aW9uKGlkKSB7XG5cdFx0ICAgICAgICBcdFx0dGhpcy5zZWxlY3RlZCA9IGlkXG5cdFx0ICAgICAgICBcdFx0JHNlbGVjdGVkLnZhbHVlID0gaWRcblx0XHQgICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxfbWVzc2FnZXMnLCBpZClcblx0XHQgICAgICAgIFx0fVxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KVxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RDaGFubmVscyIsImxldCBsaXN0TWVzc2FnZXMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdE1lc3NhZ2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RNZXNzYWdlcycpXG5cdGlmKCRsaXN0TWVzc2FnZXMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0bGV0IHZ1ZUxpc3RNZXNzYWdlcyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RNZXNzYWdlcycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdG1lc3NhZ2VzOiBbXSxcblx0XHQgICAgICAgIFx0ZXJyb3I6IG51bGxcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSlcblx0XHRzb2NrZXQub24oJ3JldHVybl9tZXNzYWdlcycsIChkYXRhKT0+IHtcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biBtZXNzYWdlIHRyb3V2w6kuLi4nXG5cdFx0XHR9XG5cdFx0XHR2dWVMaXN0TWVzc2FnZXMubWVzc2FnZXMgPSBkYXRhXG5cdFx0XHR2dWVMaXN0TWVzc2FnZXMuZXJyb3IgPSBlcnJvclxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RNZXNzYWdlcyIsImxldCBsaXN0UHJpdmF0ZXMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdFByaXZhdGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RQcml2YXRlcycpXG5cdGlmKCRsaXN0UHJpdmF0ZXMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0c29ja2V0LmVtaXQoJ2dldF9wcml2YXRlcycsIHdpbmRvdy5jdXJyZW50X3VzZXIpXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fcHJpdmF0ZXMnLCAoZGF0YSk9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhkYXRhKVxuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgcHJpdsOpJ1xuXHRcdFx0fVxuXHRcdFx0VnVlLmNvbXBvbmVudCgnbW9kYWwnLCB7XG5cdFx0XHQgIHRlbXBsYXRlOiAnI21vZGFsLWNyZWF0ZScsXG5cdFx0XHQgIHByb3BzOiBbJ3Nob3cnLCAndGl0bGUnXSxcblx0XHRcdCAgZGF0YTogZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgcmV0dXJuIHtcblx0XHRcdCAgICAgIGludGVybmFsU2hvdzogJycsXG5cdFx0XHQgICAgICBpbnRlcm5hbFRpdGxlOicnLFxuXHRcdFx0ICAgICAgaW50ZXJuYWxEZXNjOicnXG5cdFx0XHQgICAgfVxuXHRcdFx0ICB9LFxuXHRcdFx0ICB3YXRjaDoge1xuXHRcdFx0ICAgICdpbnRlcm5hbFNob3cnOiBmdW5jdGlvbigpIHtcblx0XHRcdCAgICAgIFx0aWYgKCF0aGlzLmludGVybmFsU2hvdykge3RoaXMuJGVtaXQoJ2Nsb3NlJywgdGhpcy5pbnRlcm5hbFNob3cpfVxuXHRcdFx0ICAgIH1cblx0XHRcdCAgfSxcblx0XHRcdCAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgdGhpcy5pbnRlcm5hbFNob3cgID0gdGhpcy5zaG93XG5cdFx0XHQgICAgdGhpcy5pbnRlcm5hbFRpdGxlID0gdGhpcy50aXRsZVxuXHRcdFx0ICAgIHRoaXMuaW50ZXJuYWxEZXNjICA9IHRoaXMuZGVzY3JpcHRpb25cblx0XHRcdCAgfVxuXHRcdFx0fSlcblxuXG5cdFx0XHRsZXQgdnVlTGlzdFByaXZhdGVzID0gbmV3IFZ1ZSh7XG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHRcdCAgICAgICAgZWw6ICcjbGlzdFByaXZhdGVzJyxcblx0XHQgICAgICAgIGRhdGE6IHtcblx0XHQgICAgICAgIFx0cHJpdmF0ZXM6IGRhdGEsXG5cdFx0ICAgICAgICBcdGVycm9yOiBlcnJvcixcblx0XHQgICAgICAgIFx0c2hvd01vZGFsOiBmYWxzZSxcblx0XHQgICAgICAgIFx0dGl0bGU6ICcnLFxuXHRcdCAgICAgICAgXHRkZXNjcmlwdGlvbjonJ1xuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIG1ldGhvZHM6IHtcblx0ICAgICAgICBcdFx0Y2xvc2VNb2RhbDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgXHRcdFx0dGhpcy5zaG93TW9kYWwgPSBmYWxzZVxuXHQgICAgICAgIFx0XHRcdHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsU2hvdyA9IGZhbHNlXG5cblx0ICAgICAgICBcdFx0fSxcblx0ICAgICAgICBcdFx0Y3JlYXRlTmV3Q2hhbjogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgXHRcdFx0dGhpcy50aXRsZSA9IHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsVGl0bGVcblx0ICAgICAgICBcdFx0XHR0aGlzLmRlc2NyaXB0aW9uID0gdGhpcy4kY2hpbGRyZW5bMF0uaW50ZXJuYWxEZXNjXG5cdCAgICAgICAgXHRcdFx0dGhpcy5jbG9zZU1vZGFsKClcblx0ICAgICAgICBcdFx0XHRsZXQgcHJpdmF0ZUNoYW4gPSB7XG5cdCAgICAgICAgXHRcdFx0XHRpZF90eXBlOiAyLFxuXHQgICAgICAgIFx0XHRcdFx0cG9zaXRpb246IG51bGwsXG5cdCAgICAgICAgXHRcdFx0XHRuYW1lOiB0aGlzLnRpdGxlLFxuXHQgICAgICAgIFx0XHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG5cdCAgICAgICAgXHRcdFx0XHRpZF91c2VyOiAxXG5cdCAgICAgICAgXHRcdFx0fVxuXHQgICAgICAgIFx0XHRcdHNvY2tldC5lbWl0KCdjcmVhdGVfY2hhbm5lbCcsIHByaXZhdGVDaGFuKVxuXG5cdCAgICAgICAgXHRcdH1cblx0ICAgICAgICBcdH1cblx0XHQgICAgfSlcblx0XHR9KVxuXG5cblx0XHRzb2NrZXQub24oJ3N1Y2Nlc3NfY3JlYXRlX2NoYW5uZWwnLCAoKT0+IHtcblx0XHRcdHNvY2tldC5lbWl0KCdyZXR1cm5fcHJpdmF0ZXMnLCB3aW5kb3cuY3VycmVudF91c2VyKVxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RQcml2YXRlcyIsImxldCBsaXN0VXNlcnMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdFVzZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RVc2VycycpXG5cdGlmKCRsaXN0VXNlcnMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0c29ja2V0LmVtaXQoJ2dldF91c2VycycpXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fdXNlcnMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gdXNlciB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0bGV0IHZ1ZUxpc3RVc2VycyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RVc2VycycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdHVzZXJzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjogZXJyb3Jcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSlcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0VXNlcnMiLCJsZXQgbG9hZGVyID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgY3VycmVudENoYW5cblx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpICkge2N1cnJlbnRDaGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlfVxuXG5cdGxldCAkbG9hZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5Mb2FkZXInKVxuXHRpZigkbG9hZGVyKSB7XG5cdFx0bGV0ICRzdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZW5kJylbMF1cblx0XHRsZXQgJGlucHV0ICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZW5kLW1lc3NhZ2UnKVxuXHRcdGxldCB2dWVsb2FkZXIgPSBuZXcgVnVlKHtcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHQgICAgICAgIGVsOiAnI21haW5Mb2FkZXInLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdGN1cnJlbnRDaGFuOiBjdXJyZW50Q2hhblxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgbWV0aG9kczp7XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbG9hZGVyIiwiaW1wb3J0IENvb2tpZSBmcm9tICdqcy1jb29raWUnXG5cbmxldCBzaWduaW4gPSAoc29ja2V0KSA9PiB7XG5cblx0bGV0IHZ1ZVNpZ25pbiA9IG5ldyBWdWUoe1xuXHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuICAgICAgICBlbDogJyNzaWduaW4nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgIFx0Y3VycmVudDonbG9naW4nLFxuICAgICAgICBcdG5hbWU6JycsXG4gICAgICAgIFx0ZW1haWw6JycsXG4gICAgICAgIFx0cGFzc3dvcmQ6JycsXG4gICAgICAgIFx0Y29uZmlybVBhc3N3b3JkOicnLFxuICAgICAgICBcdGVycm9yQ29uZmlybVBhc3N3b3JkOmZhbHNlLFxuICAgICAgICBcdGdsb2JhbEVycm9yOmZhbHNlLFxuICAgICAgICBcdGxvYWRpbmc6ZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczp7XG4gICAgICAgIFx0dG9nZ2xlOiBmdW5jdGlvbiAodG9nZ2xlKSB7XG4gICAgICAgIFx0XHR0aGlzLmN1cnJlbnQgPSB0b2dnbGVcbiAgICAgICAgXHR9LFxuICAgICAgICBcdGxvZ2luOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXHRcdHRoaXMubG9hZGluZyA9IHRydWVcbiAgICAgICAgXHRcdGxldCB1c2VyID0ge1xuICAgICAgICBcdFx0XHR1c2VybmFtZSA6IHRoaXMubmFtZSxcbiAgICAgICAgXHRcdFx0cGFzc3dvcmQgOiB0aGlzLnBhc3N3b3JkXG4gICAgICAgIFx0XHR9XG4gICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnY29ubmVjdF91c2VyJywgdXNlcilcblxuICAgICAgICBcdH0sXG4gICAgICAgIFx0bmV3QWNjb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIFx0XHR0aGlzLmxvYWRpbmcgPSB0cnVlXG5cbiAgICAgICAgXHRcdGlmICh0aGlzLnBhc3N3b3JkICE9IHRoaXMuY29uZmlybVBhc3N3b3JkKSB7XG4gICAgICAgIFx0XHRcdHRoaXMuZXJyb3JDb25maXJtUGFzc3dvcmQgPSB0cnVlXG4gICAgICAgIFx0XHRcdHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICAgIFx0XHR9IGVsc2Uge1xuICAgICAgICBcdFx0XHRsZXQgdXNlciA9IHtcbiAgICAgICAgXHRcdFx0XHR1c2VybmFtZSA6IHRoaXMubmFtZSxcbiAgICAgICAgXHRcdFx0XHRlbWFpbDogdGhpcy5lbWFpbCxcbiAgICAgICAgXHRcdFx0XHRwYXNzd29yZCA6IHRoaXMucGFzc3dvcmRcbiAgICAgICAgXHRcdFx0fVxuICAgICAgICBcdFx0XHRzb2NrZXQuZW1pdCgnY3JlYXRlX3VzZXInLCB1c2VyKVxuICAgICAgICBcdFx0fVxuICAgICAgICBcdH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBzb2NrZXQub24oJ3N1Y2Nlc3NfY29ubmVjdCcsIChyZXMpPT4ge1xuICAgIFx0dnVlU2lnbmluLmxvYWRpbmcgPSBmYWxzZVxuICAgIFx0aWYgKENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpID09IHVuZGVmaW5lZCkge1xuICAgIFx0XHRDb29raWUuc2V0KCdjdXJyZW50X3VzZXInLCByZXMudXNlcklkLCB7IGV4cGlyZXM6IDcsIHBhdGg6ICcvJyB9KVxuICAgIFx0fSBlbHNlIHtcbiAgICBcdFx0Q29va2llLnJlbW92ZSgnY3VycmVudF91c2VyJylcbiAgICBcdFx0Q29va2llLnNldCgnY3VycmVudF91c2VyJywgcmVzLnVzZXJJZCwgeyBleHBpcmVzOiA3LCBwYXRoOiAnLycgfSlcbiAgICBcdH1cblxuICAgIFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHJlcy51cmxcblxuICAgIH0pXG5cbiAgICBzb2NrZXQub24oJ2Vycm9yX2Nvbm5lY3QnLCAoZXJyb3IpPT4ge1xuICAgIFx0dnVlU2lnbmluLmdsb2JhbEVycm9yID0gZXJyb3JcbiAgICBcdHZ1ZVNpZ25pbi5sb2FkaW5nID0gZmFsc2VcbiAgICB9KVxufVxuZXhwb3J0IGRlZmF1bHQgc2lnbmluIiwiLyohXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4yLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llXG4gKlxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG5cdHZhciByZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSBmYWxzZTtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XG5cdFx0dmFyIE9sZENvb2tpZXMgPSB3aW5kb3cuQ29va2llcztcblx0XHR2YXIgYXBpID0gd2luZG93LkNvb2tpZXMgPSBmYWN0b3J5KCk7XG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR3aW5kb3cuQ29va2llcyA9IE9sZENvb2tpZXM7XG5cdFx0XHRyZXR1cm4gYXBpO1xuXHRcdH07XG5cdH1cbn0oZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gYXJndW1lbnRzWyBpIF07XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xuXHRcdGZ1bmN0aW9uIGFwaSAoa2V5LCB2YWx1ZSwgYXR0cmlidXRlcykge1xuXHRcdFx0dmFyIHJlc3VsdDtcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV3JpdGVcblxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGF0dHJpYnV0ZXMgPSBleHRlbmQoe1xuXHRcdFx0XHRcdHBhdGg6ICcvJ1xuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdHZhciBleHBpcmVzID0gbmV3IERhdGUoKTtcblx0XHRcdFx0XHRleHBpcmVzLnNldE1pbGxpc2Vjb25kcyhleHBpcmVzLmdldE1pbGxpc2Vjb25kcygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBleHBpcmVzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gV2UncmUgdXNpbmcgXCJleHBpcmVzXCIgYmVjYXVzZSBcIm1heC1hZ2VcIiBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFXG5cdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcyA/IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXN1bHQgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSByZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXG5cdFx0XHRcdGlmICghY29udmVydGVyLndyaXRlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHZhbHVlKSlcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlID0gY29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0a2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhrZXkpKTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9bXFwoXFwpXS9nLCBlc2NhcGUpO1xuXG5cdFx0XHRcdHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcblxuXHRcdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0XHRpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJz0nICsgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9IGtleSArICc9JyArIHZhbHVlICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVhZFxuXG5cdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRyZXN1bHQgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuXHRcdFx0Ly8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuIEFsc28gcHJldmVudHMgb2RkIHJlc3VsdCB3aGVuXG5cdFx0XHQvLyBjYWxsaW5nIFwiZ2V0KClcIlxuXHRcdFx0dmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcblx0XHRcdHZhciByZGVjb2RlID0gLyglWzAtOUEtWl17Mn0pKy9nO1xuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHRmb3IgKDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0XHR2YXIgY29va2llID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5qc29uICYmIGNvb2tpZS5jaGFyQXQoMCkgPT09ICdcIicpIHtcblx0XHRcdFx0XHRjb29raWUgPSBjb29raWUuc2xpY2UoMSwgLTEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgbmFtZSA9IHBhcnRzWzBdLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0XHRjb29raWUgPSBjb252ZXJ0ZXIucmVhZCA/XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZXIucmVhZChjb29raWUsIG5hbWUpIDogY29udmVydGVyKGNvb2tpZSwgbmFtZSkgfHxcblx0XHRcdFx0XHRcdGNvb2tpZS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5qc29uKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IGNvb2tpZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRbbmFtZV0gPSBjb29raWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGFwaS5zZXQgPSBhcGk7XG5cdFx0YXBpLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBhcGkuY2FsbChhcGksIGtleSk7XG5cdFx0fTtcblx0XHRhcGkuZ2V0SlNPTiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBhcGkuYXBwbHkoe1xuXHRcdFx0XHRqc29uOiB0cnVlXG5cdFx0XHR9LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXHRcdH07XG5cdFx0YXBpLmRlZmF1bHRzID0ge307XG5cblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xuXHRcdFx0YXBpKGtleSwgJycsIGV4dGVuZChhdHRyaWJ1dGVzLCB7XG5cdFx0XHRcdGV4cGlyZXM6IC0xXG5cdFx0XHR9KSk7XG5cdFx0fTtcblxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcblxuXHRcdHJldHVybiBhcGk7XG5cdH1cblxuXHRyZXR1cm4gaW5pdChmdW5jdGlvbiAoKSB7fSk7XG59KSk7XG4iXX0=
