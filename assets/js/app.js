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
		console.log(current_user);
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
				privates: [],
				error: null,
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
						id_user: current_user
					};
					this.title = '';
					this.description = '';
					this.$children[0].internalTitle = '';
					this.$children[0].internalDesc = '';
					socket.emit('create_channel', privateChan);
				}
			}
		});
		socket.emit('get_privates', current_user);
		socket.on('return_privates', function (data) {
			if (data === null) {
				data = [];
				error = 'Aucun channel privé';
			}
			vueListPrivates.privates = data;
			vueListPrivates.error = error;
		});

		socket.on('success_create_channel', function () {
			socket.emit('get_privates', current_user);
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
		socket.emit('get_users', current_user);
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
            battletag: '',
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
                        password: this.password,
                        battletag: this.battletag
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2NoYXRib3guanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0Q2hhbm5lbHMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0VXNlcnMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9sb2FkZXIuanMiLCJkZXYvanMvdmlld3Mvc2lnbmluLmpzIiwibm9kZV9tb2R1bGVzL2pzLWNvb2tpZS9zcmMvanMuY29va2llLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0E7Ozs7Ozs7O0lBR00sRztBQUVMLGdCQUFjO0FBQUE7O0FBQ1YsT0FBSyxNQUFMLEdBQWMsR0FBRyxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsR0FBdUIsT0FBMUIsQ0FBZDtBQUNIOzs7OzZCQUVVO0FBQ1YsT0FBRyxtQkFBTyxHQUFQLENBQVcsY0FBWCxNQUErQixTQUFsQyxFQUE0QztBQUFDLGFBQVMsUUFBVCxDQUFrQixJQUFsQixHQUF5QixPQUFPLFFBQVAsQ0FBZ0IsTUFBekM7QUFBZ0Q7QUFDN0YsVUFBTyxZQUFQLEdBQXNCLG1CQUFPLEdBQVAsQ0FBVyxjQUFYLENBQXRCO0FBQ0EsNEJBQVMsS0FBSyxNQUFkO0FBQ0EsK0JBQWEsS0FBSyxNQUFsQjtBQUNBLCtCQUFhLEtBQUssTUFBbEI7QUFDQSwrQkFBYSxLQUFLLE1BQWxCO0FBQ0EsMEJBQVEsS0FBSyxNQUFiO0FBQ0EseUJBQU8sS0FBSyxNQUFaO0FBQ0E7OzsrQkFFWTtBQUNaLHlCQUFPLEtBQUssTUFBWjtBQUNBOzs7Ozs7QUFHRixTQUFTLGdCQUFU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QUFDQSxDQTdKQyxDQUFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB1c2VyTGlzdCBcdGZyb20gJy4vdmlld3MvY2hhdC9saXN0VXNlcnMuanMnXG5pbXBvcnQgcHJpdmF0ZXNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMnXG5pbXBvcnQgbWVzc2FnZXNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMnXG5pbXBvcnQgY2hhbm5lbHNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0Q2hhbm5lbHMuanMnXG5pbXBvcnQgY2hhdGJveCBcdFx0ZnJvbSAnLi92aWV3cy9jaGF0L2NoYXRib3guanMnXG5pbXBvcnQgbG9hZGVyIFx0XHRmcm9tICcuL3ZpZXdzL2NoYXQvbG9hZGVyLmpzJ1xuaW1wb3J0IENvb2tpZSAgICAgICBmcm9tICdqcy1jb29raWUnXG5cblxuaW1wb3J0IHNpZ25pbiAgICAgICBmcm9tICcuL3ZpZXdzL3NpZ25pbi5qcydcblxuXG5jbGFzcyBBcHAge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHQgICAgdGhpcy5zb2NrZXQgPSBpbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKyc6MzAwMCcpXG5cdH1cblxuXHRpbml0Q2hhdCgpIHtcblx0XHRpZihDb29raWUuZ2V0KCdjdXJyZW50X3VzZXInKSA9PT0gdW5kZWZpbmVkKXtkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbn1cblx0XHR3aW5kb3cuY3VycmVudF91c2VyID0gQ29va2llLmdldCgnY3VycmVudF91c2VyJylcblx0XHR1c2VyTGlzdCh0aGlzLnNvY2tldClcblx0XHRtZXNzYWdlc0xpc3QodGhpcy5zb2NrZXQpXG5cdFx0cHJpdmF0ZXNMaXN0KHRoaXMuc29ja2V0KVxuXHRcdGNoYW5uZWxzTGlzdCh0aGlzLnNvY2tldClcblx0XHRjaGF0Ym94KHRoaXMuc29ja2V0KVxuXHRcdGxvYWRlcih0aGlzLnNvY2tldClcblx0fVxuXG5cdGluaXRTaWduaW4oKSB7XG5cdFx0c2lnbmluKHRoaXMuc29ja2V0KVxuXHR9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIChldmVudCkgID0+e1xuICBcdGxldCBhcHAgPSBuZXcgQXBwXG4gIFx0bGV0ICRib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXVxuICBcdGlmICggJGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaWduaW4nKSApIHtcbiAgXHRcdGlmIChDb29raWUuZ2V0KCdjdXJyZW50X3VzZXInKSkge1xuICBcdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbisnLz9hY3Rpb249Y2hhdCdcbiAgXHRcdH0gZWxzZSAge1xuICBcdFx0XHRhcHAuaW5pdFNpZ25pbigpXG4gIFx0XHR9XG5cbiAgXHR9IGVsc2UgaWYgKCRib2R5LmNsYXNzTGlzdC5jb250YWlucygnY2hhdCcpKSB7XG4gIFx0XHRhcHAuaW5pdENoYXQoKVxuICBcdH1cblxufSlcblxuIiwibGV0IGNoYXRib3ggPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkY2hhdGJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWN0aW9uLWlucHV0Jylcblx0aWYoJGNoYXRib3gpIHtcblx0XHRsZXQgJHN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbmQnKVswXVxuXHRcdGxldCAkaW5wdXQgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbmQtbWVzc2FnZScpXG5cdFx0bGV0IHZ1ZWNoYXRib3ggPSBuZXcgVnVlKHtcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHQgICAgICAgIGVsOiAnI3NlY3Rpb24taW5wdXQnLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdG1lc3NhZ2U6ICcnLFxuXHQgICAgICAgIFx0Y3VycmVudENoYW46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKS52YWx1ZVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgbWV0aG9kczp7XG5cdCAgICAgICAgXHRzZW5kOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICBcdFx0JGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdCcpXG5cdFx0XHQgICAgXHQvLyBDaGVjayBpZiB0aGUgY3VycmVudCBtZXNzYWdlIGlzIGVtcHR5IG9yIG5vdFxuXHRcdFx0ICAgIFx0aWYgKHRoaXMubWVzc2FnZSAmJiB0aGlzLm1lc3NhZ2UgIT0gJycpIHtcblx0XHRcdCAgICBcdFx0dGhpcy5jdXJyZW50Q2hhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKS52YWx1ZVxuXHRcdFx0ICAgIFx0XHQvLyBDcmVhdGluZyBhIG5leCBtZXNzYWdlXG5cdFx0ICAgIFx0XHQgIFx0Ly8gcmVpbml0aWFsaXNlIHRoZSBpbnB1dCBhbmQgYmx1ciBpdFxuXHRcdCAgICAgICAgXHRcdGxldCBtZXNzYWdlID0ge1xuXHRcdCAgICAgICAgXHRcdFx0Y29udGVudDogdGhpcy5tZXNzYWdlLFxuXHRcdCAgICAgICAgXHRcdFx0aWRfdXNlcjogMSxcblx0XHQgICAgICAgIFx0XHRcdGlkX2NoYW5uZWw6IHRoaXMuY3VycmVudENoYW4sXG5cdFx0ICAgICAgICBcdFx0fVxuXG5cdFx0ICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ3NlbmRfbWVzc2FnZScsIG1lc3NhZ2UpXG5cdFx0ICAgICAgICBcdFx0dGhpcy5tZXNzYWdlID0gJydcblx0XHQgICAgICAgIFx0fVxuXHQgICAgICAgIFx0fVxuXHQgICAgICAgIH1cblx0ICAgIH0pXG5cblx0ICAgIHNvY2tldC5vbignc3VjY2Vzc19zZW5kX21lc3NhZ2UnLCAoKSA9PiB7XG5cdCAgICBcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbF9tZXNzYWdlcycsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKS52YWx1ZSlcblx0ICAgIH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGNoYXRib3giLCJsZXQgbGlzdENoYW5uZWxzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RDaGFubmVscyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0Q2hhbm5lbHMnKVxuXHRpZigkbGlzdENoYW5uZWxzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdGxldCAkc2VsZWN0ZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJylcblx0XHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxzJylcblx0XHRzb2NrZXQub24oJ3JldHVybl9jaGFubmVscycsIChkYXRhKT0+IHtcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biBjaGFubmVsIHRyb3V2w6kuLi4nXG5cdFx0XHR9XG5cdFx0XHRsZXQgdnVlTGlzdENoYW5uZWxzID0gbmV3IFZ1ZSh7XG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHRcdCAgICAgICAgZWw6ICcjbGlzdENoYW5uZWxzJyxcblx0XHQgICAgICAgIGRhdGE6IHtcblx0XHQgICAgICAgIFx0Y2hhbm5lbHM6IGRhdGEsXG5cdFx0ICAgICAgICBcdGVycm9yOiBlcnJvcixcblx0XHQgICAgICAgIFx0c2VsZWN0ZWQ6IG51bGxcblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICBtZXRob2RzOntcblx0XHQgICAgICAgIFx0c2VsZWN0Q2hhbjogZnVuY3Rpb24oaWQpIHtcblx0XHQgICAgICAgIFx0XHR0aGlzLnNlbGVjdGVkID0gaWRcblx0XHQgICAgICAgIFx0XHQkc2VsZWN0ZWQudmFsdWUgPSBpZFxuXHRcdCAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbF9tZXNzYWdlcycsIGlkKVxuXHRcdCAgICAgICAgXHR9XG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdENoYW5uZWxzIiwibGV0IGxpc3RNZXNzYWdlcyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0TWVzc2FnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdE1lc3NhZ2VzJylcblx0aWYoJGxpc3RNZXNzYWdlcykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRsZXQgdnVlTGlzdE1lc3NhZ2VzID0gbmV3IFZ1ZSh7XG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHRcdCAgICAgICAgZWw6ICcjbGlzdE1lc3NhZ2VzJyxcblx0XHQgICAgICAgIGRhdGE6IHtcblx0XHQgICAgICAgIFx0bWVzc2FnZXM6IFtdLFxuXHRcdCAgICAgICAgXHRlcnJvcjogbnVsbFxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KVxuXHRcdHNvY2tldC5vbigncmV0dXJuX21lc3NhZ2VzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIG1lc3NhZ2UgdHJvdXbDqS4uLidcblx0XHRcdH1cblx0XHRcdHZ1ZUxpc3RNZXNzYWdlcy5tZXNzYWdlcyA9IGRhdGFcblx0XHRcdHZ1ZUxpc3RNZXNzYWdlcy5lcnJvciA9IGVycm9yXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdE1lc3NhZ2VzIiwibGV0IGxpc3RQcml2YXRlcyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0UHJpdmF0ZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdFByaXZhdGVzJylcblx0aWYoJGxpc3RQcml2YXRlcykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRjb25zb2xlLmxvZyhjdXJyZW50X3VzZXIpXG5cdFx0VnVlLmNvbXBvbmVudCgnbW9kYWwnLCB7XG5cdFx0ICB0ZW1wbGF0ZTogJyNtb2RhbC1jcmVhdGUnLFxuXHRcdCAgcHJvcHM6IFsnc2hvdycsICd0aXRsZSddLFxuXHRcdCAgZGF0YTogZnVuY3Rpb24oKSB7XG5cdFx0ICAgIHJldHVybiB7XG5cdFx0ICAgICAgaW50ZXJuYWxTaG93OiAnJyxcblx0XHQgICAgICBpbnRlcm5hbFRpdGxlOicnLFxuXHRcdCAgICAgIGludGVybmFsRGVzYzonJ1xuXHRcdCAgICB9XG5cdFx0ICB9LFxuXHRcdCAgd2F0Y2g6IHtcblx0XHQgICAgJ2ludGVybmFsU2hvdyc6IGZ1bmN0aW9uKCkge1xuXHRcdCAgICAgIFx0aWYgKCF0aGlzLmludGVybmFsU2hvdykge3RoaXMuJGVtaXQoJ2Nsb3NlJywgdGhpcy5pbnRlcm5hbFNob3cpfVxuXHRcdCAgICB9XG5cdFx0ICB9LFxuXHRcdCAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0ICAgIHRoaXMuaW50ZXJuYWxTaG93ICA9IHRoaXMuc2hvd1xuXHRcdCAgICB0aGlzLmludGVybmFsVGl0bGUgPSB0aGlzLnRpdGxlXG5cdFx0ICAgIHRoaXMuaW50ZXJuYWxEZXNjICA9IHRoaXMuZGVzY3JpcHRpb25cblx0XHQgIH1cblx0XHR9KVxuXG5cblx0XHRsZXQgdnVlTGlzdFByaXZhdGVzID0gbmV3IFZ1ZSh7XG5cdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0ICAgICAgICBlbDogJyNsaXN0UHJpdmF0ZXMnLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdHByaXZhdGVzOiBbXSxcblx0ICAgICAgICBcdGVycm9yOiBudWxsLFxuXHQgICAgICAgIFx0c2hvd01vZGFsOiBmYWxzZSxcblx0ICAgICAgICBcdHRpdGxlOiAnJyxcblx0ICAgICAgICBcdGRlc2NyaXB0aW9uOicnXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgIFx0XHRjbG9zZU1vZGFsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXHRcdFx0dGhpcy5zaG93TW9kYWwgPSBmYWxzZVxuICAgICAgICBcdFx0XHR0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbFNob3cgPSBmYWxzZVxuXG4gICAgICAgIFx0XHR9LFxuICAgICAgICBcdFx0Y3JlYXRlTmV3Q2hhbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFx0XHRcdHRoaXMudGl0bGUgPSB0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbFRpdGxlXG4gICAgICAgIFx0XHRcdHRoaXMuZGVzY3JpcHRpb24gPSB0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbERlc2NcbiAgICAgICAgXHRcdFx0dGhpcy5jbG9zZU1vZGFsKClcbiAgICAgICAgXHRcdFx0bGV0IHByaXZhdGVDaGFuID0ge1xuICAgICAgICBcdFx0XHRcdGlkX3R5cGU6IDIsXG4gICAgICAgIFx0XHRcdFx0cG9zaXRpb246IG51bGwsXG4gICAgICAgIFx0XHRcdFx0bmFtZTogdGhpcy50aXRsZSxcbiAgICAgICAgXHRcdFx0XHRkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICAgXHRcdFx0XHRpZF91c2VyOiBjdXJyZW50X3VzZXJcbiAgICAgICAgXHRcdFx0fVxuICAgICAgICBcdFx0XHR0aGlzLnRpdGxlID0gJydcbiAgICAgICAgXHRcdFx0dGhpcy5kZXNjcmlwdGlvbiA9ICcnXG4gICAgICAgIFx0XHRcdHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsVGl0bGUgPSAnJ1xuICAgICAgICBcdFx0XHR0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbERlc2MgPSAnJ1xuICAgICAgICBcdFx0XHRzb2NrZXQuZW1pdCgnY3JlYXRlX2NoYW5uZWwnLCBwcml2YXRlQ2hhbilcblxuICAgICAgICBcdFx0fVxuICAgICAgICBcdH1cblx0ICAgIH0pXG5cdFx0c29ja2V0LmVtaXQoJ2dldF9wcml2YXRlcycsIGN1cnJlbnRfdXNlcilcblx0XHRzb2NrZXQub24oJ3JldHVybl9wcml2YXRlcycsIChkYXRhKT0+IHtcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biBjaGFubmVsIHByaXbDqSdcblx0XHRcdH1cblx0XHRcdHZ1ZUxpc3RQcml2YXRlcy5wcml2YXRlcyA9IGRhdGFcblx0XHRcdHZ1ZUxpc3RQcml2YXRlcy5lcnJvciA9IGVycm9yXG5cblx0XHR9KVxuXG5cblx0XHRzb2NrZXQub24oJ3N1Y2Nlc3NfY3JlYXRlX2NoYW5uZWwnLCAoKT0+IHtcblx0XHRcdHNvY2tldC5lbWl0KCdnZXRfcHJpdmF0ZXMnLCBjdXJyZW50X3VzZXIpXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdFByaXZhdGVzIiwibGV0IGxpc3RVc2VycyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0VXNlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdFVzZXJzJylcblx0aWYoJGxpc3RVc2Vycykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRzb2NrZXQuZW1pdCgnZ2V0X3VzZXJzJywgY3VycmVudF91c2VyKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX3VzZXJzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIHVzZXIgdHJvdXbDqS4uLidcblx0XHRcdH1cblx0XHRcdGxldCB2dWVMaXN0VXNlcnMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0VXNlcnMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHR1c2VyczogZGF0YSxcblx0XHQgICAgICAgIFx0ZXJyb3I6IGVycm9yXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdFVzZXJzIiwibGV0IGxvYWRlciA9IChzb2NrZXQpID0+IHtcblx0bGV0IGN1cnJlbnRDaGFuXG5cdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKSApIHtjdXJyZW50Q2hhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKS52YWx1ZX1cblxuXHRsZXQgJGxvYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluTG9hZGVyJylcblx0aWYoJGxvYWRlcikge1xuXHRcdGxldCAkc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VuZCcpWzBdXG5cdFx0bGV0ICRpbnB1dCAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VuZC1tZXNzYWdlJylcblx0XHRsZXQgdnVlbG9hZGVyID0gbmV3IFZ1ZSh7XG5cdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0ICAgICAgICBlbDogJyNtYWluTG9hZGVyJyxcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgXHRjdXJyZW50Q2hhbjogY3VycmVudENoYW5cblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6e1xuXHQgICAgICAgIH1cblx0ICAgIH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxvYWRlciIsImltcG9ydCBDb29raWUgZnJvbSAnanMtY29va2llJ1xuXG5sZXQgc2lnbmluID0gKHNvY2tldCkgPT4ge1xuXG5cdGxldCB2dWVTaWduaW4gPSBuZXcgVnVlKHtcblx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcbiAgICAgICAgZWw6ICcjc2lnbmluJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICBcdGN1cnJlbnQ6J2xvZ2luJyxcbiAgICAgICAgXHRuYW1lOicnLFxuICAgICAgICBcdGVtYWlsOicnLFxuICAgICAgICBcdHBhc3N3b3JkOicnLFxuICAgICAgICBcdGNvbmZpcm1QYXNzd29yZDonJyxcbiAgICAgICAgICAgIGJhdHRsZXRhZzogJycsXG4gICAgICAgIFx0ZXJyb3JDb25maXJtUGFzc3dvcmQ6ZmFsc2UsXG4gICAgICAgIFx0Z2xvYmFsRXJyb3I6ZmFsc2UsXG4gICAgICAgIFx0bG9hZGluZzpmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOntcbiAgICAgICAgXHR0b2dnbGU6IGZ1bmN0aW9uICh0b2dnbGUpIHtcbiAgICAgICAgXHRcdHRoaXMuY3VycmVudCA9IHRvZ2dsZVxuICAgICAgICBcdH0sXG4gICAgICAgIFx0bG9naW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdFx0dGhpcy5sb2FkaW5nID0gdHJ1ZVxuICAgICAgICBcdFx0bGV0IHVzZXIgPSB7XG4gICAgICAgIFx0XHRcdHVzZXJuYW1lIDogdGhpcy5uYW1lLFxuICAgICAgICBcdFx0XHRwYXNzd29yZCA6IHRoaXMucGFzc3dvcmRcbiAgICAgICAgXHRcdH1cbiAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdjb25uZWN0X3VzZXInLCB1c2VyKVxuXG4gICAgICAgIFx0fSxcbiAgICAgICAgXHRuZXdBY2NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgXHRcdHRoaXMubG9hZGluZyA9IHRydWVcblxuICAgICAgICBcdFx0aWYgKHRoaXMucGFzc3dvcmQgIT0gdGhpcy5jb25maXJtUGFzc3dvcmQpIHtcbiAgICAgICAgXHRcdFx0dGhpcy5lcnJvckNvbmZpcm1QYXNzd29yZCA9IHRydWVcbiAgICAgICAgXHRcdFx0dGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgXHRcdH0gZWxzZSB7XG4gICAgICAgIFx0XHRcdGxldCB1c2VyID0ge1xuICAgICAgICBcdFx0XHRcdHVzZXJuYW1lIDogdGhpcy5uYW1lLFxuICAgICAgICBcdFx0XHRcdGVtYWlsOiB0aGlzLmVtYWlsLFxuICAgICAgICBcdFx0XHRcdHBhc3N3b3JkIDogdGhpcy5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdHRsZXRhZzogdGhpcy5iYXR0bGV0YWdcbiAgICAgICAgXHRcdFx0fVxuICAgICAgICBcdFx0XHRzb2NrZXQuZW1pdCgnY3JlYXRlX3VzZXInLCB1c2VyKVxuICAgICAgICBcdFx0fVxuICAgICAgICBcdH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBzb2NrZXQub24oJ3N1Y2Nlc3NfY29ubmVjdCcsIChyZXMpPT4ge1xuICAgIFx0dnVlU2lnbmluLmxvYWRpbmcgPSBmYWxzZVxuICAgIFx0aWYgKENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpID09IHVuZGVmaW5lZCkge1xuICAgIFx0XHRDb29raWUuc2V0KCdjdXJyZW50X3VzZXInLCByZXMudXNlcklkLCB7IGV4cGlyZXM6IDcsIHBhdGg6ICcvJyB9KVxuICAgIFx0fSBlbHNlIHtcbiAgICBcdFx0Q29va2llLnJlbW92ZSgnY3VycmVudF91c2VyJylcbiAgICBcdFx0Q29va2llLnNldCgnY3VycmVudF91c2VyJywgcmVzLnVzZXJJZCwgeyBleHBpcmVzOiA3LCBwYXRoOiAnLycgfSlcbiAgICBcdH1cblxuICAgIFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHJlcy51cmxcblxuICAgIH0pXG5cbiAgICBzb2NrZXQub24oJ2Vycm9yX2Nvbm5lY3QnLCAoZXJyb3IpPT4ge1xuICAgIFx0dnVlU2lnbmluLmdsb2JhbEVycm9yID0gZXJyb3JcbiAgICBcdHZ1ZVNpZ25pbi5sb2FkaW5nID0gZmFsc2VcbiAgICB9KVxufVxuZXhwb3J0IGRlZmF1bHQgc2lnbmluIiwiLyohXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4yLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llXG4gKlxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG5cdHZhciByZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSBmYWxzZTtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XG5cdFx0dmFyIE9sZENvb2tpZXMgPSB3aW5kb3cuQ29va2llcztcblx0XHR2YXIgYXBpID0gd2luZG93LkNvb2tpZXMgPSBmYWN0b3J5KCk7XG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR3aW5kb3cuQ29va2llcyA9IE9sZENvb2tpZXM7XG5cdFx0XHRyZXR1cm4gYXBpO1xuXHRcdH07XG5cdH1cbn0oZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gYXJndW1lbnRzWyBpIF07XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xuXHRcdGZ1bmN0aW9uIGFwaSAoa2V5LCB2YWx1ZSwgYXR0cmlidXRlcykge1xuXHRcdFx0dmFyIHJlc3VsdDtcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV3JpdGVcblxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGF0dHJpYnV0ZXMgPSBleHRlbmQoe1xuXHRcdFx0XHRcdHBhdGg6ICcvJ1xuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdHZhciBleHBpcmVzID0gbmV3IERhdGUoKTtcblx0XHRcdFx0XHRleHBpcmVzLnNldE1pbGxpc2Vjb25kcyhleHBpcmVzLmdldE1pbGxpc2Vjb25kcygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBleHBpcmVzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gV2UncmUgdXNpbmcgXCJleHBpcmVzXCIgYmVjYXVzZSBcIm1heC1hZ2VcIiBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFXG5cdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcyA/IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXN1bHQgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSByZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXG5cdFx0XHRcdGlmICghY29udmVydGVyLndyaXRlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHZhbHVlKSlcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlID0gY29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0a2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhrZXkpKTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9bXFwoXFwpXS9nLCBlc2NhcGUpO1xuXG5cdFx0XHRcdHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcblxuXHRcdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0XHRpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJz0nICsgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9IGtleSArICc9JyArIHZhbHVlICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVhZFxuXG5cdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRyZXN1bHQgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuXHRcdFx0Ly8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuIEFsc28gcHJldmVudHMgb2RkIHJlc3VsdCB3aGVuXG5cdFx0XHQvLyBjYWxsaW5nIFwiZ2V0KClcIlxuXHRcdFx0dmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcblx0XHRcdHZhciByZGVjb2RlID0gLyglWzAtOUEtWl17Mn0pKy9nO1xuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHRmb3IgKDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0XHR2YXIgY29va2llID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5qc29uICYmIGNvb2tpZS5jaGFyQXQoMCkgPT09ICdcIicpIHtcblx0XHRcdFx0XHRjb29raWUgPSBjb29raWUuc2xpY2UoMSwgLTEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgbmFtZSA9IHBhcnRzWzBdLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0XHRjb29raWUgPSBjb252ZXJ0ZXIucmVhZCA/XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZXIucmVhZChjb29raWUsIG5hbWUpIDogY29udmVydGVyKGNvb2tpZSwgbmFtZSkgfHxcblx0XHRcdFx0XHRcdGNvb2tpZS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5qc29uKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IGNvb2tpZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRbbmFtZV0gPSBjb29raWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGFwaS5zZXQgPSBhcGk7XG5cdFx0YXBpLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBhcGkuY2FsbChhcGksIGtleSk7XG5cdFx0fTtcblx0XHRhcGkuZ2V0SlNPTiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBhcGkuYXBwbHkoe1xuXHRcdFx0XHRqc29uOiB0cnVlXG5cdFx0XHR9LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXHRcdH07XG5cdFx0YXBpLmRlZmF1bHRzID0ge307XG5cblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xuXHRcdFx0YXBpKGtleSwgJycsIGV4dGVuZChhdHRyaWJ1dGVzLCB7XG5cdFx0XHRcdGV4cGlyZXM6IC0xXG5cdFx0XHR9KSk7XG5cdFx0fTtcblxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcblxuXHRcdHJldHVybiBhcGk7XG5cdH1cblxuXHRyZXR1cm4gaW5pdChmdW5jdGlvbiAoKSB7fSk7XG59KSk7XG4iXX0=
