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
			window.current_user = 1;
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
		app.initSignin();
	} else if ($body.classList.contains('chat')) {
		app.initChat();
	}
});

},{"./views/chat/chatbox.js":2,"./views/chat/listChannels.js":3,"./views/chat/listMessages.js":4,"./views/chat/listPrivates.js":5,"./views/chat/listUsers.js":6,"./views/chat/loader.js":7,"./views/signin.js":8}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2NoYXRib3guanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0Q2hhbm5lbHMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0VXNlcnMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9sb2FkZXIuanMiLCJkZXYvanMvdmlld3Mvc2lnbmluLmpzIiwibm9kZV9tb2R1bGVzL2pzLWNvb2tpZS9zcmMvanMuY29va2llLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7OztJQUdNLEc7QUFFTCxnQkFBYztBQUFBOztBQUNWLE9BQUssTUFBTCxHQUFjLEdBQUcsT0FBTyxRQUFQLENBQWdCLE1BQWhCLEdBQXVCLE9BQTFCLENBQWQ7QUFDSDs7Ozs2QkFFVTtBQUNWLFVBQU8sWUFBUCxHQUFzQixDQUF0QjtBQUNBLDRCQUFTLEtBQUssTUFBZDtBQUNBLCtCQUFhLEtBQUssTUFBbEI7QUFDQSwrQkFBYSxLQUFLLE1BQWxCO0FBQ0EsK0JBQWEsS0FBSyxNQUFsQjtBQUNBLDBCQUFRLEtBQUssTUFBYjtBQUNBLHlCQUFPLEtBQUssTUFBWjtBQUNBOzs7K0JBRVk7QUFDWix5QkFBTyxLQUFLLE1BQVo7QUFDQTs7Ozs7O0FBR0YsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsVUFBQyxLQUFELEVBQVc7QUFDdEQsS0FBSSxNQUFNLElBQUksR0FBSixFQUFWO0FBQ0EsS0FBSSxRQUFRLFNBQVMsb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsQ0FBWjtBQUNBLEtBQUssTUFBTSxTQUFO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QUFKLEdBQWMsWUFBWTtBQUN6QixVQUFPLElBQUksS0FBSixDQUFVO0FBQ2hCLFVBQU07QUFEVSxJQUFWLEVBRUosR0FBRyxLQUFILENBQVMsSUFBVCxDQUFjLFNBQWQsQ0FGSSxDQUFQO0FBR0EsR0FKRDtBQUtBLE1BQUksUUFBSixHQUFlLEVBQWY7O0FBRUEsTUFBSSxNQUFKLEdBQWEsVUFBVSxHQUFWLEVBQWUsVUFBZixFQUEyQjtBQUN2QyxPQUFJLEdBQUosRUFBUyxFQUFULEVBQWEsT0FBTyxVQUFQLEVBQW1CO0FBQy9CLGFBQVMsQ0FBQztBQURxQixJQUFuQixDQUFiO0FBR0EsR0FKRDs7QUFNQSxNQUFJLGFBQUosR0FBb0IsSUFBcEI7O0FBRUEsU0FBTyxHQUFQO0FBQ0E7O0FBRUQsUUFBTyxLQUFLLFlBQVksQ0FBRSxDQUFuQixDQUFQO0FBQ0EsQ0E3SkMsQ0FBRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgdXNlckxpc3QgXHRmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdFVzZXJzLmpzJ1xuaW1wb3J0IHByaXZhdGVzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdFByaXZhdGVzLmpzJ1xuaW1wb3J0IG1lc3NhZ2VzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdE1lc3NhZ2VzLmpzJ1xuaW1wb3J0IGNoYW5uZWxzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdENoYW5uZWxzLmpzJ1xuaW1wb3J0IGNoYXRib3ggXHRcdGZyb20gJy4vdmlld3MvY2hhdC9jaGF0Ym94LmpzJ1xuaW1wb3J0IGxvYWRlciBcdFx0ZnJvbSAnLi92aWV3cy9jaGF0L2xvYWRlci5qcydcblxuaW1wb3J0IHNpZ25pbiAgICAgICBmcm9tICcuL3ZpZXdzL3NpZ25pbi5qcydcblxuXG5jbGFzcyBBcHAge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHQgICAgdGhpcy5zb2NrZXQgPSBpbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKyc6MzAwMCcpXG5cdH1cblxuXHRpbml0Q2hhdCgpIHtcblx0XHR3aW5kb3cuY3VycmVudF91c2VyID0gMVxuXHRcdHVzZXJMaXN0KHRoaXMuc29ja2V0KVxuXHRcdG1lc3NhZ2VzTGlzdCh0aGlzLnNvY2tldClcblx0XHRwcml2YXRlc0xpc3QodGhpcy5zb2NrZXQpXG5cdFx0Y2hhbm5lbHNMaXN0KHRoaXMuc29ja2V0KVxuXHRcdGNoYXRib3godGhpcy5zb2NrZXQpXG5cdFx0bG9hZGVyKHRoaXMuc29ja2V0KVxuXHR9XG5cblx0aW5pdFNpZ25pbigpIHtcblx0XHRzaWduaW4odGhpcy5zb2NrZXQpXG5cdH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKGV2ZW50KSAgPT57XG4gIFx0bGV0IGFwcCA9IG5ldyBBcHBcbiAgXHRsZXQgJGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdXG4gIFx0aWYgKCAkYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3NpZ25pbicpICkge1xuICBcdFx0YXBwLmluaXRTaWduaW4oKVxuICBcdH0gZWxzZSBpZiAoJGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGF0JykpIHtcbiAgXHRcdGFwcC5pbml0Q2hhdCgpXG4gIFx0fVxuXG59KVxuXG4iLCJsZXQgY2hhdGJveCA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRjaGF0Ym94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlY3Rpb24taW5wdXQnKVxuXHRpZigkY2hhdGJveCkge1xuXHRcdGxldCAkc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VuZCcpWzBdXG5cdFx0bGV0ICRpbnB1dCAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VuZC1tZXNzYWdlJylcblx0XHRsZXQgdnVlY2hhdGJveCA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjc2VjdGlvbi1pbnB1dCcsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgIFx0bWVzc2FnZTogJycsXG5cdCAgICAgICAgXHRjdXJyZW50Q2hhbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBtZXRob2RzOntcblx0ICAgICAgICBcdHNlbmQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIFx0XHQkaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0Jylcblx0XHRcdCAgICBcdC8vIENoZWNrIGlmIHRoZSBjdXJyZW50IG1lc3NhZ2UgaXMgZW1wdHkgb3Igbm90XG5cdFx0XHQgICAgXHRpZiAodGhpcy5tZXNzYWdlICYmIHRoaXMubWVzc2FnZSAhPSAnJykge1xuXHRcdFx0ICAgIFx0XHR0aGlzLmN1cnJlbnRDaGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlXG5cdFx0XHQgICAgXHRcdC8vIENyZWF0aW5nIGEgbmV4IG1lc3NhZ2Vcblx0XHQgICAgXHRcdCAgXHQvLyByZWluaXRpYWxpc2UgdGhlIGlucHV0IGFuZCBibHVyIGl0XG5cdFx0ICAgICAgICBcdFx0bGV0IG1lc3NhZ2UgPSB7XG5cdFx0ICAgICAgICBcdFx0XHRjb250ZW50OiB0aGlzLm1lc3NhZ2UsXG5cdFx0ICAgICAgICBcdFx0XHRpZF91c2VyOiAxLFxuXHRcdCAgICAgICAgXHRcdFx0aWRfY2hhbm5lbDogdGhpcy5jdXJyZW50Q2hhbixcblx0XHQgICAgICAgIFx0XHR9XG5cblx0XHQgICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnc2VuZF9tZXNzYWdlJywgbWVzc2FnZSlcblx0XHQgICAgICAgIFx0XHR0aGlzLm1lc3NhZ2UgPSAnJ1xuXHRcdCAgICAgICAgXHR9XG5cdCAgICAgICAgXHR9XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblxuXHQgICAgc29ja2V0Lm9uKCdzdWNjZXNzX3NlbmRfbWVzc2FnZScsICgpID0+IHtcblx0ICAgIFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVsX21lc3NhZ2VzJywgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlKVxuXHQgICAgfSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgY2hhdGJveCIsImxldCBsaXN0Q2hhbm5lbHMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdENoYW5uZWxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RDaGFubmVscycpXG5cdGlmKCRsaXN0Q2hhbm5lbHMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0bGV0ICRzZWxlY3RlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKVxuXHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbHMnKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX2NoYW5uZWxzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgdHJvdXbDqS4uLidcblx0XHRcdH1cblx0XHRcdGxldCB2dWVMaXN0Q2hhbm5lbHMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0Q2hhbm5lbHMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHRjaGFubmVsczogZGF0YSxcblx0XHQgICAgICAgIFx0ZXJyb3I6IGVycm9yLFxuXHRcdCAgICAgICAgXHRzZWxlY3RlZDogbnVsbFxuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIG1ldGhvZHM6e1xuXHRcdCAgICAgICAgXHRzZWxlY3RDaGFuOiBmdW5jdGlvbihpZCkge1xuXHRcdCAgICAgICAgXHRcdHRoaXMuc2VsZWN0ZWQgPSBpZFxuXHRcdCAgICAgICAgXHRcdCRzZWxlY3RlZC52YWx1ZSA9IGlkXG5cdFx0ICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVsX21lc3NhZ2VzJywgaWQpXG5cdFx0ICAgICAgICBcdH1cblx0XHQgICAgICAgIH1cblx0XHQgICAgfSlcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0Q2hhbm5lbHMiLCJsZXQgbGlzdE1lc3NhZ2VzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RNZXNzYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0TWVzc2FnZXMnKVxuXHRpZigkbGlzdE1lc3NhZ2VzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdGxldCB2dWVMaXN0TWVzc2FnZXMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0TWVzc2FnZXMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHRtZXNzYWdlczogW10sXG5cdFx0ICAgICAgICBcdGVycm9yOiBudWxsXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fbWVzc2FnZXMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gbWVzc2FnZSB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLm1lc3NhZ2VzID0gZGF0YVxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLmVycm9yID0gZXJyb3Jcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0TWVzc2FnZXMiLCJsZXQgbGlzdFByaXZhdGVzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RQcml2YXRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0UHJpdmF0ZXMnKVxuXHRpZigkbGlzdFByaXZhdGVzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdHNvY2tldC5lbWl0KCdnZXRfcHJpdmF0ZXMnLCB3aW5kb3cuY3VycmVudF91c2VyKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX3ByaXZhdGVzJywgKGRhdGEpPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coZGF0YSlcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biBjaGFubmVsIHByaXbDqSdcblx0XHRcdH1cblx0XHRcdFZ1ZS5jb21wb25lbnQoJ21vZGFsJywge1xuXHRcdFx0ICB0ZW1wbGF0ZTogJyNtb2RhbC1jcmVhdGUnLFxuXHRcdFx0ICBwcm9wczogWydzaG93JywgJ3RpdGxlJ10sXG5cdFx0XHQgIGRhdGE6IGZ1bmN0aW9uKCkge1xuXHRcdFx0ICAgIHJldHVybiB7XG5cdFx0XHQgICAgICBpbnRlcm5hbFNob3c6ICcnLFxuXHRcdFx0ICAgICAgaW50ZXJuYWxUaXRsZTonJyxcblx0XHRcdCAgICAgIGludGVybmFsRGVzYzonJ1xuXHRcdFx0ICAgIH1cblx0XHRcdCAgfSxcblx0XHRcdCAgd2F0Y2g6IHtcblx0XHRcdCAgICAnaW50ZXJuYWxTaG93JzogZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgICBcdGlmICghdGhpcy5pbnRlcm5hbFNob3cpIHt0aGlzLiRlbWl0KCdjbG9zZScsIHRoaXMuaW50ZXJuYWxTaG93KX1cblx0XHRcdCAgICB9XG5cdFx0XHQgIH0sXG5cdFx0XHQgIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0ICAgIHRoaXMuaW50ZXJuYWxTaG93ICA9IHRoaXMuc2hvd1xuXHRcdFx0ICAgIHRoaXMuaW50ZXJuYWxUaXRsZSA9IHRoaXMudGl0bGVcblx0XHRcdCAgICB0aGlzLmludGVybmFsRGVzYyAgPSB0aGlzLmRlc2NyaXB0aW9uXG5cdFx0XHQgIH1cblx0XHRcdH0pXG5cblxuXHRcdFx0bGV0IHZ1ZUxpc3RQcml2YXRlcyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RQcml2YXRlcycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdHByaXZhdGVzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjogZXJyb3IsXG5cdFx0ICAgICAgICBcdHNob3dNb2RhbDogZmFsc2UsXG5cdFx0ICAgICAgICBcdHRpdGxlOiAnJyxcblx0XHQgICAgICAgIFx0ZGVzY3JpcHRpb246Jydcblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICBtZXRob2RzOiB7XG5cdCAgICAgICAgXHRcdGNsb3NlTW9kYWw6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIFx0XHRcdHRoaXMuc2hvd01vZGFsID0gZmFsc2Vcblx0ICAgICAgICBcdFx0XHR0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbFNob3cgPSBmYWxzZVxuXG5cdCAgICAgICAgXHRcdH0sXG5cdCAgICAgICAgXHRcdGNyZWF0ZU5ld0NoYW46IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIFx0XHRcdHRoaXMudGl0bGUgPSB0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbFRpdGxlXG5cdCAgICAgICAgXHRcdFx0dGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsRGVzY1xuXHQgICAgICAgIFx0XHRcdHRoaXMuY2xvc2VNb2RhbCgpXG5cdCAgICAgICAgXHRcdFx0bGV0IHByaXZhdGVDaGFuID0ge1xuXHQgICAgICAgIFx0XHRcdFx0aWRfdHlwZTogMixcblx0ICAgICAgICBcdFx0XHRcdHBvc2l0aW9uOiBudWxsLFxuXHQgICAgICAgIFx0XHRcdFx0bmFtZTogdGhpcy50aXRsZSxcblx0ICAgICAgICBcdFx0XHRcdGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuXHQgICAgICAgIFx0XHRcdFx0aWRfdXNlcjogMVxuXHQgICAgICAgIFx0XHRcdH1cblx0ICAgICAgICBcdFx0XHRzb2NrZXQuZW1pdCgnY3JlYXRlX2NoYW5uZWwnLCBwcml2YXRlQ2hhbilcblxuXHQgICAgICAgIFx0XHR9XG5cdCAgICAgICAgXHR9XG5cdFx0ICAgIH0pXG5cdFx0fSlcblxuXG5cdFx0c29ja2V0Lm9uKCdzdWNjZXNzX2NyZWF0ZV9jaGFubmVsJywgKCk9PiB7XG5cdFx0XHRzb2NrZXQuZW1pdCgncmV0dXJuX3ByaXZhdGVzJywgd2luZG93LmN1cnJlbnRfdXNlcilcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0UHJpdmF0ZXMiLCJsZXQgbGlzdFVzZXJzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RVc2VycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0VXNlcnMnKVxuXHRpZigkbGlzdFVzZXJzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdHNvY2tldC5lbWl0KCdnZXRfdXNlcnMnKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX3VzZXJzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIHVzZXIgdHJvdXbDqS4uLidcblx0XHRcdH1cblx0XHRcdGxldCB2dWVMaXN0VXNlcnMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0VXNlcnMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHR1c2VyczogZGF0YSxcblx0XHQgICAgICAgIFx0ZXJyb3I6IGVycm9yXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdFVzZXJzIiwibGV0IGxvYWRlciA9IChzb2NrZXQpID0+IHtcblx0bGV0IGN1cnJlbnRDaGFuXG5cdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKSApIHtjdXJyZW50Q2hhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKS52YWx1ZX1cblxuXHRsZXQgJGxvYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluTG9hZGVyJylcblx0aWYoJGxvYWRlcikge1xuXHRcdGxldCAkc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VuZCcpWzBdXG5cdFx0bGV0ICRpbnB1dCAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VuZC1tZXNzYWdlJylcblx0XHRsZXQgdnVlbG9hZGVyID0gbmV3IFZ1ZSh7XG5cdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0ICAgICAgICBlbDogJyNtYWluTG9hZGVyJyxcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgXHRjdXJyZW50Q2hhbjogY3VycmVudENoYW5cblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6e1xuXHQgICAgICAgIH1cblx0ICAgIH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxvYWRlciIsImltcG9ydCBDb29raWUgZnJvbSAnanMtY29va2llJ1xuXG5sZXQgc2lnbmluID0gKHNvY2tldCkgPT4ge1xuXG5cdGxldCB2dWVTaWduaW4gPSBuZXcgVnVlKHtcblx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcbiAgICAgICAgZWw6ICcjc2lnbmluJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICBcdGN1cnJlbnQ6J2xvZ2luJyxcbiAgICAgICAgXHRuYW1lOicnLFxuICAgICAgICBcdGVtYWlsOicnLFxuICAgICAgICBcdHBhc3N3b3JkOicnLFxuICAgICAgICBcdGNvbmZpcm1QYXNzd29yZDonJyxcbiAgICAgICAgXHRlcnJvckNvbmZpcm1QYXNzd29yZDpmYWxzZSxcbiAgICAgICAgXHRnbG9iYWxFcnJvcjpmYWxzZSxcbiAgICAgICAgXHRsb2FkaW5nOmZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6e1xuICAgICAgICBcdHRvZ2dsZTogZnVuY3Rpb24gKHRvZ2dsZSkge1xuICAgICAgICBcdFx0dGhpcy5jdXJyZW50ID0gdG9nZ2xlXG4gICAgICAgIFx0fSxcbiAgICAgICAgXHRsb2dpbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFx0XHR0aGlzLmxvYWRpbmcgPSB0cnVlXG4gICAgICAgIFx0XHRsZXQgdXNlciA9IHtcbiAgICAgICAgXHRcdFx0dXNlcm5hbWUgOiB0aGlzLm5hbWUsXG4gICAgICAgIFx0XHRcdHBhc3N3b3JkIDogdGhpcy5wYXNzd29yZFxuICAgICAgICBcdFx0fVxuICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ2Nvbm5lY3RfdXNlcicsIHVzZXIpXG5cbiAgICAgICAgXHR9LFxuICAgICAgICBcdG5ld0FjY291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdFx0dGhpcy5sb2FkaW5nID0gdHJ1ZVxuXG4gICAgICAgIFx0XHRpZiAodGhpcy5wYXNzd29yZCAhPSB0aGlzLmNvbmZpcm1QYXNzd29yZCkge1xuICAgICAgICBcdFx0XHR0aGlzLmVycm9yQ29uZmlybVBhc3N3b3JkID0gdHJ1ZVxuICAgICAgICBcdFx0XHR0aGlzLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgICBcdFx0fSBlbHNlIHtcbiAgICAgICAgXHRcdFx0bGV0IHVzZXIgPSB7XG4gICAgICAgIFx0XHRcdFx0dXNlcm5hbWUgOiB0aGlzLm5hbWUsXG4gICAgICAgIFx0XHRcdFx0ZW1haWw6IHRoaXMuZW1haWwsXG4gICAgICAgIFx0XHRcdFx0cGFzc3dvcmQgOiB0aGlzLnBhc3N3b3JkXG4gICAgICAgIFx0XHRcdH1cbiAgICAgICAgXHRcdFx0c29ja2V0LmVtaXQoJ2NyZWF0ZV91c2VyJywgdXNlcilcbiAgICAgICAgXHRcdH1cbiAgICAgICAgXHR9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgc29ja2V0Lm9uKCdzdWNjZXNzX2Nvbm5lY3QnLCAocmVzKT0+IHtcbiAgICBcdHZ1ZVNpZ25pbi5sb2FkaW5nID0gZmFsc2VcbiAgICBcdGlmIChDb29raWUuZ2V0KCdjdXJyZW50X3VzZXInKSA9PSB1bmRlZmluZWQpIHtcbiAgICBcdFx0Q29va2llLnNldCgnY3VycmVudF91c2VyJywgcmVzLnVzZXJJZCwgeyBleHBpcmVzOiA3LCBwYXRoOiAnLycgfSlcbiAgICBcdH0gZWxzZSB7XG4gICAgXHRcdENvb2tpZS5yZW1vdmUoJ2N1cnJlbnRfdXNlcicpXG4gICAgXHRcdENvb2tpZS5zZXQoJ2N1cnJlbnRfdXNlcicsIHJlcy51c2VySWQsIHsgZXhwaXJlczogNywgcGF0aDogJy8nIH0pXG4gICAgXHR9XG5cbiAgICBcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSByZXMudXJsXG5cbiAgICB9KVxuXG4gICAgc29ja2V0Lm9uKCdlcnJvcl9jb25uZWN0JywgKGVycm9yKT0+IHtcbiAgICBcdHZ1ZVNpZ25pbi5nbG9iYWxFcnJvciA9IGVycm9yXG4gICAgXHR2dWVTaWduaW4ubG9hZGluZyA9IGZhbHNlXG4gICAgfSlcbn1cbmV4cG9ydCBkZWZhdWx0IHNpZ25pbiIsIi8qIVxuICogSmF2YVNjcmlwdCBDb29raWUgdjIuMi4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vanMtY29va2llL2pzLWNvb2tpZVxuICpcbiAqIENvcHlyaWdodCAyMDA2LCAyMDE1IEtsYXVzIEhhcnRsICYgRmFnbmVyIEJyYWNrXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuOyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuXHR2YXIgcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gZmFsc2U7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoZmFjdG9yeSk7XG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcblx0fVxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcblx0fVxuXHRpZiAoIXJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlcikge1xuXHRcdHZhciBPbGRDb29raWVzID0gd2luZG93LkNvb2tpZXM7XG5cdFx0dmFyIGFwaSA9IHdpbmRvdy5Db29raWVzID0gZmFjdG9yeSgpO1xuXHRcdGFwaS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0d2luZG93LkNvb2tpZXMgPSBPbGRDb29raWVzO1xuXHRcdFx0cmV0dXJuIGFwaTtcblx0XHR9O1xuXHR9XG59KGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gZXh0ZW5kICgpIHtcblx0XHR2YXIgaSA9IDA7XG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdGZvciAoOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IGFyZ3VtZW50c1sgaSBdO1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0cmVzdWx0W2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0IChjb252ZXJ0ZXIpIHtcblx0XHRmdW5jdGlvbiBhcGkgKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcblx0XHRcdHZhciByZXN1bHQ7XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdyaXRlXG5cblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRhdHRyaWJ1dGVzID0gZXh0ZW5kKHtcblx0XHRcdFx0XHRwYXRoOiAnLydcblx0XHRcdFx0fSwgYXBpLmRlZmF1bHRzLCBhdHRyaWJ1dGVzKTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHR2YXIgZXhwaXJlcyA9IG5ldyBEYXRlKCk7XG5cdFx0XHRcdFx0ZXhwaXJlcy5zZXRNaWxsaXNlY29uZHMoZXhwaXJlcy5nZXRNaWxsaXNlY29uZHMoKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGUrNSk7XG5cdFx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gZXhwaXJlcztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFdlJ3JlIHVzaW5nIFwiZXhwaXJlc1wiIGJlY2F1c2UgXCJtYXgtYWdlXCIgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxuXHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBhdHRyaWJ1dGVzLmV4cGlyZXMgPyBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKSA6ICcnO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuXHRcdFx0XHRcdGlmICgvXltcXHtcXFtdLy50ZXN0KHJlc3VsdCkpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0gcmVzdWx0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblxuXHRcdFx0XHRpZiAoIWNvbnZlcnRlci53cml0ZSkge1xuXHRcdFx0XHRcdHZhbHVlID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyh2YWx1ZSkpXG5cdFx0XHRcdFx0XHQucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnwzQXwzQ3wzRXwzRHwyRnwzRnw0MHw1Qnw1RHw1RXw2MHw3Qnw3RHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGNvbnZlcnRlci53cml0ZSh2YWx1ZSwga2V5KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGtleSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcoa2V5KSk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDVFfDYwfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvW1xcKFxcKV0vZywgZXNjYXBlKTtcblxuXHRcdFx0XHR2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG5cblx0XHRcdFx0Zm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIChkb2N1bWVudC5jb29raWUgPSBrZXkgKyAnPScgKyB2YWx1ZSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlYWRcblxuXHRcdFx0aWYgKCFrZXkpIHtcblx0XHRcdFx0cmVzdWx0ID0ge307XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLiBBbHNvIHByZXZlbnRzIG9kZCByZXN1bHQgd2hlblxuXHRcdFx0Ly8gY2FsbGluZyBcImdldCgpXCJcblx0XHRcdHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG5cdFx0XHR2YXIgcmRlY29kZSA9IC8oJVswLTlBLVpdezJ9KSsvZztcblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0Zm9yICg7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcblx0XHRcdFx0dmFyIGNvb2tpZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuXHRcdFx0XHRpZiAoIXRoaXMuanNvbiAmJiBjb29raWUuY2hhckF0KDApID09PSAnXCInKSB7XG5cdFx0XHRcdFx0Y29va2llID0gY29va2llLnNsaWNlKDEsIC0xKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIG5hbWUgPSBwYXJ0c1swXS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdFx0Y29va2llID0gY29udmVydGVyLnJlYWQgP1xuXHRcdFx0XHRcdFx0Y29udmVydGVyLnJlYWQoY29va2llLCBuYW1lKSA6IGNvbnZlcnRlcihjb29raWUsIG5hbWUpIHx8XG5cdFx0XHRcdFx0XHRjb29raWUucmVwbGFjZShyZGVjb2RlLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuanNvbikge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0Y29va2llID0gSlNPTi5wYXJzZShjb29raWUpO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoa2V5ID09PSBuYW1lKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBjb29raWU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0W25hbWVdID0gY29va2llO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cblx0XHRhcGkuc2V0ID0gYXBpO1xuXHRcdGFwaS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoYXBpLCBrZXkpO1xuXHRcdH07XG5cdFx0YXBpLmdldEpTT04gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gYXBpLmFwcGx5KHtcblx0XHRcdFx0anNvbjogdHJ1ZVxuXHRcdFx0fSwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblx0XHR9O1xuXHRcdGFwaS5kZWZhdWx0cyA9IHt9O1xuXG5cdFx0YXBpLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXksIGF0dHJpYnV0ZXMpIHtcblx0XHRcdGFwaShrZXksICcnLCBleHRlbmQoYXR0cmlidXRlcywge1xuXHRcdFx0XHRleHBpcmVzOiAtMVxuXHRcdFx0fSkpO1xuXHRcdH07XG5cblx0XHRhcGkud2l0aENvbnZlcnRlciA9IGluaXQ7XG5cblx0XHRyZXR1cm4gYXBpO1xuXHR9XG5cblx0cmV0dXJuIGluaXQoZnVuY3Rpb24gKCkge30pO1xufSkpO1xuIl19
