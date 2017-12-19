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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2NoYXRib3guanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0Q2hhbm5lbHMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0VXNlcnMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9sb2FkZXIuanMiLCJkZXYvanMvdmlld3MvY2hhdC9wcm9maWxlLmpzIiwiZGV2L2pzL3ZpZXdzL3NpZ25pbi5qcyIsIm5vZGVfbW9kdWxlcy9qcy1jb29raWUvc3JjL2pzLmNvb2tpZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUlBOzs7O0FBR0E7Ozs7Ozs7O0lBR00sRztBQUVMLGdCQUFjO0FBQUE7O0FBQ1YsT0FBSyxNQUFMLEdBQWMsR0FBRyxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsR0FBdUIsT0FBMUIsQ0FBZDtBQUNIOzs7OzZCQUVVO0FBQ1YsT0FBRyxtQkFBTyxHQUFQLENBQVcsY0FBWCxNQUErQixTQUFsQyxFQUE0QztBQUFDLGFBQVMsUUFBVCxDQUFrQixJQUFsQixHQUF5QixPQUFPLFFBQVAsQ0FBZ0IsTUFBekM7QUFBZ0Q7QUFDN0YsVUFBTyxZQUFQLEdBQXNCLG1CQUFPLEdBQVAsQ0FBVyxjQUFYLENBQXRCO0FBQ0EsNEJBQVMsS0FBSyxNQUFkO0FBQ0EsK0JBQWEsS0FBSyxNQUFsQjtBQUNBLCtCQUFhLEtBQUssTUFBbEI7QUFDQSwrQkFBYSxLQUFLLE1BQWxCO0FBQ0EsMEJBQVEsS0FBSyxNQUFiO0FBQ0EseUJBQU8sS0FBSyxNQUFaO0FBQ0EsMEJBQU8sS0FBSyxNQUFa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QUFPLE1BQVA7QUFDQTs7QUFFRCxNQUFJLEdBQUosR0FBVSxHQUFWO0FBQ0EsTUFBSSxHQUFKLEdBQVUsVUFBVSxHQUFWLEVBQWU7QUFDeEIsVUFBTyxJQUFJLElBQUosQ0FBUyxHQUFULEVBQWMsR0FBZCxDQUFQO0FBQ0EsR0FGRDtBQUdBLE1BQUksT0FBSixHQUFjLFlBQVk7QUFDekIsVUFBTyxJQUFJLEtBQUosQ0FBVTtBQUNoQixVQUFNO0FBRFUsSUFBVixFQUVKLEdBQUcsS0FBSCxDQUFTLElBQVQsQ0FBYyxTQUFkLENBRkksQ0FBUDtBQUdBLEdBSkQ7QUFLQSxNQUFJLFFBQUosR0FBZSxFQUFmOztBQUVBLE1BQUksTUFBSixHQUFhLFVBQVUsR0FBVixFQUFlLFVBQWYsRUFBMkI7QUFDdkMsT0FBSSxHQUFKLEVBQVMsRUFBVCxFQUFhLE9BQU8sVUFBUCxFQUFtQjtBQUMvQixhQUFTLENBQUM7QUFEcUIsSUFBbkIsQ0FBYjtBQUdBLEdBSkQ7O0FBTUEsTUFBSSxhQUFKLEdBQW9CLElBQXBCOztBQUVBLFNBQU8sR0FBUDtBQUNBOztBQUVELFFBQU8sS0FBSyxZQUFZLENBQUUsQ0FBbkIsQ0FBUDtBQUNBLENBN0pDLENBQUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHVzZXJMaXN0IFx0ZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RVc2Vycy5qcydcbmltcG9ydCBwcml2YXRlc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RQcml2YXRlcy5qcydcbmltcG9ydCBtZXNzYWdlc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RNZXNzYWdlcy5qcydcbmltcG9ydCBjaGFubmVsc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RDaGFubmVscy5qcydcbmltcG9ydCBjaGF0Ym94IFx0XHRmcm9tICcuL3ZpZXdzL2NoYXQvY2hhdGJveC5qcydcbmltcG9ydCBsb2FkZXIgXHRcdGZyb20gJy4vdmlld3MvY2hhdC9sb2FkZXIuanMnXG5pbXBvcnQgcHJvZmlsIFx0XHRmcm9tICcuL3ZpZXdzL2NoYXQvcHJvZmlsZS5qcydcblxuXG5cbmltcG9ydCBDb29raWUgICAgICAgZnJvbSAnanMtY29va2llJ1xuXG5cbmltcG9ydCBzaWduaW4gICAgICAgZnJvbSAnLi92aWV3cy9zaWduaW4uanMnXG5cblxuY2xhc3MgQXBwIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0ICAgIHRoaXMuc29ja2V0ID0gaW8od2luZG93LmxvY2F0aW9uLm9yaWdpbisnOjMwMDAnKVxuXHR9XG5cblx0aW5pdENoYXQoKSB7XG5cdFx0aWYoQ29va2llLmdldCgnY3VycmVudF91c2VyJykgPT09IHVuZGVmaW5lZCl7ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW59XG5cdFx0d2luZG93LmN1cnJlbnRfdXNlciA9IENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpXG5cdFx0dXNlckxpc3QodGhpcy5zb2NrZXQpXG5cdFx0bWVzc2FnZXNMaXN0KHRoaXMuc29ja2V0KVxuXHRcdHByaXZhdGVzTGlzdCh0aGlzLnNvY2tldClcblx0XHRjaGFubmVsc0xpc3QodGhpcy5zb2NrZXQpXG5cdFx0Y2hhdGJveCh0aGlzLnNvY2tldClcblx0XHRsb2FkZXIodGhpcy5zb2NrZXQpXG5cdFx0cHJvZmlsKHRoaXMuc29ja2V0KVxuXHR9XG5cblx0aW5pdFNpZ25pbigpIHtcblx0XHRzaWduaW4odGhpcy5zb2NrZXQpXG5cdH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKGV2ZW50KSAgPT57XG4gIFx0bGV0IGFwcCA9IG5ldyBBcHBcbiAgXHRsZXQgJGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdXG4gIFx0aWYgKCAkYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3NpZ25pbicpICkge1xuICBcdFx0aWYgKENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpKSB7XG4gIFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luKycvP2FjdGlvbj1jaGF0J1xuICBcdFx0fSBlbHNlICB7XG4gIFx0XHRcdGFwcC5pbml0U2lnbmluKClcbiAgXHRcdH1cblxuICBcdH0gZWxzZSBpZiAoJGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGF0JykpIHtcbiAgXHRcdGFwcC5pbml0Q2hhdCgpXG4gIFx0fVxuXG59KVxuXG4iLCJsZXQgY2hhdGJveCA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRjaGF0Ym94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlY3Rpb24taW5wdXQnKVxuXHRpZigkY2hhdGJveCkge1xuXHRcdGxldCAkc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VuZCcpWzBdXG5cdFx0bGV0ICRpbnB1dCAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VuZC1tZXNzYWdlJylcblx0XHRsZXQgdnVlY2hhdGJveCA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjc2VjdGlvbi1pbnB1dCcsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgIFx0bWVzc2FnZTogJycsXG5cdCAgICAgICAgXHRjdXJyZW50Q2hhbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBtZXRob2RzOntcblx0ICAgICAgICBcdHNlbmQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIFx0XHQkaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0Jylcblx0XHRcdCAgICBcdC8vIENoZWNrIGlmIHRoZSBjdXJyZW50IG1lc3NhZ2UgaXMgZW1wdHkgb3Igbm90XG5cdFx0XHQgICAgXHRpZiAodGhpcy5tZXNzYWdlICYmIHRoaXMubWVzc2FnZSAhPSAnJykge1xuXHRcdFx0ICAgIFx0XHR0aGlzLmN1cnJlbnRDaGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlXG5cdFx0XHQgICAgXHRcdC8vIENyZWF0aW5nIGEgbmV4IG1lc3NhZ2Vcblx0XHQgICAgXHRcdCAgXHQvLyByZWluaXRpYWxpc2UgdGhlIGlucHV0IGFuZCBibHVyIGl0XG5cdFx0ICAgICAgICBcdFx0bGV0IG1lc3NhZ2UgPSB7XG5cdFx0ICAgICAgICBcdFx0XHRjb250ZW50OiB0aGlzLm1lc3NhZ2UsXG5cdFx0ICAgICAgICBcdFx0XHRpZF91c2VyOiAxLFxuXHRcdCAgICAgICAgXHRcdFx0aWRfY2hhbm5lbDogdGhpcy5jdXJyZW50Q2hhbixcblx0XHQgICAgICAgIFx0XHR9XG5cblx0XHQgICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnc2VuZF9tZXNzYWdlJywgbWVzc2FnZSlcblx0XHQgICAgICAgIFx0XHR0aGlzLm1lc3NhZ2UgPSAnJ1xuXHRcdCAgICAgICAgXHR9XG5cdCAgICAgICAgXHR9XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblxuXHQgICAgc29ja2V0Lm9uKCdzdWNjZXNzX3NlbmRfbWVzc2FnZScsICgpID0+IHtcblx0ICAgIFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVsX21lc3NhZ2VzJywgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlKVxuXHQgICAgfSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgY2hhdGJveCIsImxldCBsaXN0Q2hhbm5lbHMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdENoYW5uZWxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RDaGFubmVscycpXG5cdGlmKCRsaXN0Q2hhbm5lbHMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0bGV0ICRzZWxlY3RlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKVxuXHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbHMnKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX2NoYW5uZWxzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgdHJvdXbDqS4uLidcblx0XHRcdH1cblx0XHRcdGxldCB2dWVMaXN0Q2hhbm5lbHMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0Q2hhbm5lbHMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHRjaGFubmVsczogZGF0YSxcblx0XHQgICAgICAgIFx0ZXJyb3I6IGVycm9yLFxuXHRcdCAgICAgICAgXHRzZWxlY3RlZDogbnVsbFxuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIG1ldGhvZHM6e1xuXHRcdCAgICAgICAgXHRzZWxlY3RDaGFuOiBmdW5jdGlvbihpZCkge1xuXHRcdCAgICAgICAgXHRcdHRoaXMuc2VsZWN0ZWQgPSBpZFxuXHRcdCAgICAgICAgXHRcdCRzZWxlY3RlZC52YWx1ZSA9IGlkXG5cdFx0ICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVsX21lc3NhZ2VzJywgaWQpXG5cdFx0ICAgICAgICBcdH1cblx0XHQgICAgICAgIH1cblx0XHQgICAgfSlcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0Q2hhbm5lbHMiLCJsZXQgbGlzdE1lc3NhZ2VzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RNZXNzYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0TWVzc2FnZXMnKVxuXHRpZigkbGlzdE1lc3NhZ2VzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdGxldCB2dWVMaXN0TWVzc2FnZXMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0TWVzc2FnZXMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHRtZXNzYWdlczogW10sXG5cdFx0ICAgICAgICBcdGVycm9yOiBudWxsXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fbWVzc2FnZXMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gbWVzc2FnZSB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLm1lc3NhZ2VzID0gZGF0YVxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLmVycm9yID0gZXJyb3Jcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0TWVzc2FnZXMiLCJsZXQgbGlzdFByaXZhdGVzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RQcml2YXRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0UHJpdmF0ZXMnKVxuXHRpZigkbGlzdFByaXZhdGVzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdGNvbnNvbGUubG9nKGN1cnJlbnRfdXNlcilcblx0XHRWdWUuY29tcG9uZW50KCdtb2RhbCcsIHtcblx0XHQgIHRlbXBsYXRlOiAnI21vZGFsLWNyZWF0ZScsXG5cdFx0ICBwcm9wczogWydzaG93JywgJ3RpdGxlJ10sXG5cdFx0ICBkYXRhOiBmdW5jdGlvbigpIHtcblx0XHQgICAgcmV0dXJuIHtcblx0XHQgICAgICBpbnRlcm5hbFNob3c6ICcnLFxuXHRcdCAgICAgIGludGVybmFsVGl0bGU6JycsXG5cdFx0ICAgICAgaW50ZXJuYWxEZXNjOicnXG5cdFx0ICAgIH1cblx0XHQgIH0sXG5cdFx0ICB3YXRjaDoge1xuXHRcdCAgICAnaW50ZXJuYWxTaG93JzogZnVuY3Rpb24oKSB7XG5cdFx0ICAgICAgXHRpZiAoIXRoaXMuaW50ZXJuYWxTaG93KSB7dGhpcy4kZW1pdCgnY2xvc2UnLCB0aGlzLmludGVybmFsU2hvdyl9XG5cdFx0ICAgIH1cblx0XHQgIH0sXG5cdFx0ICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcblx0XHQgICAgdGhpcy5pbnRlcm5hbFNob3cgID0gdGhpcy5zaG93XG5cdFx0ICAgIHRoaXMuaW50ZXJuYWxUaXRsZSA9IHRoaXMudGl0bGVcblx0XHQgICAgdGhpcy5pbnRlcm5hbERlc2MgID0gdGhpcy5kZXNjcmlwdGlvblxuXHRcdCAgfVxuXHRcdH0pXG5cblxuXHRcdGxldCB2dWVMaXN0UHJpdmF0ZXMgPSBuZXcgVnVlKHtcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHQgICAgICAgIGVsOiAnI2xpc3RQcml2YXRlcycsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgIFx0cHJpdmF0ZXM6IFtdLFxuXHQgICAgICAgIFx0ZXJyb3I6IG51bGwsXG5cdCAgICAgICAgXHRzaG93TW9kYWw6IGZhbHNlLFxuXHQgICAgICAgIFx0dGl0bGU6ICcnLFxuXHQgICAgICAgIFx0ZGVzY3JpcHRpb246Jydcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgXHRcdGNsb3NlTW9kYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdFx0XHR0aGlzLnNob3dNb2RhbCA9IGZhbHNlXG4gICAgICAgIFx0XHRcdHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsU2hvdyA9IGZhbHNlXG5cbiAgICAgICAgXHRcdH0sXG4gICAgICAgIFx0XHRjcmVhdGVOZXdDaGFuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXHRcdFx0dGhpcy50aXRsZSA9IHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsVGl0bGVcbiAgICAgICAgXHRcdFx0dGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsRGVzY1xuICAgICAgICBcdFx0XHR0aGlzLmNsb3NlTW9kYWwoKVxuICAgICAgICBcdFx0XHRsZXQgcHJpdmF0ZUNoYW4gPSB7XG4gICAgICAgIFx0XHRcdFx0aWRfdHlwZTogMixcbiAgICAgICAgXHRcdFx0XHRwb3NpdGlvbjogbnVsbCxcbiAgICAgICAgXHRcdFx0XHRuYW1lOiB0aGlzLnRpdGxlLFxuICAgICAgICBcdFx0XHRcdGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgICBcdFx0XHRcdGlkX3VzZXI6IGN1cnJlbnRfdXNlclxuICAgICAgICBcdFx0XHR9XG4gICAgICAgIFx0XHRcdHRoaXMudGl0bGUgPSAnJ1xuICAgICAgICBcdFx0XHR0aGlzLmRlc2NyaXB0aW9uID0gJydcbiAgICAgICAgXHRcdFx0dGhpcy4kY2hpbGRyZW5bMF0uaW50ZXJuYWxUaXRsZSA9ICcnXG4gICAgICAgIFx0XHRcdHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsRGVzYyA9ICcnXG4gICAgICAgIFx0XHRcdHNvY2tldC5lbWl0KCdjcmVhdGVfY2hhbm5lbCcsIHByaXZhdGVDaGFuKVxuXG4gICAgICAgIFx0XHR9XG4gICAgICAgIFx0fVxuXHQgICAgfSlcblx0XHRzb2NrZXQuZW1pdCgnZ2V0X3ByaXZhdGVzJywgY3VycmVudF91c2VyKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX3ByaXZhdGVzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgcHJpdsOpJ1xuXHRcdFx0fVxuXHRcdFx0dnVlTGlzdFByaXZhdGVzLnByaXZhdGVzID0gZGF0YVxuXHRcdFx0dnVlTGlzdFByaXZhdGVzLmVycm9yID0gZXJyb3JcblxuXHRcdH0pXG5cblxuXHRcdHNvY2tldC5vbignc3VjY2Vzc19jcmVhdGVfY2hhbm5lbCcsICgpPT4ge1xuXHRcdFx0c29ja2V0LmVtaXQoJ2dldF9wcml2YXRlcycsIGN1cnJlbnRfdXNlcilcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0UHJpdmF0ZXMiLCJsZXQgbGlzdFVzZXJzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RVc2VycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0VXNlcnMnKVxuXHRpZigkbGlzdFVzZXJzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdHNvY2tldC5lbWl0KCdnZXRfdXNlcnMnLCBjdXJyZW50X3VzZXIpXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fdXNlcnMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gdXNlciB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0bGV0IHZ1ZUxpc3RVc2VycyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RVc2VycycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdHVzZXJzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjogZXJyb3Jcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSlcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0VXNlcnMiLCJsZXQgbG9hZGVyID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgY3VycmVudENoYW5cblx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpICkge2N1cnJlbnRDaGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlfVxuXG5cdGxldCAkbG9hZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5Mb2FkZXInKVxuXHRpZigkbG9hZGVyKSB7XG5cdFx0bGV0ICRzdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZW5kJylbMF1cblx0XHRsZXQgJGlucHV0ICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZW5kLW1lc3NhZ2UnKVxuXHRcdGxldCB2dWVsb2FkZXIgPSBuZXcgVnVlKHtcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHQgICAgICAgIGVsOiAnI21haW5Mb2FkZXInLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdGN1cnJlbnRDaGFuOiBjdXJyZW50Q2hhblxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgbWV0aG9kczp7XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbG9hZGVyIiwiLy9zZWN0aW9uLXByb2ZpbGVcblxubGV0IHByb2ZpbGUgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkcHJvZmlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWN0aW9uLXByb2ZpbGUnKVxuXHRpZigkcHJvZmlsZSkge1xuXHRcdGxldCB2dWVwcm9maWxlID0gbmV3IFZ1ZSh7XG5cdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0ICAgICAgICBlbDogJyNzZWN0aW9uLXByb2ZpbGUnLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdHVzZXI6IHt9LFxuXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBtZXRob2RzOntcblxuXHQgICAgICAgIH1cblx0ICAgIH0pXG5cdCAgICBzb2NrZXQuZW1pdCgnZ2V0X2N1cnJlbnRfdXNlcicsIGN1cnJlbnRfdXNlcilcblxuXHQgICAgc29ja2V0Lm9uKCdzdWNjZXNzX2dldF9jdXJyZW50X3VzZXInLCAodXNlcikgPT4ge1xuXHQgICAgXHRjb25zb2xlLmxvZygncHAnLCB1c2VyKVxuXHQgICAgXHR2dWVwcm9maWxlLnVzZXIgPSB1c2VyXG5cdCAgICB9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBwcm9maWxlIiwiaW1wb3J0IENvb2tpZSBmcm9tICdqcy1jb29raWUnXG5cbmxldCBzaWduaW4gPSAoc29ja2V0KSA9PiB7XG5cblx0bGV0IHZ1ZVNpZ25pbiA9IG5ldyBWdWUoe1xuXHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuICAgICAgICBlbDogJyNzaWduaW4nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgIFx0Y3VycmVudDonbG9naW4nLFxuICAgICAgICBcdG5hbWU6JycsXG4gICAgICAgIFx0ZW1haWw6JycsXG4gICAgICAgIFx0cGFzc3dvcmQ6JycsXG4gICAgICAgIFx0Y29uZmlybVBhc3N3b3JkOicnLFxuICAgICAgICAgICAgYmF0dGxldGFnOiAnJyxcbiAgICAgICAgXHRlcnJvckNvbmZpcm1QYXNzd29yZDpmYWxzZSxcbiAgICAgICAgXHRnbG9iYWxFcnJvcjpmYWxzZSxcbiAgICAgICAgXHRsb2FkaW5nOmZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6e1xuICAgICAgICBcdHRvZ2dsZTogZnVuY3Rpb24gKHRvZ2dsZSkge1xuICAgICAgICBcdFx0dGhpcy5jdXJyZW50ID0gdG9nZ2xlXG4gICAgICAgIFx0fSxcbiAgICAgICAgXHRsb2dpbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFx0XHR0aGlzLmxvYWRpbmcgPSB0cnVlXG4gICAgICAgIFx0XHRsZXQgdXNlciA9IHtcbiAgICAgICAgXHRcdFx0dXNlcm5hbWUgOiB0aGlzLm5hbWUsXG4gICAgICAgIFx0XHRcdHBhc3N3b3JkIDogdGhpcy5wYXNzd29yZFxuICAgICAgICBcdFx0fVxuICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ2Nvbm5lY3RfdXNlcicsIHVzZXIpXG5cbiAgICAgICAgXHR9LFxuICAgICAgICBcdG5ld0FjY291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdFx0dGhpcy5sb2FkaW5nID0gdHJ1ZVxuXG4gICAgICAgIFx0XHRpZiAodGhpcy5wYXNzd29yZCAhPSB0aGlzLmNvbmZpcm1QYXNzd29yZCkge1xuICAgICAgICBcdFx0XHR0aGlzLmVycm9yQ29uZmlybVBhc3N3b3JkID0gdHJ1ZVxuICAgICAgICBcdFx0XHR0aGlzLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgICBcdFx0fSBlbHNlIHtcbiAgICAgICAgXHRcdFx0bGV0IHVzZXIgPSB7XG4gICAgICAgIFx0XHRcdFx0dXNlcm5hbWUgOiB0aGlzLm5hbWUsXG4gICAgICAgIFx0XHRcdFx0ZW1haWw6IHRoaXMuZW1haWwsXG4gICAgICAgIFx0XHRcdFx0cGFzc3dvcmQgOiB0aGlzLnBhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmF0dGxldGFnOiB0aGlzLmJhdHRsZXRhZ1xuICAgICAgICBcdFx0XHR9XG4gICAgICAgIFx0XHRcdHNvY2tldC5lbWl0KCdjcmVhdGVfdXNlcicsIHVzZXIpXG4gICAgICAgIFx0XHR9XG4gICAgICAgIFx0fVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIHNvY2tldC5vbignc3VjY2Vzc19jb25uZWN0JywgKHJlcyk9PiB7XG4gICAgXHR2dWVTaWduaW4ubG9hZGluZyA9IGZhbHNlXG4gICAgXHRpZiAoQ29va2llLmdldCgnY3VycmVudF91c2VyJykgPT0gdW5kZWZpbmVkKSB7XG4gICAgXHRcdENvb2tpZS5zZXQoJ2N1cnJlbnRfdXNlcicsIHJlcy51c2VySWQsIHsgZXhwaXJlczogNywgcGF0aDogJy8nIH0pXG4gICAgXHR9IGVsc2Uge1xuICAgIFx0XHRDb29raWUucmVtb3ZlKCdjdXJyZW50X3VzZXInKVxuICAgIFx0XHRDb29raWUuc2V0KCdjdXJyZW50X3VzZXInLCByZXMudXNlcklkLCB7IGV4cGlyZXM6IDcsIHBhdGg6ICcvJyB9KVxuICAgIFx0fVxuXG4gICAgXHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gcmVzLnVybFxuXG4gICAgfSlcblxuICAgIHNvY2tldC5vbignZXJyb3JfY29ubmVjdCcsIChlcnJvcik9PiB7XG4gICAgXHR2dWVTaWduaW4uZ2xvYmFsRXJyb3IgPSBlcnJvclxuICAgIFx0dnVlU2lnbmluLmxvYWRpbmcgPSBmYWxzZVxuICAgIH0pXG59XG5leHBvcnQgZGVmYXVsdCBzaWduaW4iLCIvKiFcbiAqIEphdmFTY3JpcHQgQ29va2llIHYyLjIuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL2pzLWNvb2tpZS9qcy1jb29raWVcbiAqXG4gKiBDb3B5cmlnaHQgMjAwNiwgMjAxNSBLbGF1cyBIYXJ0bCAmIEZhZ25lciBCcmFja1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cbjsoZnVuY3Rpb24gKGZhY3RvcnkpIHtcblx0dmFyIHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IGZhbHNlO1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKCFyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIpIHtcblx0XHR2YXIgT2xkQ29va2llcyA9IHdpbmRvdy5Db29raWVzO1xuXHRcdHZhciBhcGkgPSB3aW5kb3cuQ29va2llcyA9IGZhY3RvcnkoKTtcblx0XHRhcGkubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHdpbmRvdy5Db29raWVzID0gT2xkQ29va2llcztcblx0XHRcdHJldHVybiBhcGk7XG5cdFx0fTtcblx0fVxufShmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIGV4dGVuZCAoKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRmb3IgKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHNbIGkgXTtcblx0XHRcdGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdHJlc3VsdFtrZXldID0gYXR0cmlidXRlc1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCAoY29udmVydGVyKSB7XG5cdFx0ZnVuY3Rpb24gYXBpIChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHR2YXIgcmVzdWx0O1xuXHRcdFx0aWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXcml0ZVxuXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0YXR0cmlidXRlcyA9IGV4dGVuZCh7XG5cdFx0XHRcdFx0cGF0aDogJy8nXG5cdFx0XHRcdH0sIGFwaS5kZWZhdWx0cywgYXR0cmlidXRlcyk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBhdHRyaWJ1dGVzLmV4cGlyZXMgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0dmFyIGV4cGlyZXMgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0XHRcdGV4cGlyZXMuc2V0TWlsbGlzZWNvbmRzKGV4cGlyZXMuZ2V0TWlsbGlzZWNvbmRzKCkgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlKzUpO1xuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGV4cGlyZXM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBXZSdyZSB1c2luZyBcImV4cGlyZXNcIiBiZWNhdXNlIFwibWF4LWFnZVwiIGlzIG5vdCBzdXBwb3J0ZWQgYnkgSUVcblx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzID8gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJztcblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcblx0XHRcdFx0XHRpZiAoL15bXFx7XFxbXS8udGVzdChyZXN1bHQpKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHJlc3VsdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cblx0XHRcdFx0aWYgKCFjb252ZXJ0ZXIud3JpdGUpIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcodmFsdWUpKVxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8M0F8M0N8M0V8M0R8MkZ8M0Z8NDB8NUJ8NUR8NUV8NjB8N0J8N0R8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGtleSkpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1tcXChcXCldL2csIGVzY2FwZSk7XG5cblx0XHRcdFx0dmFyIHN0cmluZ2lmaWVkQXR0cmlidXRlcyA9ICcnO1xuXG5cdFx0XHRcdGZvciAodmFyIGF0dHJpYnV0ZU5hbWUgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRcdGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcblx0XHRcdFx0XHRpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAoZG9jdW1lbnQuY29va2llID0ga2V5ICsgJz0nICsgdmFsdWUgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZWFkXG5cblx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdHJlc3VsdCA9IHt9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XG5cdFx0XHQvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC4gQWxzbyBwcmV2ZW50cyBvZGQgcmVzdWx0IHdoZW5cblx0XHRcdC8vIGNhbGxpbmcgXCJnZXQoKVwiXG5cdFx0XHR2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xuXHRcdFx0dmFyIHJkZWNvZGUgPSAvKCVbMC05QS1aXXsyfSkrL2c7XG5cdFx0XHR2YXIgaSA9IDA7XG5cblx0XHRcdGZvciAoOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XG5cdFx0XHRcdHZhciBjb29raWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XG5cblx0XHRcdFx0aWYgKCF0aGlzLmpzb24gJiYgY29va2llLmNoYXJBdCgwKSA9PT0gJ1wiJykge1xuXHRcdFx0XHRcdGNvb2tpZSA9IGNvb2tpZS5zbGljZSgxLCAtMSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciBuYW1lID0gcGFydHNbMF0ucmVwbGFjZShyZGVjb2RlLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHRcdGNvb2tpZSA9IGNvbnZlcnRlci5yZWFkID9cblx0XHRcdFx0XHRcdGNvbnZlcnRlci5yZWFkKGNvb2tpZSwgbmFtZSkgOiBjb252ZXJ0ZXIoY29va2llLCBuYW1lKSB8fFxuXHRcdFx0XHRcdFx0Y29va2llLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLmpzb24pIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGNvb2tpZSA9IEpTT04ucGFyc2UoY29va2llKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGtleSA9PT0gbmFtZSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0ID0gY29va2llO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCFrZXkpIHtcblx0XHRcdFx0XHRcdHJlc3VsdFtuYW1lXSA9IGNvb2tpZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdFx0YXBpLnNldCA9IGFwaTtcblx0XHRhcGkuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cmV0dXJuIGFwaS5jYWxsKGFwaSwga2V5KTtcblx0XHR9O1xuXHRcdGFwaS5nZXRKU09OID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGFwaS5hcHBseSh7XG5cdFx0XHRcdGpzb246IHRydWVcblx0XHRcdH0sIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG5cdFx0fTtcblx0XHRhcGkuZGVmYXVsdHMgPSB7fTtcblxuXHRcdGFwaS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRhcGkoa2V5LCAnJywgZXh0ZW5kKGF0dHJpYnV0ZXMsIHtcblx0XHRcdFx0ZXhwaXJlczogLTFcblx0XHRcdH0pKTtcblx0XHR9O1xuXG5cdFx0YXBpLndpdGhDb252ZXJ0ZXIgPSBpbml0O1xuXG5cdFx0cmV0dXJuIGFwaTtcblx0fVxuXG5cdHJldHVybiBpbml0KGZ1bmN0aW9uICgpIHt9KTtcbn0pKTtcbiJdfQ==
