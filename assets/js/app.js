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

var _headerChat = require('./views/chat/headerChat.js');

var _headerChat2 = _interopRequireDefault(_headerChat);

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
			(0, _headerChat2.default)(this.socket);
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

},{"./views/chat/chatbox.js":2,"./views/chat/headerChat.js":3,"./views/chat/listChannels.js":4,"./views/chat/listMessages.js":5,"./views/chat/listPrivates.js":6,"./views/chat/listUsers.js":7,"./views/chat/loader.js":8,"./views/chat/profile.js":9,"./views/signin.js":10,"js-cookie":11}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var chatbox = function chatbox(socket) {
	var $chatbox = document.getElementById('section-input');
	if ($chatbox) {
		var idChan = 0;
		var vuechatbox = new Vue({
			delimiters: ['${', '}'],
			el: '#section-input',
			data: {
				message: '',
				currentChan: null
			},
			methods: {
				send: function send() {
					// Check if the current message is empty or not
					if (this.message && this.message != '' && this.currentChan != null) {
						// Creating a nex message
						// reinitialise the input and blur it
						var message = {
							content: this.message,
							id_user: current_user,
							id_channel: this.currentChan
						};

						socket.emit('send_message', message);
						idChan = this.currentChan;
						this.message = '';
					}
				}
			}
		});

		socket.on('success_send_message', function (id) {
			socket.emit('get_channel_messages', idChan);
		});

		socket.on('select_chan', function (chan) {
			vuechatbox.currentChan = chan.id_channel;
		});
	}
};
exports.default = chatbox;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var headerChat = function headerChat(socket) {
	var $headerChat = document.getElementById('section-top');
	if ($headerChat) {
		var idChan = 0;
		var vueheaderChat = new Vue({
			delimiters: ['${', '}'],
			el: '#section-top',
			data: {
				title: '',
				currentChan: '',
				desc: ''
			},
			methods: {}
		});

		socket.on('select_chan', function (chan) {
			console.log("kjknk", chan);
			vueheaderChat.currentChan = chan.id_channel;
			vueheaderChat.title = chan.name;
			vueheaderChat.desc = chan.description;
			console.log(vueheaderChat, vueheaderChat.title);
		});
	}
};
exports.default = headerChat;

},{}],4:[function(require,module,exports){
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
						socket.emit('select_chan', id);
						console.log('emit select_chan');
						socket.emit('get_channel_messages', id);
					}
				}
			});

			socket.on('select_chan', function (chan) {
				vueListChannels.selected = chan.id_channel;
			});
		});
	}
};
exports.default = listChannels;

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
				description: '',
				selected: null
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
				},
				selectChan: function selectChan(id) {
					socket.emit('select_chan', id);
					socket.emit('get_channel_messages', id);
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

		socket.on('select_chan', function (chan) {
			vueListPrivates.selected = chan.id_channel;
		});

		socket.on('success_create_channel', function () {
			socket.emit('get_privates', current_user);
		});
	}
};
exports.default = listPrivates;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var listUsers = function listUsers(socket) {
	var $listUsers = document.getElementById('listUsers');
	if ($listUsers) {
		var error = null;
		var vueListUsers = new Vue({
			delimiters: ['${', '}'],
			el: '#listUsers',
			data: {
				users: [],
				error: null
			},
			methods: {
				sendInvite: function sendInvite(id_user) {
					socket.emit('send_invite', { current_user: current_user, user_to_invite: id_user });
				},
				acceptInvite: function acceptInvite(id_user) {
					socket.emit('accept_invite', { current_user: current_user, user_initiator: id_user });
				},
				refuseInvite: function refuseInvite(id_user) {
					socket.emit('refuse_invite', { current_user: current_user, user_initiator: id_user });
				}
			}
		});
		socket.on('return_users', function (data) {
			if (data === null) {
				data = [];
				error = 'Aucun user trouvé...';
			}
			vueListUsers.users = data;
			vueListUsers.error = error;
			console.log(data);
		});

		socket.on('success_friend_interraction', function () {
			socket.emit('get_users', current_user);
		});

		socket.emit('get_users', current_user);
	}
};
exports.default = listUsers;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
			vueprofile.user = user;
		});
	}
};
exports.default = profile;

},{}],10:[function(require,module,exports){
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

},{"js-cookie":11}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXZcXGpzXFxtYWluLmpzIiwiZGV2XFxqc1xcdmlld3NcXGNoYXRcXGNoYXRib3guanMiLCJkZXZcXGpzXFx2aWV3c1xcY2hhdFxcaGVhZGVyQ2hhdC5qcyIsImRldlxcanNcXHZpZXdzXFxjaGF0XFxsaXN0Q2hhbm5lbHMuanMiLCJkZXZcXGpzXFx2aWV3c1xcY2hhdFxcbGlzdE1lc3NhZ2VzLmpzIiwiZGV2XFxqc1xcdmlld3NcXGNoYXRcXGxpc3RQcml2YXRlcy5qcyIsImRldlxcanNcXHZpZXdzXFxjaGF0XFxsaXN0VXNlcnMuanMiLCJkZXZcXGpzXFx2aWV3c1xcY2hhdFxcbG9hZGVyLmpzIiwiZGV2XFxqc1xcdmlld3NcXGNoYXRcXHByb2ZpbGUuanMiLCJkZXZcXGpzXFx2aWV3c1xcc2lnbmluLmpzIiwibm9kZV9tb2R1bGVzXFxqcy1jb29raWVcXHNyY1xcanMuY29va2llLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFJQTs7OztBQUdBOzs7Ozs7OztJQUdNLEc7QUFFTCxnQkFBYztBQUFBOztBQUNWLE9BQUssTUFBTCxHQUFjLEdBQUcsT0FBTyxRQUFQLENBQWdCLE1BQWhCLEdBQXVCLE9BQTFCLENBQWQ7QUFDSDs7Ozs2QkFFVTtBQUNWLE9BQUcsbUJBQU8sR0FBUCxDQUFXLGNBQVgsTUFBK0IsU0FBbEMsRUFBNEM7QUFBQyxhQUFTLFFBQVQsQ0FBa0IsSUFBbEIsR0FBeUIsT0FBTyxRQUFQLENBQWdCLE1BQXpDO0FBQWdEO0FBQzdGLFVBQU8sWUFBUCxHQUFzQixtQkFBTyxHQUFQLENBQVcsY0FBWCxDQUF0QjtBQUNBLDRCQUFTLEtBQUssTUFBZDtBQUNBLCtCQUFhLEtBQUssTUFBbEI7QUFDQSwrQkFBYSxLQUFLLE1BQWxCO0FB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O0FBR0EsR0FKRDs7QUFNQSxNQUFJLGFBQUosR0FBb0IsSUFBcEI7O0FBRUEsU0FBTyxHQUFQO0FBQ0E7O0FBRUQsUUFBTyxLQUFLLFlBQVksQ0FBRSxDQUFuQixDQUFQO0FBQ0EsQ0E3SkMsQ0FBRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgdXNlckxpc3QgXHRmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdFVzZXJzLmpzJ1xyXG5pbXBvcnQgcHJpdmF0ZXNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMnXHJcbmltcG9ydCBtZXNzYWdlc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RNZXNzYWdlcy5qcydcclxuaW1wb3J0IGNoYW5uZWxzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdENoYW5uZWxzLmpzJ1xyXG5pbXBvcnQgY2hhdGJveCBcdFx0ZnJvbSAnLi92aWV3cy9jaGF0L2NoYXRib3guanMnXHJcbmltcG9ydCBsb2FkZXIgXHRcdGZyb20gJy4vdmlld3MvY2hhdC9sb2FkZXIuanMnXHJcbmltcG9ydCBwcm9maWwgXHRcdGZyb20gJy4vdmlld3MvY2hhdC9wcm9maWxlLmpzJ1xyXG5pbXBvcnQgaGVhZGVyIFx0XHRmcm9tICcuL3ZpZXdzL2NoYXQvaGVhZGVyQ2hhdC5qcydcclxuXHJcblxyXG5cclxuaW1wb3J0IENvb2tpZSAgICAgICBmcm9tICdqcy1jb29raWUnXHJcblxyXG5cclxuaW1wb3J0IHNpZ25pbiAgICAgICBmcm9tICcuL3ZpZXdzL3NpZ25pbi5qcydcclxuXHJcblxyXG5jbGFzcyBBcHAge1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHQgICAgdGhpcy5zb2NrZXQgPSBpbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKyc6MzAwMCcpXHJcblx0fVxyXG5cclxuXHRpbml0Q2hhdCgpIHtcclxuXHRcdGlmKENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpID09PSB1bmRlZmluZWQpe2RvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2lufVxyXG5cdFx0d2luZG93LmN1cnJlbnRfdXNlciA9IENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpXHJcblx0XHR1c2VyTGlzdCh0aGlzLnNvY2tldClcclxuXHRcdG1lc3NhZ2VzTGlzdCh0aGlzLnNvY2tldClcclxuXHRcdHByaXZhdGVzTGlzdCh0aGlzLnNvY2tldClcclxuXHRcdGNoYW5uZWxzTGlzdCh0aGlzLnNvY2tldClcclxuXHRcdGNoYXRib3godGhpcy5zb2NrZXQpXHJcblx0XHRsb2FkZXIodGhpcy5zb2NrZXQpXHJcblx0XHRwcm9maWwodGhpcy5zb2NrZXQpXHJcblx0XHRoZWFkZXIodGhpcy5zb2NrZXQpXHJcblx0fVxyXG5cclxuXHRpbml0U2lnbmluKCkge1xyXG5cdFx0c2lnbmluKHRoaXMuc29ja2V0KVxyXG5cdH1cclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKGV2ZW50KSAgPT57XHJcbiAgXHRsZXQgYXBwID0gbmV3IEFwcFxyXG4gIFx0bGV0ICRib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXVxyXG4gIFx0aWYgKCAkYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3NpZ25pbicpICkge1xyXG4gIFx0XHRpZiAoQ29va2llLmdldCgnY3VycmVudF91c2VyJykpIHtcclxuICBcdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbisnLz9hY3Rpb249Y2hhdCdcclxuICBcdFx0fSBlbHNlICB7XHJcbiAgXHRcdFx0YXBwLmluaXRTaWduaW4oKVxyXG4gIFx0XHR9XHJcblxyXG4gIFx0fSBlbHNlIGlmICgkYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoYXQnKSkge1xyXG4gIFx0XHRhcHAuaW5pdENoYXQoKVxyXG4gIFx0fVxyXG5cclxufSlcclxuXHJcbiIsImxldCBjaGF0Ym94ID0gKHNvY2tldCkgPT4ge1xyXG5cdGxldCAkY2hhdGJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWN0aW9uLWlucHV0JylcclxuXHRpZigkY2hhdGJveCkge1xyXG5cdFx0bGV0IGlkQ2hhbiA9IDBcclxuXHRcdGxldCB2dWVjaGF0Ym94ID0gbmV3IFZ1ZSh7XHJcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxyXG5cdCAgICAgICAgZWw6ICcjc2VjdGlvbi1pbnB1dCcsXHJcblx0ICAgICAgICBkYXRhOiB7XHJcblx0ICAgICAgICBcdG1lc3NhZ2U6ICcnLFxyXG5cdCAgICAgICAgXHRjdXJyZW50Q2hhbjogbnVsbFxyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIG1ldGhvZHM6e1xyXG5cdCAgICAgICAgXHRzZW5kOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0ICAgIFx0Ly8gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgbWVzc2FnZSBpcyBlbXB0eSBvciBub3RcclxuXHRcdFx0ICAgIFx0aWYgKHRoaXMubWVzc2FnZSAmJiB0aGlzLm1lc3NhZ2UgIT0gJycgJiYgdGhpcy5jdXJyZW50Q2hhbiAhPSBudWxsKSB7XHJcblx0XHRcdCAgICBcdFx0Ly8gQ3JlYXRpbmcgYSBuZXggbWVzc2FnZVxyXG5cdFx0ICAgIFx0XHQgIFx0Ly8gcmVpbml0aWFsaXNlIHRoZSBpbnB1dCBhbmQgYmx1ciBpdFxyXG5cdFx0ICAgICAgICBcdFx0bGV0IG1lc3NhZ2UgPSB7XHJcblx0XHQgICAgICAgIFx0XHRcdGNvbnRlbnQ6IHRoaXMubWVzc2FnZSxcclxuXHRcdCAgICAgICAgXHRcdFx0aWRfdXNlcjogY3VycmVudF91c2VyLFxyXG5cdFx0ICAgICAgICBcdFx0XHRpZF9jaGFubmVsOiB0aGlzLmN1cnJlbnRDaGFuLFxyXG5cdFx0ICAgICAgICBcdFx0fVxyXG5cclxuXHRcdCAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdzZW5kX21lc3NhZ2UnLCBtZXNzYWdlKVxyXG5cdFx0ICAgICAgICBcdFx0aWRDaGFuID0gdGhpcy5jdXJyZW50Q2hhblxyXG5cdFx0ICAgICAgICBcdFx0dGhpcy5tZXNzYWdlID0gJydcclxuXHRcdCAgICAgICAgXHR9XHJcblx0ICAgICAgICBcdH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgfSlcclxuXHJcblx0ICAgIHNvY2tldC5vbignc3VjY2Vzc19zZW5kX21lc3NhZ2UnLCAoaWQpID0+IHtcclxuXHQgICAgXHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxfbWVzc2FnZXMnLGlkQ2hhbiApXHJcblx0ICAgIH0pXHJcblxyXG5cdCAgICBzb2NrZXQub24oJ3NlbGVjdF9jaGFuJywgKGNoYW4pID0+IHtcclxuXHQgICAgXHR2dWVjaGF0Ym94LmN1cnJlbnRDaGFuID0gY2hhbi5pZF9jaGFubmVsXHJcblx0ICAgIH0pXHJcblxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBjaGF0Ym94IiwibGV0IGhlYWRlckNoYXQgPSAoc29ja2V0KSA9PiB7XHJcblx0bGV0ICRoZWFkZXJDaGF0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlY3Rpb24tdG9wJylcclxuXHRpZigkaGVhZGVyQ2hhdCkge1xyXG5cdFx0bGV0IGlkQ2hhbiA9IDBcclxuXHRcdGxldCB2dWVoZWFkZXJDaGF0ID0gbmV3IFZ1ZSh7XHJcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxyXG5cdCAgICAgICAgZWw6ICcjc2VjdGlvbi10b3AnLFxyXG5cdCAgICAgICAgZGF0YToge1xyXG5cdCAgICAgICAgXHR0aXRsZTogJycsXHJcblx0ICAgICAgICBcdGN1cnJlbnRDaGFuOicnLFxyXG5cdCAgICAgICAgXHRkZXNjOicnXHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgbWV0aG9kczp7XHJcblx0ICAgICAgICB9XHJcblx0ICAgIH0pXHJcblxyXG5cclxuXHQgICAgc29ja2V0Lm9uKCdzZWxlY3RfY2hhbicsIChjaGFuKSA9PiB7XHJcblx0ICAgIFx0Y29uc29sZS5sb2coXCJramtua1wiLCBjaGFuKVxyXG5cdCAgICBcdHZ1ZWhlYWRlckNoYXQuY3VycmVudENoYW4gPSBjaGFuLmlkX2NoYW5uZWxcclxuXHQgICAgXHR2dWVoZWFkZXJDaGF0LnRpdGxlID0gY2hhbi5uYW1lXHJcblx0ICAgIFx0dnVlaGVhZGVyQ2hhdC5kZXNjID0gY2hhbi5kZXNjcmlwdGlvblxyXG5cdCAgICBcdGNvbnNvbGUubG9nKHZ1ZWhlYWRlckNoYXQsIHZ1ZWhlYWRlckNoYXQudGl0bGUpXHJcblx0ICAgIH0pXHJcblxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBoZWFkZXJDaGF0IiwibGV0IGxpc3RDaGFubmVscyA9IChzb2NrZXQpID0+IHtcclxuXHRsZXQgJGxpc3RDaGFubmVscyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0Q2hhbm5lbHMnKVxyXG5cdGlmKCRsaXN0Q2hhbm5lbHMpIHtcclxuXHRcdGxldCBlcnJvciA9IG51bGxcclxuXHRcdGxldCAkc2VsZWN0ZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJylcclxuXHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbHMnKVxyXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fY2hhbm5lbHMnLCAoZGF0YSk9PiB7XHJcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcclxuXHRcdFx0XHRkYXRhICA9IFtdXHJcblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gY2hhbm5lbCB0cm91dsOpLi4uJ1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCB2dWVMaXN0Q2hhbm5lbHMgPSBuZXcgVnVlKHtcclxuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcclxuXHRcdCAgICAgICAgZWw6ICcjbGlzdENoYW5uZWxzJyxcclxuXHRcdCAgICAgICAgZGF0YToge1xyXG5cdFx0ICAgICAgICBcdGNoYW5uZWxzOiBkYXRhLFxyXG5cdFx0ICAgICAgICBcdGVycm9yOiBlcnJvcixcclxuXHRcdCAgICAgICAgXHRzZWxlY3RlZDogbnVsbFxyXG5cdFx0ICAgICAgICB9LFxyXG5cdFx0ICAgICAgICBtZXRob2RzOntcclxuXHRcdCAgICAgICAgXHRzZWxlY3RDaGFuOiBmdW5jdGlvbihpZCkge1xyXG5cdFx0ICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ3NlbGVjdF9jaGFuJywgaWQpXHJcblx0XHQgICAgICAgIFx0XHRjb25zb2xlLmxvZygnZW1pdCBzZWxlY3RfY2hhbicpXHJcblx0XHQgICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxfbWVzc2FnZXMnLCBpZClcclxuXHRcdCAgICAgICAgXHR9XHJcblx0XHQgICAgICAgIH1cclxuXHRcdCAgICB9KVxyXG5cclxuXHRcdCAgICBzb2NrZXQub24oJ3NlbGVjdF9jaGFuJywgKGNoYW4pID0+IHtcclxuXHRcdCAgICBcdHZ1ZUxpc3RDaGFubmVscy5zZWxlY3RlZCA9IGNoYW4uaWRfY2hhbm5lbFxyXG5cdFx0ICAgIH0pXHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2hhbm5lbHMiLCJsZXQgbGlzdE1lc3NhZ2VzID0gKHNvY2tldCkgPT4ge1xyXG5cdGxldCAkbGlzdE1lc3NhZ2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RNZXNzYWdlcycpXHJcblx0aWYoJGxpc3RNZXNzYWdlcykge1xyXG5cdFx0bGV0IGVycm9yID0gbnVsbFxyXG5cdFx0bGV0IHZ1ZUxpc3RNZXNzYWdlcyA9IG5ldyBWdWUoe1xyXG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxyXG5cdFx0ICAgICAgICBlbDogJyNsaXN0TWVzc2FnZXMnLFxyXG5cdFx0ICAgICAgICBkYXRhOiB7XHJcblx0XHQgICAgICAgIFx0bWVzc2FnZXM6IFtdLFxyXG5cdFx0ICAgICAgICBcdGVycm9yOiBudWxsXHJcblx0XHQgICAgICAgIH1cclxuXHRcdCAgICB9KVxyXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fbWVzc2FnZXMnLCAoZGF0YSk9PiB7XHJcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcclxuXHRcdFx0XHRkYXRhICA9IFtdXHJcblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gbWVzc2FnZSB0cm91dsOpLi4uJ1xyXG5cdFx0XHR9XHJcblx0XHRcdHZ1ZUxpc3RNZXNzYWdlcy5tZXNzYWdlcyA9IGRhdGFcclxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLmVycm9yID0gZXJyb3JcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGxpc3RNZXNzYWdlcyIsImxldCBsaXN0UHJpdmF0ZXMgPSAoc29ja2V0KSA9PiB7XHJcblx0bGV0ICRsaXN0UHJpdmF0ZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdFByaXZhdGVzJylcclxuXHRpZigkbGlzdFByaXZhdGVzKSB7XHJcblx0XHRsZXQgZXJyb3IgPSBudWxsXHJcblx0XHRjb25zb2xlLmxvZyhjdXJyZW50X3VzZXIpXHJcblx0XHRWdWUuY29tcG9uZW50KCdtb2RhbCcsIHtcclxuXHRcdCAgdGVtcGxhdGU6ICcjbW9kYWwtY3JlYXRlJyxcclxuXHRcdCAgcHJvcHM6IFsnc2hvdycsICd0aXRsZSddLFxyXG5cdFx0ICBkYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdCAgICByZXR1cm4ge1xyXG5cdFx0ICAgICAgaW50ZXJuYWxTaG93OiAnJyxcclxuXHRcdCAgICAgIGludGVybmFsVGl0bGU6JycsXHJcblx0XHQgICAgICBpbnRlcm5hbERlc2M6JydcclxuXHRcdCAgICB9XHJcblx0XHQgIH0sXHJcblx0XHQgIHdhdGNoOiB7XHJcblx0XHQgICAgJ2ludGVybmFsU2hvdyc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0ICAgICAgXHRpZiAoIXRoaXMuaW50ZXJuYWxTaG93KSB7dGhpcy4kZW1pdCgnY2xvc2UnLCB0aGlzLmludGVybmFsU2hvdyl9XHJcblx0XHQgICAgfVxyXG5cdFx0ICB9LFxyXG5cdFx0ICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuXHRcdCAgICB0aGlzLmludGVybmFsU2hvdyAgPSB0aGlzLnNob3dcclxuXHRcdCAgICB0aGlzLmludGVybmFsVGl0bGUgPSB0aGlzLnRpdGxlXHJcblx0XHQgICAgdGhpcy5pbnRlcm5hbERlc2MgID0gdGhpcy5kZXNjcmlwdGlvblxyXG5cdFx0ICB9XHJcblx0XHR9KVxyXG5cclxuXHJcblx0XHRsZXQgdnVlTGlzdFByaXZhdGVzID0gbmV3IFZ1ZSh7XHJcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxyXG5cdCAgICAgICAgZWw6ICcjbGlzdFByaXZhdGVzJyxcclxuXHQgICAgICAgIGRhdGE6IHtcclxuXHQgICAgICAgIFx0cHJpdmF0ZXM6IFtdLFxyXG5cdCAgICAgICAgXHRlcnJvcjogbnVsbCxcclxuXHQgICAgICAgIFx0c2hvd01vZGFsOiBmYWxzZSxcclxuXHQgICAgICAgIFx0dGl0bGU6ICcnLFxyXG5cdCAgICAgICAgXHRkZXNjcmlwdGlvbjonJyxcclxuXHQgICAgICAgIFx0c2VsZWN0ZWQ6IG51bGxcclxuXHQgICAgICAgIH0sXHJcblx0ICAgICAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgXHRcdGNsb3NlTW9kYWw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFx0XHRcdHRoaXMuc2hvd01vZGFsID0gZmFsc2VcclxuICAgICAgICBcdFx0XHR0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbFNob3cgPSBmYWxzZVxyXG5cclxuICAgICAgICBcdFx0fSxcclxuICAgICAgICBcdFx0Y3JlYXRlTmV3Q2hhbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXHRcdFx0dGhpcy50aXRsZSA9IHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsVGl0bGVcclxuICAgICAgICBcdFx0XHR0aGlzLmRlc2NyaXB0aW9uID0gdGhpcy4kY2hpbGRyZW5bMF0uaW50ZXJuYWxEZXNjXHJcbiAgICAgICAgXHRcdFx0dGhpcy5jbG9zZU1vZGFsKClcclxuICAgICAgICBcdFx0XHRsZXQgcHJpdmF0ZUNoYW4gPSB7XHJcbiAgICAgICAgXHRcdFx0XHRpZF90eXBlOiAyLFxyXG4gICAgICAgIFx0XHRcdFx0cG9zaXRpb246IG51bGwsXHJcbiAgICAgICAgXHRcdFx0XHRuYW1lOiB0aGlzLnRpdGxlLFxyXG4gICAgICAgIFx0XHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgXHRcdFx0XHRpZF91c2VyOiBjdXJyZW50X3VzZXJcclxuICAgICAgICBcdFx0XHR9XHJcbiAgICAgICAgXHRcdFx0dGhpcy50aXRsZSA9ICcnXHJcbiAgICAgICAgXHRcdFx0dGhpcy5kZXNjcmlwdGlvbiA9ICcnXHJcbiAgICAgICAgXHRcdFx0dGhpcy4kY2hpbGRyZW5bMF0uaW50ZXJuYWxUaXRsZSA9ICcnXHJcbiAgICAgICAgXHRcdFx0dGhpcy4kY2hpbGRyZW5bMF0uaW50ZXJuYWxEZXNjID0gJydcclxuICAgICAgICBcdFx0XHRzb2NrZXQuZW1pdCgnY3JlYXRlX2NoYW5uZWwnLCBwcml2YXRlQ2hhbilcclxuXHJcbiAgICAgICAgXHRcdH0sXHJcbiAgICAgICAgXHRcdHNlbGVjdENoYW46IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgXHRcdFx0c29ja2V0LmVtaXQoJ3NlbGVjdF9jaGFuJywgaWQpXHJcbiAgICAgICAgXHRcdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVsX21lc3NhZ2VzJywgaWQpXHJcbiAgICAgICAgXHRcdH1cclxuICAgICAgICBcdH1cclxuXHQgICAgfSlcclxuXHRcdHNvY2tldC5lbWl0KCdnZXRfcHJpdmF0ZXMnLCBjdXJyZW50X3VzZXIpXHJcblx0XHRzb2NrZXQub24oJ3JldHVybl9wcml2YXRlcycsIChkYXRhKT0+IHtcclxuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdGRhdGEgID0gW11cclxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biBjaGFubmVsIHByaXbDqSdcclxuXHRcdFx0fVxyXG5cdFx0XHR2dWVMaXN0UHJpdmF0ZXMucHJpdmF0ZXMgPSBkYXRhXHJcblx0XHRcdHZ1ZUxpc3RQcml2YXRlcy5lcnJvciA9IGVycm9yXHJcblxyXG5cdFx0fSlcclxuXHJcblx0XHRzb2NrZXQub24oJ3NlbGVjdF9jaGFuJywgKGNoYW4pID0+IHtcclxuXHQgICAgXHR2dWVMaXN0UHJpdmF0ZXMuc2VsZWN0ZWQgPSBjaGFuLmlkX2NoYW5uZWxcclxuXHQgICAgfSlcclxuXHJcblxyXG5cdFx0c29ja2V0Lm9uKCdzdWNjZXNzX2NyZWF0ZV9jaGFubmVsJywgKCk9PiB7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdnZXRfcHJpdmF0ZXMnLCBjdXJyZW50X3VzZXIpXHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBsaXN0UHJpdmF0ZXMiLCJsZXQgbGlzdFVzZXJzID0gKHNvY2tldCkgPT4ge1xyXG5cdGxldCAkbGlzdFVzZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RVc2VycycpXHJcblx0aWYoJGxpc3RVc2Vycykge1xyXG5cdFx0bGV0IGVycm9yID0gbnVsbFxyXG4gICAgbGV0IHZ1ZUxpc3RVc2VycyA9IG5ldyBWdWUoe1xyXG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxyXG5cdFx0ICAgICAgICBlbDogJyNsaXN0VXNlcnMnLFxyXG5cdFx0ICAgICAgICBkYXRhOiB7XHJcblx0XHQgICAgICAgIFx0dXNlcnM6IFtdLFxyXG5cdFx0ICAgICAgICBcdGVycm9yOiBudWxsXHJcblx0XHQgICAgICAgIH0sXHJcbiAgICAgICAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgICAgICAgc2VuZEludml0ZTogZnVuY3Rpb24oaWRfdXNlcikge1xyXG4gICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCdzZW5kX2ludml0ZScsIHtjdXJyZW50X3VzZXI6IGN1cnJlbnRfdXNlciwgdXNlcl90b19pbnZpdGU6IGlkX3VzZXJ9KTsgXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBhY2NlcHRJbnZpdGU6IGZ1bmN0aW9uKGlkX3VzZXIpIHtcclxuICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnYWNjZXB0X2ludml0ZScsIHtjdXJyZW50X3VzZXI6IGN1cnJlbnRfdXNlciwgdXNlcl9pbml0aWF0b3I6IGlkX3VzZXJ9KTsgXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICByZWZ1c2VJbnZpdGU6IGZ1bmN0aW9uKGlkX3VzZXIpIHtcclxuICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgncmVmdXNlX2ludml0ZScsIHtjdXJyZW50X3VzZXI6IGN1cnJlbnRfdXNlciwgdXNlcl9pbml0aWF0b3I6IGlkX3VzZXJ9KTsgXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgfSlcclxuXHRcdHNvY2tldC5vbigncmV0dXJuX3VzZXJzJywgKGRhdGEpPT4ge1xyXG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XHJcblx0XHRcdFx0ZGF0YSAgPSBbXVxyXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIHVzZXIgdHJvdXbDqS4uLidcclxuXHRcdFx0fVxyXG4gICAgICB2dWVMaXN0VXNlcnMudXNlcnMgPSBkYXRhXHJcblx0XHRcdHZ1ZUxpc3RVc2Vycy5lcnJvciA9IGVycm9yXHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcblx0XHRcdFxyXG5cdFx0fSlcclxuICAgIFxyXG4gICAgc29ja2V0Lm9uKCdzdWNjZXNzX2ZyaWVuZF9pbnRlcnJhY3Rpb24nLCAoKSA9PiB7XHJcblx0XHQgIHNvY2tldC5lbWl0KCdnZXRfdXNlcnMnLCBjdXJyZW50X3VzZXIpXHJcbiAgICB9KVxyXG4gICAgXHJcblx0XHRzb2NrZXQuZW1pdCgnZ2V0X3VzZXJzJywgY3VycmVudF91c2VyKVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBsaXN0VXNlcnMiLCJsZXQgbG9hZGVyID0gKHNvY2tldCkgPT4ge1xyXG5cdGxldCBjdXJyZW50Q2hhblxyXG5cdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKSApIHtjdXJyZW50Q2hhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKS52YWx1ZX1cclxuXHJcblx0bGV0ICRsb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkxvYWRlcicpXHJcblx0aWYoJGxvYWRlcikge1xyXG5cdFx0bGV0ICRzdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZW5kJylbMF1cclxuXHRcdGxldCAkaW5wdXQgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbmQtbWVzc2FnZScpXHJcblx0XHRsZXQgdnVlbG9hZGVyID0gbmV3IFZ1ZSh7XHJcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxyXG5cdCAgICAgICAgZWw6ICcjbWFpbkxvYWRlcicsXHJcblx0ICAgICAgICBkYXRhOiB7XHJcblx0ICAgICAgICBcdGN1cnJlbnRDaGFuOiBjdXJyZW50Q2hhblxyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIG1ldGhvZHM6e1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICB9KVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBsb2FkZXIiLCIvL3NlY3Rpb24tcHJvZmlsZVxyXG5cclxubGV0IHByb2ZpbGUgPSAoc29ja2V0KSA9PiB7XHJcblx0bGV0ICRwcm9maWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlY3Rpb24tcHJvZmlsZScpXHJcblx0aWYoJHByb2ZpbGUpIHtcclxuXHRcdGxldCB2dWVwcm9maWxlID0gbmV3IFZ1ZSh7XHJcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxyXG5cdCAgICAgICAgZWw6ICcjc2VjdGlvbi1wcm9maWxlJyxcclxuXHQgICAgICAgIGRhdGE6IHtcclxuXHQgICAgICAgIFx0dXNlcjoge30sXHJcblxyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIG1ldGhvZHM6e1xyXG5cclxuXHQgICAgICAgIH1cclxuXHQgICAgfSlcclxuXHQgICAgc29ja2V0LmVtaXQoJ2dldF9jdXJyZW50X3VzZXInLCBjdXJyZW50X3VzZXIpXHJcblxyXG5cdCAgICBzb2NrZXQub24oJ3N1Y2Nlc3NfZ2V0X2N1cnJlbnRfdXNlcicsICh1c2VyKSA9PiB7XHJcblx0ICAgIFx0dnVlcHJvZmlsZS51c2VyID0gdXNlclxyXG5cdCAgICB9KVxyXG5cdH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBwcm9maWxlIiwiaW1wb3J0IENvb2tpZSBmcm9tICdqcy1jb29raWUnXHJcblxyXG5sZXQgc2lnbmluID0gKHNvY2tldCkgPT4ge1xyXG5cclxuXHRsZXQgdnVlU2lnbmluID0gbmV3IFZ1ZSh7XHJcblx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcclxuICAgICAgICBlbDogJyNzaWduaW4nLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICBcdGN1cnJlbnQ6J2xvZ2luJyxcclxuICAgICAgICBcdG5hbWU6JycsXHJcbiAgICAgICAgXHRlbWFpbDonJyxcclxuICAgICAgICBcdHBhc3N3b3JkOicnLFxyXG4gICAgICAgIFx0Y29uZmlybVBhc3N3b3JkOicnLFxyXG4gICAgICAgICAgICBiYXR0bGV0YWc6ICcnLFxyXG4gICAgICAgIFx0ZXJyb3JDb25maXJtUGFzc3dvcmQ6ZmFsc2UsXHJcbiAgICAgICAgXHRnbG9iYWxFcnJvcjpmYWxzZSxcclxuICAgICAgICBcdGxvYWRpbmc6ZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1ldGhvZHM6e1xyXG4gICAgICAgIFx0dG9nZ2xlOiBmdW5jdGlvbiAodG9nZ2xlKSB7XHJcbiAgICAgICAgXHRcdHRoaXMuY3VycmVudCA9IHRvZ2dsZVxyXG4gICAgICAgIFx0fSxcclxuICAgICAgICBcdGxvZ2luOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBcdFx0dGhpcy5sb2FkaW5nID0gdHJ1ZVxyXG4gICAgICAgIFx0XHRsZXQgdXNlciA9IHtcclxuICAgICAgICBcdFx0XHR1c2VybmFtZSA6IHRoaXMubmFtZSxcclxuICAgICAgICBcdFx0XHRwYXNzd29yZCA6IHRoaXMucGFzc3dvcmRcclxuICAgICAgICBcdFx0fVxyXG4gICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnY29ubmVjdF91c2VyJywgdXNlcilcclxuXHJcbiAgICAgICAgXHR9LFxyXG4gICAgICAgIFx0bmV3QWNjb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXHRcdHRoaXMubG9hZGluZyA9IHRydWVcclxuXHJcbiAgICAgICAgXHRcdGlmICh0aGlzLnBhc3N3b3JkICE9IHRoaXMuY29uZmlybVBhc3N3b3JkKSB7XHJcbiAgICAgICAgXHRcdFx0dGhpcy5lcnJvckNvbmZpcm1QYXNzd29yZCA9IHRydWVcclxuICAgICAgICBcdFx0XHR0aGlzLmxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgIFx0XHR9IGVsc2Uge1xyXG4gICAgICAgIFx0XHRcdGxldCB1c2VyID0ge1xyXG4gICAgICAgIFx0XHRcdFx0dXNlcm5hbWUgOiB0aGlzLm5hbWUsXHJcbiAgICAgICAgXHRcdFx0XHRlbWFpbDogdGhpcy5lbWFpbCxcclxuICAgICAgICBcdFx0XHRcdHBhc3N3b3JkIDogdGhpcy5wYXNzd29yZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmF0dGxldGFnOiB0aGlzLmJhdHRsZXRhZ1xyXG4gICAgICAgIFx0XHRcdH1cclxuICAgICAgICBcdFx0XHRzb2NrZXQuZW1pdCgnY3JlYXRlX3VzZXInLCB1c2VyKVxyXG4gICAgICAgIFx0XHR9XHJcbiAgICAgICAgXHR9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBzb2NrZXQub24oJ3N1Y2Nlc3NfY29ubmVjdCcsIChyZXMpPT4ge1xyXG4gICAgXHR2dWVTaWduaW4ubG9hZGluZyA9IGZhbHNlXHJcbiAgICBcdGlmIChDb29raWUuZ2V0KCdjdXJyZW50X3VzZXInKSA9PSB1bmRlZmluZWQpIHtcclxuICAgIFx0XHRDb29raWUuc2V0KCdjdXJyZW50X3VzZXInLCByZXMudXNlcklkLCB7IGV4cGlyZXM6IDcsIHBhdGg6ICcvJyB9KVxyXG4gICAgXHR9IGVsc2Uge1xyXG4gICAgXHRcdENvb2tpZS5yZW1vdmUoJ2N1cnJlbnRfdXNlcicpXHJcbiAgICBcdFx0Q29va2llLnNldCgnY3VycmVudF91c2VyJywgcmVzLnVzZXJJZCwgeyBleHBpcmVzOiA3LCBwYXRoOiAnLycgfSlcclxuICAgIFx0fVxyXG5cclxuICAgIFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHJlcy51cmxcclxuXHJcbiAgICB9KVxyXG5cclxuICAgIHNvY2tldC5vbignZXJyb3JfY29ubmVjdCcsIChlcnJvcik9PiB7XHJcbiAgICBcdHZ1ZVNpZ25pbi5nbG9iYWxFcnJvciA9IGVycm9yXHJcbiAgICBcdHZ1ZVNpZ25pbi5sb2FkaW5nID0gZmFsc2VcclxuICAgIH0pXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgc2lnbmluIiwiLyohXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4yLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llXG4gKlxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG5cdHZhciByZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSBmYWxzZTtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XG5cdFx0dmFyIE9sZENvb2tpZXMgPSB3aW5kb3cuQ29va2llcztcblx0XHR2YXIgYXBpID0gd2luZG93LkNvb2tpZXMgPSBmYWN0b3J5KCk7XG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR3aW5kb3cuQ29va2llcyA9IE9sZENvb2tpZXM7XG5cdFx0XHRyZXR1cm4gYXBpO1xuXHRcdH07XG5cdH1cbn0oZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gYXJndW1lbnRzWyBpIF07XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xuXHRcdGZ1bmN0aW9uIGFwaSAoa2V5LCB2YWx1ZSwgYXR0cmlidXRlcykge1xuXHRcdFx0dmFyIHJlc3VsdDtcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV3JpdGVcblxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGF0dHJpYnV0ZXMgPSBleHRlbmQoe1xuXHRcdFx0XHRcdHBhdGg6ICcvJ1xuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdHZhciBleHBpcmVzID0gbmV3IERhdGUoKTtcblx0XHRcdFx0XHRleHBpcmVzLnNldE1pbGxpc2Vjb25kcyhleHBpcmVzLmdldE1pbGxpc2Vjb25kcygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBleHBpcmVzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gV2UncmUgdXNpbmcgXCJleHBpcmVzXCIgYmVjYXVzZSBcIm1heC1hZ2VcIiBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFXG5cdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcyA/IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXN1bHQgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSByZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXG5cdFx0XHRcdGlmICghY29udmVydGVyLndyaXRlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHZhbHVlKSlcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlID0gY29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0a2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhrZXkpKTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9bXFwoXFwpXS9nLCBlc2NhcGUpO1xuXG5cdFx0XHRcdHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcblxuXHRcdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0XHRpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJz0nICsgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9IGtleSArICc9JyArIHZhbHVlICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVhZFxuXG5cdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRyZXN1bHQgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuXHRcdFx0Ly8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuIEFsc28gcHJldmVudHMgb2RkIHJlc3VsdCB3aGVuXG5cdFx0XHQvLyBjYWxsaW5nIFwiZ2V0KClcIlxuXHRcdFx0dmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcblx0XHRcdHZhciByZGVjb2RlID0gLyglWzAtOUEtWl17Mn0pKy9nO1xuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHRmb3IgKDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0XHR2YXIgY29va2llID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5qc29uICYmIGNvb2tpZS5jaGFyQXQoMCkgPT09ICdcIicpIHtcblx0XHRcdFx0XHRjb29raWUgPSBjb29raWUuc2xpY2UoMSwgLTEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgbmFtZSA9IHBhcnRzWzBdLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0XHRjb29raWUgPSBjb252ZXJ0ZXIucmVhZCA/XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZXIucmVhZChjb29raWUsIG5hbWUpIDogY29udmVydGVyKGNvb2tpZSwgbmFtZSkgfHxcblx0XHRcdFx0XHRcdGNvb2tpZS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5qc29uKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IGNvb2tpZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRbbmFtZV0gPSBjb29raWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGFwaS5zZXQgPSBhcGk7XG5cdFx0YXBpLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBhcGkuY2FsbChhcGksIGtleSk7XG5cdFx0fTtcblx0XHRhcGkuZ2V0SlNPTiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBhcGkuYXBwbHkoe1xuXHRcdFx0XHRqc29uOiB0cnVlXG5cdFx0XHR9LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXHRcdH07XG5cdFx0YXBpLmRlZmF1bHRzID0ge307XG5cblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xuXHRcdFx0YXBpKGtleSwgJycsIGV4dGVuZChhdHRyaWJ1dGVzLCB7XG5cdFx0XHRcdGV4cGlyZXM6IC0xXG5cdFx0XHR9KSk7XG5cdFx0fTtcblxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcblxuXHRcdHJldHVybiBhcGk7XG5cdH1cblxuXHRyZXR1cm4gaW5pdChmdW5jdGlvbiAoKSB7fSk7XG59KSk7XG4iXX0=
