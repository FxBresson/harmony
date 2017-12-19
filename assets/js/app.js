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

var _profile = require('./views/chat/profile.js');

var _profile2 = _interopRequireDefault(_profile);

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
			(0, _profile2.default)(this.socket);
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

},{"./views/chat/chatbox.js":2,"./views/chat/listChannels.js":3,"./views/chat/listMessages.js":4,"./views/chat/listPrivates.js":5,"./views/chat/listUsers.js":6,"./views/chat/loader.js":7,"./views/chat/profile.js":8,"./views/signin.js":9,"js-cookie":10}],2:[function(require,module,exports){
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
//section-profile

var profile = function profile(socket) {
	var $profile = document.getElementById('section-profile');
	if ($profile) {
		var vueprofile = new Vue({
			delimiters: ['${', '}'],
			el: '#section-profile',
			data: {
				user: {}

			},
			methods: {}
		});
		socket.emit('get_current_user', current_user);

		socket.on('success_get_current_user', function (user) {
			console.log('pp', user);
			vueprofile.user = user;
		});
	}
};
exports.default = profile;

},{}],9:[function(require,module,exports){
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

},{"js-cookie":10}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXZcXGpzXFxtYWluLmpzIiwiZGV2XFxqc1xcdmlld3NcXGNoYXRcXGNoYXRib3guanMiLCJkZXZcXGpzXFx2aWV3c1xcY2hhdFxcbGlzdENoYW5uZWxzLmpzIiwiZGV2XFxqc1xcdmlld3NcXGNoYXRcXGxpc3RNZXNzYWdlcy5qcyIsImRldlxcanNcXHZpZXdzXFxjaGF0XFxsaXN0UHJpdmF0ZXMuanMiLCJkZXZcXGpzXFx2aWV3c1xcY2hhdFxcbGlzdFVzZXJzLmpzIiwiZGV2XFxqc1xcdmlld3NcXGNoYXRcXGxvYWRlci5qcyIsImRldlxcanNcXHZpZXdzXFxjaGF0XFxwcm9maWxlLmpzIiwiZGV2XFxqc1xcdmlld3NcXHNpZ25pbi5qcyIsIm5vZGVfbW9kdWxlc1xcanMtY29va2llXFxzcmNcXGpzLmNvb2tpZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUlBOzs7O0FBR0E7Ozs7Ozs7O0lBR00sRztBQUVMLGdCQUFjO0FBQUE7O0FBQ1YsT0FBSyxNQUFMLEdBQWMsR0FBRyxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsR0FBdUIsT0FBMUIsQ0FBZDtBQUNIOzs7OzZCQUVVO0FBQ1YsT0FBRyxtQkFBTyxHQUFQLENBQVcsY0FBWCxNQUErQixTQUFsQyxFQUE0QztBQUFDLGFBQVMsUUFBVCxDQUFrQixJQUFsQixHQUF5QixPQUFPLFFBQVAsQ0FBZ0IsTUFBekM7QUFBZ0Q7QUFDN0YsVUFBTyxZQUFQLEdBQXNCLG1CQUFPLEdBQVAsQ0FBVyxjQUFYLENBQXRCO0FBQ0EsNEJBQVMsS0FBSyxNQUFkO0FBQ0EsK0JBQWEsS0FBSyxNQUFsQjtBQUNBLCtCQUFhLEtBQUssTUFBbEI7QUFDQSwrQkFBYSxLQUFLLE1BQWxCO0FBQ0EsMEJBQVEsS0FBSyxNQUFiO0FBQ0Es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b0JFLE9BQU8sQ0FBUCxFQUFVLENBQUU7QUFDZDs7QUFFRCxVQUFPLE1BQVA7QUFDQTs7QUFFRCxNQUFJLEdBQUosR0FBVSxHQUFWO0FBQ0EsTUFBSSxHQUFKLEdBQVUsVUFBVSxHQUFWLEVBQWU7QUFDeEIsVUFBTyxJQUFJLElBQUosQ0FBUyxHQUFULEVBQWMsR0FBZCxDQUFQO0FBQ0EsR0FGRDtBQUdBLE1BQUksT0FBSixHQUFjLFlBQVk7QUFDekIsVUFBTyxJQUFJLEtBQUosQ0FBVTtBQUNoQixVQUFNO0FBRFUsSUFBVixFQUVKLEdBQUcsS0FBSCxDQUFTLElBQVQsQ0FBYyxTQUFkLENBRkksQ0FBUDtBQUdBLEdBSkQ7QUFLQSxNQUFJLFFBQUosR0FBZSxFQUFmOztBQUVBLE1BQUksTUFBSixHQUFhLFVBQVUsR0FBVixFQUFlLFVBQWYsRUFBMkI7QUFDdkMsT0FBSSxHQUFKLEVBQVMsRUFBVCxFQUFhLE9BQU8sVUFBUCxFQUFtQjtBQUMvQixhQUFTLENBQUM7QUFEcUIsSUFBbkIsQ0FBYjtBQUdBLEdBSkQ7O0FBTUEsTUFBSSxhQUFKLEdBQW9CLElBQXBCOztBQUVBLFNBQU8sR0FBUDtBQUNBOztBQUVELFFBQU8sS0FBSyxZQUFZLENBQUUsQ0FBbkIsQ0FBUDtBQUNBLENBN0pDLENBQUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHVzZXJMaXN0IFx0ZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RVc2Vycy5qcydcclxuaW1wb3J0IHByaXZhdGVzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdFByaXZhdGVzLmpzJ1xyXG5pbXBvcnQgbWVzc2FnZXNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMnXHJcbmltcG9ydCBjaGFubmVsc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RDaGFubmVscy5qcydcclxuaW1wb3J0IGNoYXRib3ggXHRcdGZyb20gJy4vdmlld3MvY2hhdC9jaGF0Ym94LmpzJ1xyXG5pbXBvcnQgbG9hZGVyIFx0XHRmcm9tICcuL3ZpZXdzL2NoYXQvbG9hZGVyLmpzJ1xyXG5pbXBvcnQgcHJvZmlsIFx0XHRmcm9tICcuL3ZpZXdzL2NoYXQvcHJvZmlsZS5qcydcclxuXHJcblxyXG5cclxuaW1wb3J0IENvb2tpZSAgICAgICBmcm9tICdqcy1jb29raWUnXHJcblxyXG5cclxuaW1wb3J0IHNpZ25pbiAgICAgICBmcm9tICcuL3ZpZXdzL3NpZ25pbi5qcydcclxuXHJcblxyXG5jbGFzcyBBcHAge1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHQgICAgdGhpcy5zb2NrZXQgPSBpbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKyc6MzAwMCcpXHJcblx0fVxyXG5cclxuXHRpbml0Q2hhdCgpIHtcclxuXHRcdGlmKENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpID09PSB1bmRlZmluZWQpe2RvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2lufVxyXG5cdFx0d2luZG93LmN1cnJlbnRfdXNlciA9IENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpXHJcblx0XHR1c2VyTGlzdCh0aGlzLnNvY2tldClcclxuXHRcdG1lc3NhZ2VzTGlzdCh0aGlzLnNvY2tldClcclxuXHRcdHByaXZhdGVzTGlzdCh0aGlzLnNvY2tldClcclxuXHRcdGNoYW5uZWxzTGlzdCh0aGlzLnNvY2tldClcclxuXHRcdGNoYXRib3godGhpcy5zb2NrZXQpXHJcblx0XHRsb2FkZXIodGhpcy5zb2NrZXQpXHJcblx0XHRwcm9maWwodGhpcy5zb2NrZXQpXHJcblx0fVxyXG5cclxuXHRpbml0U2lnbmluKCkge1xyXG5cdFx0c2lnbmluKHRoaXMuc29ja2V0KVxyXG5cdH1cclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKGV2ZW50KSAgPT57XHJcbiAgXHRsZXQgYXBwID0gbmV3IEFwcFxyXG4gIFx0bGV0ICRib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXVxyXG4gIFx0aWYgKCAkYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3NpZ25pbicpICkge1xyXG4gIFx0XHRpZiAoQ29va2llLmdldCgnY3VycmVudF91c2VyJykpIHtcclxuICBcdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbisnLz9hY3Rpb249Y2hhdCdcclxuICBcdFx0fSBlbHNlICB7XHJcbiAgXHRcdFx0YXBwLmluaXRTaWduaW4oKVxyXG4gIFx0XHR9XHJcblxyXG4gIFx0fSBlbHNlIGlmICgkYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoYXQnKSkge1xyXG4gIFx0XHRhcHAuaW5pdENoYXQoKVxyXG4gIFx0fVxyXG5cclxufSlcclxuXHJcbiIsImxldCBjaGF0Ym94ID0gKHNvY2tldCkgPT4ge1xyXG5cdGxldCAkY2hhdGJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWN0aW9uLWlucHV0JylcclxuXHRpZigkY2hhdGJveCkge1xyXG5cdFx0bGV0ICRzdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZW5kJylbMF1cclxuXHRcdGxldCAkaW5wdXQgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbmQtbWVzc2FnZScpXHJcblx0XHRsZXQgdnVlY2hhdGJveCA9IG5ldyBWdWUoe1xyXG5cdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcclxuXHQgICAgICAgIGVsOiAnI3NlY3Rpb24taW5wdXQnLFxyXG5cdCAgICAgICAgZGF0YToge1xyXG5cdCAgICAgICAgXHRtZXNzYWdlOiAnJyxcclxuXHQgICAgICAgIFx0Y3VycmVudENoYW46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKS52YWx1ZVxyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIG1ldGhvZHM6e1xyXG5cdCAgICAgICAgXHRzZW5kOiBmdW5jdGlvbigpIHtcclxuXHQgICAgICAgIFx0XHQkaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0JylcclxuXHRcdFx0ICAgIFx0Ly8gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgbWVzc2FnZSBpcyBlbXB0eSBvciBub3RcclxuXHRcdFx0ICAgIFx0aWYgKHRoaXMubWVzc2FnZSAmJiB0aGlzLm1lc3NhZ2UgIT0gJycpIHtcclxuXHRcdFx0ICAgIFx0XHR0aGlzLmN1cnJlbnRDaGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlXHJcblx0XHRcdCAgICBcdFx0Ly8gQ3JlYXRpbmcgYSBuZXggbWVzc2FnZVxyXG5cdFx0ICAgIFx0XHQgIFx0Ly8gcmVpbml0aWFsaXNlIHRoZSBpbnB1dCBhbmQgYmx1ciBpdFxyXG5cdFx0ICAgICAgICBcdFx0bGV0IG1lc3NhZ2UgPSB7XHJcblx0XHQgICAgICAgIFx0XHRcdGNvbnRlbnQ6IHRoaXMubWVzc2FnZSxcclxuXHRcdCAgICAgICAgXHRcdFx0aWRfdXNlcjogMSxcclxuXHRcdCAgICAgICAgXHRcdFx0aWRfY2hhbm5lbDogdGhpcy5jdXJyZW50Q2hhbixcclxuXHRcdCAgICAgICAgXHRcdH1cclxuXHJcblx0XHQgICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnc2VuZF9tZXNzYWdlJywgbWVzc2FnZSlcclxuXHRcdCAgICAgICAgXHRcdHRoaXMubWVzc2FnZSA9ICcnXHJcblx0XHQgICAgICAgIFx0fVxyXG5cdCAgICAgICAgXHR9XHJcblx0ICAgICAgICB9XHJcblx0ICAgIH0pXHJcblxyXG5cdCAgICBzb2NrZXQub24oJ3N1Y2Nlc3Nfc2VuZF9tZXNzYWdlJywgKCkgPT4ge1xyXG5cdCAgICBcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbF9tZXNzYWdlcycsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKS52YWx1ZSlcclxuXHQgICAgfSlcclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY2hhdGJveCIsImxldCBsaXN0Q2hhbm5lbHMgPSAoc29ja2V0KSA9PiB7XHJcblx0bGV0ICRsaXN0Q2hhbm5lbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdENoYW5uZWxzJylcclxuXHRpZigkbGlzdENoYW5uZWxzKSB7XHJcblx0XHRsZXQgZXJyb3IgPSBudWxsXHJcblx0XHRsZXQgJHNlbGVjdGVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpXHJcblx0XHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxzJylcclxuXHRcdHNvY2tldC5vbigncmV0dXJuX2NoYW5uZWxzJywgKGRhdGEpPT4ge1xyXG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XHJcblx0XHRcdFx0ZGF0YSAgPSBbXVxyXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgdHJvdXbDqS4uLidcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdnVlTGlzdENoYW5uZWxzID0gbmV3IFZ1ZSh7XHJcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXHJcblx0XHQgICAgICAgIGVsOiAnI2xpc3RDaGFubmVscycsXHJcblx0XHQgICAgICAgIGRhdGE6IHtcclxuXHRcdCAgICAgICAgXHRjaGFubmVsczogZGF0YSxcclxuXHRcdCAgICAgICAgXHRlcnJvcjogZXJyb3IsXHJcblx0XHQgICAgICAgIFx0c2VsZWN0ZWQ6IG51bGxcclxuXHRcdCAgICAgICAgfSxcclxuXHRcdCAgICAgICAgbWV0aG9kczp7XHJcblx0XHQgICAgICAgIFx0c2VsZWN0Q2hhbjogZnVuY3Rpb24oaWQpIHtcclxuXHRcdCAgICAgICAgXHRcdHRoaXMuc2VsZWN0ZWQgPSBpZFxyXG5cdFx0ICAgICAgICBcdFx0JHNlbGVjdGVkLnZhbHVlID0gaWRcclxuXHRcdCAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbF9tZXNzYWdlcycsIGlkKVxyXG5cdFx0ICAgICAgICBcdH1cclxuXHRcdCAgICAgICAgfVxyXG5cdFx0ICAgIH0pXHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2hhbm5lbHMiLCJsZXQgbGlzdE1lc3NhZ2VzID0gKHNvY2tldCkgPT4ge1xyXG5cdGxldCAkbGlzdE1lc3NhZ2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RNZXNzYWdlcycpXHJcblx0aWYoJGxpc3RNZXNzYWdlcykge1xyXG5cdFx0bGV0IGVycm9yID0gbnVsbFxyXG5cdFx0bGV0IHZ1ZUxpc3RNZXNzYWdlcyA9IG5ldyBWdWUoe1xyXG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxyXG5cdFx0ICAgICAgICBlbDogJyNsaXN0TWVzc2FnZXMnLFxyXG5cdFx0ICAgICAgICBkYXRhOiB7XHJcblx0XHQgICAgICAgIFx0bWVzc2FnZXM6IFtdLFxyXG5cdFx0ICAgICAgICBcdGVycm9yOiBudWxsXHJcblx0XHQgICAgICAgIH1cclxuXHRcdCAgICB9KVxyXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fbWVzc2FnZXMnLCAoZGF0YSk9PiB7XHJcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcclxuXHRcdFx0XHRkYXRhICA9IFtdXHJcblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gbWVzc2FnZSB0cm91dsOpLi4uJ1xyXG5cdFx0XHR9XHJcblx0XHRcdHZ1ZUxpc3RNZXNzYWdlcy5tZXNzYWdlcyA9IGRhdGFcclxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLmVycm9yID0gZXJyb3JcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGxpc3RNZXNzYWdlcyIsImxldCBsaXN0UHJpdmF0ZXMgPSAoc29ja2V0KSA9PiB7XHJcblx0bGV0ICRsaXN0UHJpdmF0ZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdFByaXZhdGVzJylcclxuXHRpZigkbGlzdFByaXZhdGVzKSB7XHJcblx0XHRsZXQgZXJyb3IgPSBudWxsXHJcblx0XHRjb25zb2xlLmxvZyhjdXJyZW50X3VzZXIpXHJcblx0XHRWdWUuY29tcG9uZW50KCdtb2RhbCcsIHtcclxuXHRcdCAgdGVtcGxhdGU6ICcjbW9kYWwtY3JlYXRlJyxcclxuXHRcdCAgcHJvcHM6IFsnc2hvdycsICd0aXRsZSddLFxyXG5cdFx0ICBkYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdCAgICByZXR1cm4ge1xyXG5cdFx0ICAgICAgaW50ZXJuYWxTaG93OiAnJyxcclxuXHRcdCAgICAgIGludGVybmFsVGl0bGU6JycsXHJcblx0XHQgICAgICBpbnRlcm5hbERlc2M6JydcclxuXHRcdCAgICB9XHJcblx0XHQgIH0sXHJcblx0XHQgIHdhdGNoOiB7XHJcblx0XHQgICAgJ2ludGVybmFsU2hvdyc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0ICAgICAgXHRpZiAoIXRoaXMuaW50ZXJuYWxTaG93KSB7dGhpcy4kZW1pdCgnY2xvc2UnLCB0aGlzLmludGVybmFsU2hvdyl9XHJcblx0XHQgICAgfVxyXG5cdFx0ICB9LFxyXG5cdFx0ICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuXHRcdCAgICB0aGlzLmludGVybmFsU2hvdyAgPSB0aGlzLnNob3dcclxuXHRcdCAgICB0aGlzLmludGVybmFsVGl0bGUgPSB0aGlzLnRpdGxlXHJcblx0XHQgICAgdGhpcy5pbnRlcm5hbERlc2MgID0gdGhpcy5kZXNjcmlwdGlvblxyXG5cdFx0ICB9XHJcblx0XHR9KVxyXG5cclxuXHJcblx0XHRsZXQgdnVlTGlzdFByaXZhdGVzID0gbmV3IFZ1ZSh7XHJcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxyXG5cdCAgICAgICAgZWw6ICcjbGlzdFByaXZhdGVzJyxcclxuXHQgICAgICAgIGRhdGE6IHtcclxuXHQgICAgICAgIFx0cHJpdmF0ZXM6IFtdLFxyXG5cdCAgICAgICAgXHRlcnJvcjogbnVsbCxcclxuXHQgICAgICAgIFx0c2hvd01vZGFsOiBmYWxzZSxcclxuXHQgICAgICAgIFx0dGl0bGU6ICcnLFxyXG5cdCAgICAgICAgXHRkZXNjcmlwdGlvbjonJ1xyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIG1ldGhvZHM6IHtcclxuICAgICAgICBcdFx0Y2xvc2VNb2RhbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXHRcdFx0dGhpcy5zaG93TW9kYWwgPSBmYWxzZVxyXG4gICAgICAgIFx0XHRcdHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsU2hvdyA9IGZhbHNlXHJcblxyXG4gICAgICAgIFx0XHR9LFxyXG4gICAgICAgIFx0XHRjcmVhdGVOZXdDaGFuOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBcdFx0XHR0aGlzLnRpdGxlID0gdGhpcy4kY2hpbGRyZW5bMF0uaW50ZXJuYWxUaXRsZVxyXG4gICAgICAgIFx0XHRcdHRoaXMuZGVzY3JpcHRpb24gPSB0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbERlc2NcclxuICAgICAgICBcdFx0XHR0aGlzLmNsb3NlTW9kYWwoKVxyXG4gICAgICAgIFx0XHRcdGxldCBwcml2YXRlQ2hhbiA9IHtcclxuICAgICAgICBcdFx0XHRcdGlkX3R5cGU6IDIsXHJcbiAgICAgICAgXHRcdFx0XHRwb3NpdGlvbjogbnVsbCxcclxuICAgICAgICBcdFx0XHRcdG5hbWU6IHRoaXMudGl0bGUsXHJcbiAgICAgICAgXHRcdFx0XHRkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcclxuICAgICAgICBcdFx0XHRcdGlkX3VzZXI6IGN1cnJlbnRfdXNlclxyXG4gICAgICAgIFx0XHRcdH1cclxuICAgICAgICBcdFx0XHR0aGlzLnRpdGxlID0gJydcclxuICAgICAgICBcdFx0XHR0aGlzLmRlc2NyaXB0aW9uID0gJydcclxuICAgICAgICBcdFx0XHR0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbFRpdGxlID0gJydcclxuICAgICAgICBcdFx0XHR0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbERlc2MgPSAnJ1xyXG4gICAgICAgIFx0XHRcdHNvY2tldC5lbWl0KCdjcmVhdGVfY2hhbm5lbCcsIHByaXZhdGVDaGFuKVxyXG5cclxuICAgICAgICBcdFx0fVxyXG4gICAgICAgIFx0fVxyXG5cdCAgICB9KVxyXG5cdFx0c29ja2V0LmVtaXQoJ2dldF9wcml2YXRlcycsIGN1cnJlbnRfdXNlcilcclxuXHRcdHNvY2tldC5vbigncmV0dXJuX3ByaXZhdGVzJywgKGRhdGEpPT4ge1xyXG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XHJcblx0XHRcdFx0ZGF0YSAgPSBbXVxyXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgcHJpdsOpJ1xyXG5cdFx0XHR9XHJcblx0XHRcdHZ1ZUxpc3RQcml2YXRlcy5wcml2YXRlcyA9IGRhdGFcclxuXHRcdFx0dnVlTGlzdFByaXZhdGVzLmVycm9yID0gZXJyb3JcclxuXHJcblx0XHR9KVxyXG5cclxuXHJcblx0XHRzb2NrZXQub24oJ3N1Y2Nlc3NfY3JlYXRlX2NoYW5uZWwnLCAoKT0+IHtcclxuXHRcdFx0c29ja2V0LmVtaXQoJ2dldF9wcml2YXRlcycsIGN1cnJlbnRfdXNlcilcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGxpc3RQcml2YXRlcyIsImxldCBsaXN0VXNlcnMgPSAoc29ja2V0KSA9PiB7XHJcblx0bGV0ICRsaXN0VXNlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdFVzZXJzJylcclxuXHRpZigkbGlzdFVzZXJzKSB7XHJcblx0XHRsZXQgZXJyb3IgPSBudWxsXHJcblx0XHRzb2NrZXQuZW1pdCgnZ2V0X3VzZXJzJywgY3VycmVudF91c2VyKVxyXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fdXNlcnMnLCAoZGF0YSk9PiB7XHJcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcclxuXHRcdFx0XHRkYXRhICA9IFtdXHJcblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gdXNlciB0cm91dsOpLi4uJ1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCB2dWVMaXN0VXNlcnMgPSBuZXcgVnVlKHtcclxuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcclxuXHRcdCAgICAgICAgZWw6ICcjbGlzdFVzZXJzJyxcclxuXHRcdCAgICAgICAgZGF0YToge1xyXG5cdFx0ICAgICAgICBcdHVzZXJzOiBkYXRhLFxyXG5cdFx0ICAgICAgICBcdGVycm9yOiBlcnJvclxyXG5cdFx0ICAgICAgICB9XHJcblx0XHQgICAgfSlcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGxpc3RVc2VycyIsImxldCBsb2FkZXIgPSAoc29ja2V0KSA9PiB7XHJcblx0bGV0IGN1cnJlbnRDaGFuXHJcblx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpICkge2N1cnJlbnRDaGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlfVxyXG5cclxuXHRsZXQgJGxvYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluTG9hZGVyJylcclxuXHRpZigkbG9hZGVyKSB7XHJcblx0XHRsZXQgJHN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbmQnKVswXVxyXG5cdFx0bGV0ICRpbnB1dCAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VuZC1tZXNzYWdlJylcclxuXHRcdGxldCB2dWVsb2FkZXIgPSBuZXcgVnVlKHtcclxuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXHJcblx0ICAgICAgICBlbDogJyNtYWluTG9hZGVyJyxcclxuXHQgICAgICAgIGRhdGE6IHtcclxuXHQgICAgICAgIFx0Y3VycmVudENoYW46IGN1cnJlbnRDaGFuXHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgbWV0aG9kczp7XHJcblx0ICAgICAgICB9XHJcblx0ICAgIH0pXHJcblx0fVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGxvYWRlciIsIi8vc2VjdGlvbi1wcm9maWxlXHJcblxyXG5sZXQgcHJvZmlsZSA9IChzb2NrZXQpID0+IHtcclxuXHRsZXQgJHByb2ZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VjdGlvbi1wcm9maWxlJylcclxuXHRpZigkcHJvZmlsZSkge1xyXG5cdFx0bGV0IHZ1ZXByb2ZpbGUgPSBuZXcgVnVlKHtcclxuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXHJcblx0ICAgICAgICBlbDogJyNzZWN0aW9uLXByb2ZpbGUnLFxyXG5cdCAgICAgICAgZGF0YToge1xyXG5cdCAgICAgICAgXHR1c2VyOiB7fSxcclxuXHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgbWV0aG9kczp7XHJcblxyXG5cdCAgICAgICAgfVxyXG5cdCAgICB9KVxyXG5cdCAgICBzb2NrZXQuZW1pdCgnZ2V0X2N1cnJlbnRfdXNlcicsIGN1cnJlbnRfdXNlcilcclxuXHJcblx0ICAgIHNvY2tldC5vbignc3VjY2Vzc19nZXRfY3VycmVudF91c2VyJywgKHVzZXIpID0+IHtcclxuXHQgICAgXHRjb25zb2xlLmxvZygncHAnLCB1c2VyKVxyXG5cdCAgICBcdHZ1ZXByb2ZpbGUudXNlciA9IHVzZXJcclxuXHQgICAgfSlcclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgcHJvZmlsZSIsImltcG9ydCBDb29raWUgZnJvbSAnanMtY29va2llJ1xyXG5cclxubGV0IHNpZ25pbiA9IChzb2NrZXQpID0+IHtcclxuXHJcblx0bGV0IHZ1ZVNpZ25pbiA9IG5ldyBWdWUoe1xyXG5cdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXHJcbiAgICAgICAgZWw6ICcjc2lnbmluJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgXHRjdXJyZW50Oidsb2dpbicsXHJcbiAgICAgICAgXHRuYW1lOicnLFxyXG4gICAgICAgIFx0ZW1haWw6JycsXHJcbiAgICAgICAgXHRwYXNzd29yZDonJyxcclxuICAgICAgICBcdGNvbmZpcm1QYXNzd29yZDonJyxcclxuICAgICAgICAgICAgYmF0dGxldGFnOiAnJyxcclxuICAgICAgICBcdGVycm9yQ29uZmlybVBhc3N3b3JkOmZhbHNlLFxyXG4gICAgICAgIFx0Z2xvYmFsRXJyb3I6ZmFsc2UsXHJcbiAgICAgICAgXHRsb2FkaW5nOmZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXRob2RzOntcclxuICAgICAgICBcdHRvZ2dsZTogZnVuY3Rpb24gKHRvZ2dsZSkge1xyXG4gICAgICAgIFx0XHR0aGlzLmN1cnJlbnQgPSB0b2dnbGVcclxuICAgICAgICBcdH0sXHJcbiAgICAgICAgXHRsb2dpbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXHRcdHRoaXMubG9hZGluZyA9IHRydWVcclxuICAgICAgICBcdFx0bGV0IHVzZXIgPSB7XHJcbiAgICAgICAgXHRcdFx0dXNlcm5hbWUgOiB0aGlzLm5hbWUsXHJcbiAgICAgICAgXHRcdFx0cGFzc3dvcmQgOiB0aGlzLnBhc3N3b3JkXHJcbiAgICAgICAgXHRcdH1cclxuICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ2Nvbm5lY3RfdXNlcicsIHVzZXIpXHJcblxyXG4gICAgICAgIFx0fSxcclxuICAgICAgICBcdG5ld0FjY291bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFx0XHR0aGlzLmxvYWRpbmcgPSB0cnVlXHJcblxyXG4gICAgICAgIFx0XHRpZiAodGhpcy5wYXNzd29yZCAhPSB0aGlzLmNvbmZpcm1QYXNzd29yZCkge1xyXG4gICAgICAgIFx0XHRcdHRoaXMuZXJyb3JDb25maXJtUGFzc3dvcmQgPSB0cnVlXHJcbiAgICAgICAgXHRcdFx0dGhpcy5sb2FkaW5nID0gZmFsc2VcclxuICAgICAgICBcdFx0fSBlbHNlIHtcclxuICAgICAgICBcdFx0XHRsZXQgdXNlciA9IHtcclxuICAgICAgICBcdFx0XHRcdHVzZXJuYW1lIDogdGhpcy5uYW1lLFxyXG4gICAgICAgIFx0XHRcdFx0ZW1haWw6IHRoaXMuZW1haWwsXHJcbiAgICAgICAgXHRcdFx0XHRwYXNzd29yZCA6IHRoaXMucGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdHRsZXRhZzogdGhpcy5iYXR0bGV0YWdcclxuICAgICAgICBcdFx0XHR9XHJcbiAgICAgICAgXHRcdFx0c29ja2V0LmVtaXQoJ2NyZWF0ZV91c2VyJywgdXNlcilcclxuICAgICAgICBcdFx0fVxyXG4gICAgICAgIFx0fVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgc29ja2V0Lm9uKCdzdWNjZXNzX2Nvbm5lY3QnLCAocmVzKT0+IHtcclxuICAgIFx0dnVlU2lnbmluLmxvYWRpbmcgPSBmYWxzZVxyXG4gICAgXHRpZiAoQ29va2llLmdldCgnY3VycmVudF91c2VyJykgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBcdFx0Q29va2llLnNldCgnY3VycmVudF91c2VyJywgcmVzLnVzZXJJZCwgeyBleHBpcmVzOiA3LCBwYXRoOiAnLycgfSlcclxuICAgIFx0fSBlbHNlIHtcclxuICAgIFx0XHRDb29raWUucmVtb3ZlKCdjdXJyZW50X3VzZXInKVxyXG4gICAgXHRcdENvb2tpZS5zZXQoJ2N1cnJlbnRfdXNlcicsIHJlcy51c2VySWQsIHsgZXhwaXJlczogNywgcGF0aDogJy8nIH0pXHJcbiAgICBcdH1cclxuXHJcbiAgICBcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSByZXMudXJsXHJcblxyXG4gICAgfSlcclxuXHJcbiAgICBzb2NrZXQub24oJ2Vycm9yX2Nvbm5lY3QnLCAoZXJyb3IpPT4ge1xyXG4gICAgXHR2dWVTaWduaW4uZ2xvYmFsRXJyb3IgPSBlcnJvclxyXG4gICAgXHR2dWVTaWduaW4ubG9hZGluZyA9IGZhbHNlXHJcbiAgICB9KVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IHNpZ25pbiIsIi8qIVxuICogSmF2YVNjcmlwdCBDb29raWUgdjIuMi4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vanMtY29va2llL2pzLWNvb2tpZVxuICpcbiAqIENvcHlyaWdodCAyMDA2LCAyMDE1IEtsYXVzIEhhcnRsICYgRmFnbmVyIEJyYWNrXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuOyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuXHR2YXIgcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gZmFsc2U7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoZmFjdG9yeSk7XG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcblx0fVxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcblx0fVxuXHRpZiAoIXJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlcikge1xuXHRcdHZhciBPbGRDb29raWVzID0gd2luZG93LkNvb2tpZXM7XG5cdFx0dmFyIGFwaSA9IHdpbmRvdy5Db29raWVzID0gZmFjdG9yeSgpO1xuXHRcdGFwaS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0d2luZG93LkNvb2tpZXMgPSBPbGRDb29raWVzO1xuXHRcdFx0cmV0dXJuIGFwaTtcblx0XHR9O1xuXHR9XG59KGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gZXh0ZW5kICgpIHtcblx0XHR2YXIgaSA9IDA7XG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdGZvciAoOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IGFyZ3VtZW50c1sgaSBdO1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0cmVzdWx0W2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0IChjb252ZXJ0ZXIpIHtcblx0XHRmdW5jdGlvbiBhcGkgKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcblx0XHRcdHZhciByZXN1bHQ7XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdyaXRlXG5cblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRhdHRyaWJ1dGVzID0gZXh0ZW5kKHtcblx0XHRcdFx0XHRwYXRoOiAnLydcblx0XHRcdFx0fSwgYXBpLmRlZmF1bHRzLCBhdHRyaWJ1dGVzKTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHR2YXIgZXhwaXJlcyA9IG5ldyBEYXRlKCk7XG5cdFx0XHRcdFx0ZXhwaXJlcy5zZXRNaWxsaXNlY29uZHMoZXhwaXJlcy5nZXRNaWxsaXNlY29uZHMoKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGUrNSk7XG5cdFx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gZXhwaXJlcztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFdlJ3JlIHVzaW5nIFwiZXhwaXJlc1wiIGJlY2F1c2UgXCJtYXgtYWdlXCIgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxuXHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBhdHRyaWJ1dGVzLmV4cGlyZXMgPyBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKSA6ICcnO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuXHRcdFx0XHRcdGlmICgvXltcXHtcXFtdLy50ZXN0KHJlc3VsdCkpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0gcmVzdWx0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblxuXHRcdFx0XHRpZiAoIWNvbnZlcnRlci53cml0ZSkge1xuXHRcdFx0XHRcdHZhbHVlID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyh2YWx1ZSkpXG5cdFx0XHRcdFx0XHQucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnwzQXwzQ3wzRXwzRHwyRnwzRnw0MHw1Qnw1RHw1RXw2MHw3Qnw3RHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGNvbnZlcnRlci53cml0ZSh2YWx1ZSwga2V5KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGtleSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcoa2V5KSk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDVFfDYwfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvW1xcKFxcKV0vZywgZXNjYXBlKTtcblxuXHRcdFx0XHR2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG5cblx0XHRcdFx0Zm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIChkb2N1bWVudC5jb29raWUgPSBrZXkgKyAnPScgKyB2YWx1ZSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlYWRcblxuXHRcdFx0aWYgKCFrZXkpIHtcblx0XHRcdFx0cmVzdWx0ID0ge307XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLiBBbHNvIHByZXZlbnRzIG9kZCByZXN1bHQgd2hlblxuXHRcdFx0Ly8gY2FsbGluZyBcImdldCgpXCJcblx0XHRcdHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG5cdFx0XHR2YXIgcmRlY29kZSA9IC8oJVswLTlBLVpdezJ9KSsvZztcblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0Zm9yICg7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcblx0XHRcdFx0dmFyIGNvb2tpZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuXHRcdFx0XHRpZiAoIXRoaXMuanNvbiAmJiBjb29raWUuY2hhckF0KDApID09PSAnXCInKSB7XG5cdFx0XHRcdFx0Y29va2llID0gY29va2llLnNsaWNlKDEsIC0xKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIG5hbWUgPSBwYXJ0c1swXS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdFx0Y29va2llID0gY29udmVydGVyLnJlYWQgP1xuXHRcdFx0XHRcdFx0Y29udmVydGVyLnJlYWQoY29va2llLCBuYW1lKSA6IGNvbnZlcnRlcihjb29raWUsIG5hbWUpIHx8XG5cdFx0XHRcdFx0XHRjb29raWUucmVwbGFjZShyZGVjb2RlLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuanNvbikge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0Y29va2llID0gSlNPTi5wYXJzZShjb29raWUpO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoa2V5ID09PSBuYW1lKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBjb29raWU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0W25hbWVdID0gY29va2llO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cblx0XHRhcGkuc2V0ID0gYXBpO1xuXHRcdGFwaS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoYXBpLCBrZXkpO1xuXHRcdH07XG5cdFx0YXBpLmdldEpTT04gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gYXBpLmFwcGx5KHtcblx0XHRcdFx0anNvbjogdHJ1ZVxuXHRcdFx0fSwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblx0XHR9O1xuXHRcdGFwaS5kZWZhdWx0cyA9IHt9O1xuXG5cdFx0YXBpLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXksIGF0dHJpYnV0ZXMpIHtcblx0XHRcdGFwaShrZXksICcnLCBleHRlbmQoYXR0cmlidXRlcywge1xuXHRcdFx0XHRleHBpcmVzOiAtMVxuXHRcdFx0fSkpO1xuXHRcdH07XG5cblx0XHRhcGkud2l0aENvbnZlcnRlciA9IGluaXQ7XG5cblx0XHRyZXR1cm4gYXBpO1xuXHR9XG5cblx0cmV0dXJuIGluaXQoZnVuY3Rpb24gKCkge30pO1xufSkpO1xuIl19
