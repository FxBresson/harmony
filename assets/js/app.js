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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2NoYXRib3guanMiLCJkZXYvanMvdmlld3MvY2hhdC9oZWFkZXJDaGF0LmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbGlzdENoYW5uZWxzLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbGlzdE1lc3NhZ2VzLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbGlzdFByaXZhdGVzLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbGlzdFVzZXJzLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbG9hZGVyLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvcHJvZmlsZS5qcyIsImRldi9qcy92aWV3cy9zaWduaW4uanMiLCJub2RlX21vZHVsZXMvanMtY29va2llL3NyYy9qcy5jb29raWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUlBOzs7O0FBR0E7Ozs7Ozs7O0lBR00sRztBQUVMLGdCQUFjO0FBQUE7O0FBQ1YsT0FBSyxNQUFMLEdBQWMsR0FBRyxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsR0FBdUIsT0FBMUIsQ0FBZDtBQUNIOzs7OzZCQUVVO0FBQ1YsT0FBRyxtQkFBTyxHQUFQLENBQVcsY0FBWCxNQUErQixTQUFsQyxFQUE0QztBQUFDLGFBQVMsUUFBVCxDQUFrQixJQUFsQixHQUF5QixPQUFPLFFBQVAsQ0FBZ0IsTUFBekM7QUFBZ0Q7QUFDN0YsVUFBTyxZQUFQLEdBQXNCLG1CQUFPLEdBQVAsQ0FBVyxjQUFYLENBQXRCO0FBQ0EsNEJBQVMsS0FBSyxNQUFkO0FBQ0EsK0JBQWEsS0FBSyxNQUFsQjtBQUNBLCtCQUFhLEtBQUssTUFBbEI7QUFDQSwrQkFBYSxLQUFLLE1BQWxCO0FBQ0EsMEJBQVEsS0FBSyxNQUFi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VSxHQUFWLEVBQWU7QUFDeEIsVUFBTyxJQUFJLElBQUosQ0FBUyxHQUFULEVBQWMsR0FBZCxDQUFQO0FBQ0EsR0FGRDtBQUdBLE1BQUksT0FBSixHQUFjLFlBQVk7QUFDekIsVUFBTyxJQUFJLEtBQUosQ0FBVTtBQUNoQixVQUFNO0FBRFUsSUFBVixFQUVKLEdBQUcsS0FBSCxDQUFTLElBQVQsQ0FBYyxTQUFkLENBRkksQ0FBUDtBQUdBLEdBSkQ7QUFLQSxNQUFJLFFBQUosR0FBZSxFQUFmOztBQUVBLE1BQUksTUFBSixHQUFhLFVBQVUsR0FBVixFQUFlLFVBQWYsRUFBMkI7QUFDdkMsT0FBSSxHQUFKLEVBQVMsRUFBVCxFQUFhLE9BQU8sVUFBUCxFQUFtQjtBQUMvQixhQUFTLENBQUM7QUFEcUIsSUFBbkIsQ0FBYjtBQUdBLEdBSkQ7O0FBTUEsTUFBSSxhQUFKLEdBQW9CLElBQXBCOztBQUVBLFNBQU8sR0FBUDtBQUNBOztBQUVELFFBQU8sS0FBSyxZQUFZLENBQUUsQ0FBbkIsQ0FBUDtBQUNBLENBN0pDLENBQUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHVzZXJMaXN0IFx0ZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RVc2Vycy5qcydcbmltcG9ydCBwcml2YXRlc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RQcml2YXRlcy5qcydcbmltcG9ydCBtZXNzYWdlc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RNZXNzYWdlcy5qcydcbmltcG9ydCBjaGFubmVsc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RDaGFubmVscy5qcydcbmltcG9ydCBjaGF0Ym94IFx0XHRmcm9tICcuL3ZpZXdzL2NoYXQvY2hhdGJveC5qcydcbmltcG9ydCBsb2FkZXIgXHRcdGZyb20gJy4vdmlld3MvY2hhdC9sb2FkZXIuanMnXG5pbXBvcnQgcHJvZmlsIFx0XHRmcm9tICcuL3ZpZXdzL2NoYXQvcHJvZmlsZS5qcydcbmltcG9ydCBoZWFkZXIgXHRcdGZyb20gJy4vdmlld3MvY2hhdC9oZWFkZXJDaGF0LmpzJ1xuXG5cblxuaW1wb3J0IENvb2tpZSAgICAgICBmcm9tICdqcy1jb29raWUnXG5cblxuaW1wb3J0IHNpZ25pbiAgICAgICBmcm9tICcuL3ZpZXdzL3NpZ25pbi5qcydcblxuXG5jbGFzcyBBcHAge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHQgICAgdGhpcy5zb2NrZXQgPSBpbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKyc6MzAwMCcpXG5cdH1cblxuXHRpbml0Q2hhdCgpIHtcblx0XHRpZihDb29raWUuZ2V0KCdjdXJyZW50X3VzZXInKSA9PT0gdW5kZWZpbmVkKXtkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbn1cblx0XHR3aW5kb3cuY3VycmVudF91c2VyID0gQ29va2llLmdldCgnY3VycmVudF91c2VyJylcblx0XHR1c2VyTGlzdCh0aGlzLnNvY2tldClcblx0XHRtZXNzYWdlc0xpc3QodGhpcy5zb2NrZXQpXG5cdFx0cHJpdmF0ZXNMaXN0KHRoaXMuc29ja2V0KVxuXHRcdGNoYW5uZWxzTGlzdCh0aGlzLnNvY2tldClcblx0XHRjaGF0Ym94KHRoaXMuc29ja2V0KVxuXHRcdGxvYWRlcih0aGlzLnNvY2tldClcblx0XHRwcm9maWwodGhpcy5zb2NrZXQpXG5cdFx0aGVhZGVyKHRoaXMuc29ja2V0KVxuXHR9XG5cblx0aW5pdFNpZ25pbigpIHtcblx0XHRzaWduaW4odGhpcy5zb2NrZXQpXG5cdH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKGV2ZW50KSAgPT57XG4gIFx0bGV0IGFwcCA9IG5ldyBBcHBcbiAgXHRsZXQgJGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdXG4gIFx0aWYgKCAkYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3NpZ25pbicpICkge1xuICBcdFx0aWYgKENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpKSB7XG4gIFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luKycvP2FjdGlvbj1jaGF0J1xuICBcdFx0fSBlbHNlICB7XG4gIFx0XHRcdGFwcC5pbml0U2lnbmluKClcbiAgXHRcdH1cblxuICBcdH0gZWxzZSBpZiAoJGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGF0JykpIHtcbiAgXHRcdGFwcC5pbml0Q2hhdCgpXG4gIFx0fVxuXG59KVxuXG4iLCJsZXQgY2hhdGJveCA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRjaGF0Ym94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlY3Rpb24taW5wdXQnKVxuXHRpZigkY2hhdGJveCkge1xuXHRcdGxldCBpZENoYW4gPSAwXG5cdFx0bGV0IHZ1ZWNoYXRib3ggPSBuZXcgVnVlKHtcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHQgICAgICAgIGVsOiAnI3NlY3Rpb24taW5wdXQnLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdG1lc3NhZ2U6ICcnLFxuXHQgICAgICAgIFx0Y3VycmVudENoYW46IG51bGxcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6e1xuXHQgICAgICAgIFx0c2VuZDogZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgXHQvLyBDaGVjayBpZiB0aGUgY3VycmVudCBtZXNzYWdlIGlzIGVtcHR5IG9yIG5vdFxuXHRcdFx0ICAgIFx0aWYgKHRoaXMubWVzc2FnZSAmJiB0aGlzLm1lc3NhZ2UgIT0gJycgJiYgdGhpcy5jdXJyZW50Q2hhbiAhPSBudWxsKSB7XG5cdFx0XHQgICAgXHRcdC8vIENyZWF0aW5nIGEgbmV4IG1lc3NhZ2Vcblx0XHQgICAgXHRcdCAgXHQvLyByZWluaXRpYWxpc2UgdGhlIGlucHV0IGFuZCBibHVyIGl0XG5cdFx0ICAgICAgICBcdFx0bGV0IG1lc3NhZ2UgPSB7XG5cdFx0ICAgICAgICBcdFx0XHRjb250ZW50OiB0aGlzLm1lc3NhZ2UsXG5cdFx0ICAgICAgICBcdFx0XHRpZF91c2VyOiBjdXJyZW50X3VzZXIsXG5cdFx0ICAgICAgICBcdFx0XHRpZF9jaGFubmVsOiB0aGlzLmN1cnJlbnRDaGFuLFxuXHRcdCAgICAgICAgXHRcdH1cblxuXHRcdCAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdzZW5kX21lc3NhZ2UnLCBtZXNzYWdlKVxuXHRcdCAgICAgICAgXHRcdGlkQ2hhbiA9IHRoaXMuY3VycmVudENoYW5cblx0XHQgICAgICAgIFx0XHR0aGlzLm1lc3NhZ2UgPSAnJ1xuXHRcdCAgICAgICAgXHR9XG5cdCAgICAgICAgXHR9XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblxuXHQgICAgc29ja2V0Lm9uKCdzdWNjZXNzX3NlbmRfbWVzc2FnZScsIChpZCkgPT4ge1xuXHQgICAgXHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxfbWVzc2FnZXMnLGlkQ2hhbiApXG5cdCAgICB9KVxuXG5cdCAgICBzb2NrZXQub24oJ3NlbGVjdF9jaGFuJywgKGNoYW4pID0+IHtcblx0ICAgIFx0dnVlY2hhdGJveC5jdXJyZW50Q2hhbiA9IGNoYW4uaWRfY2hhbm5lbFxuXHQgICAgfSlcblxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBjaGF0Ym94IiwibGV0IGhlYWRlckNoYXQgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkaGVhZGVyQ2hhdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWN0aW9uLXRvcCcpXG5cdGlmKCRoZWFkZXJDaGF0KSB7XG5cdFx0bGV0IGlkQ2hhbiA9IDBcblx0XHRsZXQgdnVlaGVhZGVyQ2hhdCA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjc2VjdGlvbi10b3AnLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdHRpdGxlOiAnJyxcblx0ICAgICAgICBcdGN1cnJlbnRDaGFuOicnLFxuXHQgICAgICAgIFx0ZGVzYzonJ1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgbWV0aG9kczp7XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblxuXG5cdCAgICBzb2NrZXQub24oJ3NlbGVjdF9jaGFuJywgKGNoYW4pID0+IHtcblx0ICAgIFx0Y29uc29sZS5sb2coXCJramtua1wiLCBjaGFuKVxuXHQgICAgXHR2dWVoZWFkZXJDaGF0LmN1cnJlbnRDaGFuID0gY2hhbi5pZF9jaGFubmVsXG5cdCAgICBcdHZ1ZWhlYWRlckNoYXQudGl0bGUgPSBjaGFuLm5hbWVcblx0ICAgIFx0dnVlaGVhZGVyQ2hhdC5kZXNjID0gY2hhbi5kZXNjcmlwdGlvblxuXHQgICAgXHRjb25zb2xlLmxvZyh2dWVoZWFkZXJDaGF0LCB2dWVoZWFkZXJDaGF0LnRpdGxlKVxuXHQgICAgfSlcblxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBoZWFkZXJDaGF0IiwibGV0IGxpc3RDaGFubmVscyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0Q2hhbm5lbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdENoYW5uZWxzJylcblx0aWYoJGxpc3RDaGFubmVscykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRsZXQgJHNlbGVjdGVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpXG5cdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVscycpXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fY2hhbm5lbHMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gY2hhbm5lbCB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0bGV0IHZ1ZUxpc3RDaGFubmVscyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RDaGFubmVscycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdGNoYW5uZWxzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjogZXJyb3IsXG5cdFx0ICAgICAgICBcdHNlbGVjdGVkOiBudWxsXG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgbWV0aG9kczp7XG5cdFx0ICAgICAgICBcdHNlbGVjdENoYW46IGZ1bmN0aW9uKGlkKSB7XG5cdFx0ICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ3NlbGVjdF9jaGFuJywgaWQpXG5cdFx0ICAgICAgICBcdFx0Y29uc29sZS5sb2coJ2VtaXQgc2VsZWN0X2NoYW4nKVxuXHRcdCAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbF9tZXNzYWdlcycsIGlkKVxuXHRcdCAgICAgICAgXHR9XG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cblx0XHQgICAgc29ja2V0Lm9uKCdzZWxlY3RfY2hhbicsIChjaGFuKSA9PiB7XG5cdFx0ICAgIFx0dnVlTGlzdENoYW5uZWxzLnNlbGVjdGVkID0gY2hhbi5pZF9jaGFubmVsXG5cdFx0ICAgIH0pXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdENoYW5uZWxzIiwibGV0IGxpc3RNZXNzYWdlcyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0TWVzc2FnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdE1lc3NhZ2VzJylcblx0aWYoJGxpc3RNZXNzYWdlcykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRsZXQgdnVlTGlzdE1lc3NhZ2VzID0gbmV3IFZ1ZSh7XG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHRcdCAgICAgICAgZWw6ICcjbGlzdE1lc3NhZ2VzJyxcblx0XHQgICAgICAgIGRhdGE6IHtcblx0XHQgICAgICAgIFx0bWVzc2FnZXM6IFtdLFxuXHRcdCAgICAgICAgXHRlcnJvcjogbnVsbFxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KVxuXHRcdHNvY2tldC5vbigncmV0dXJuX21lc3NhZ2VzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIG1lc3NhZ2UgdHJvdXbDqS4uLidcblx0XHRcdH1cblx0XHRcdHZ1ZUxpc3RNZXNzYWdlcy5tZXNzYWdlcyA9IGRhdGFcblx0XHRcdHZ1ZUxpc3RNZXNzYWdlcy5lcnJvciA9IGVycm9yXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdE1lc3NhZ2VzIiwibGV0IGxpc3RQcml2YXRlcyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0UHJpdmF0ZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdFByaXZhdGVzJylcblx0aWYoJGxpc3RQcml2YXRlcykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRjb25zb2xlLmxvZyhjdXJyZW50X3VzZXIpXG5cdFx0VnVlLmNvbXBvbmVudCgnbW9kYWwnLCB7XG5cdFx0ICB0ZW1wbGF0ZTogJyNtb2RhbC1jcmVhdGUnLFxuXHRcdCAgcHJvcHM6IFsnc2hvdycsICd0aXRsZSddLFxuXHRcdCAgZGF0YTogZnVuY3Rpb24oKSB7XG5cdFx0ICAgIHJldHVybiB7XG5cdFx0ICAgICAgaW50ZXJuYWxTaG93OiAnJyxcblx0XHQgICAgICBpbnRlcm5hbFRpdGxlOicnLFxuXHRcdCAgICAgIGludGVybmFsRGVzYzonJ1xuXHRcdCAgICB9XG5cdFx0ICB9LFxuXHRcdCAgd2F0Y2g6IHtcblx0XHQgICAgJ2ludGVybmFsU2hvdyc6IGZ1bmN0aW9uKCkge1xuXHRcdCAgICAgIFx0aWYgKCF0aGlzLmludGVybmFsU2hvdykge3RoaXMuJGVtaXQoJ2Nsb3NlJywgdGhpcy5pbnRlcm5hbFNob3cpfVxuXHRcdCAgICB9XG5cdFx0ICB9LFxuXHRcdCAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0ICAgIHRoaXMuaW50ZXJuYWxTaG93ICA9IHRoaXMuc2hvd1xuXHRcdCAgICB0aGlzLmludGVybmFsVGl0bGUgPSB0aGlzLnRpdGxlXG5cdFx0ICAgIHRoaXMuaW50ZXJuYWxEZXNjICA9IHRoaXMuZGVzY3JpcHRpb25cblx0XHQgIH1cblx0XHR9KVxuXG5cblx0XHRsZXQgdnVlTGlzdFByaXZhdGVzID0gbmV3IFZ1ZSh7XG5cdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0ICAgICAgICBlbDogJyNsaXN0UHJpdmF0ZXMnLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdHByaXZhdGVzOiBbXSxcblx0ICAgICAgICBcdGVycm9yOiBudWxsLFxuXHQgICAgICAgIFx0c2hvd01vZGFsOiBmYWxzZSxcblx0ICAgICAgICBcdHRpdGxlOiAnJyxcblx0ICAgICAgICBcdGRlc2NyaXB0aW9uOicnLFxuXHQgICAgICAgIFx0c2VsZWN0ZWQ6IG51bGxcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgXHRcdGNsb3NlTW9kYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdFx0XHR0aGlzLnNob3dNb2RhbCA9IGZhbHNlXG4gICAgICAgIFx0XHRcdHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsU2hvdyA9IGZhbHNlXG5cbiAgICAgICAgXHRcdH0sXG4gICAgICAgIFx0XHRjcmVhdGVOZXdDaGFuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXHRcdFx0dGhpcy50aXRsZSA9IHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsVGl0bGVcbiAgICAgICAgXHRcdFx0dGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsRGVzY1xuICAgICAgICBcdFx0XHR0aGlzLmNsb3NlTW9kYWwoKVxuICAgICAgICBcdFx0XHRsZXQgcHJpdmF0ZUNoYW4gPSB7XG4gICAgICAgIFx0XHRcdFx0aWRfdHlwZTogMixcbiAgICAgICAgXHRcdFx0XHRwb3NpdGlvbjogbnVsbCxcbiAgICAgICAgXHRcdFx0XHRuYW1lOiB0aGlzLnRpdGxlLFxuICAgICAgICBcdFx0XHRcdGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgICBcdFx0XHRcdGlkX3VzZXI6IGN1cnJlbnRfdXNlclxuICAgICAgICBcdFx0XHR9XG4gICAgICAgIFx0XHRcdHRoaXMudGl0bGUgPSAnJ1xuICAgICAgICBcdFx0XHR0aGlzLmRlc2NyaXB0aW9uID0gJydcbiAgICAgICAgXHRcdFx0dGhpcy4kY2hpbGRyZW5bMF0uaW50ZXJuYWxUaXRsZSA9ICcnXG4gICAgICAgIFx0XHRcdHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsRGVzYyA9ICcnXG4gICAgICAgIFx0XHRcdHNvY2tldC5lbWl0KCdjcmVhdGVfY2hhbm5lbCcsIHByaXZhdGVDaGFuKVxuXG4gICAgICAgIFx0XHR9LFxuICAgICAgICBcdFx0c2VsZWN0Q2hhbjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgXHRcdFx0c29ja2V0LmVtaXQoJ3NlbGVjdF9jaGFuJywgaWQpXG4gICAgICAgIFx0XHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbF9tZXNzYWdlcycsIGlkKVxuICAgICAgICBcdFx0fVxuICAgICAgICBcdH1cblx0ICAgIH0pXG5cdFx0c29ja2V0LmVtaXQoJ2dldF9wcml2YXRlcycsIGN1cnJlbnRfdXNlcilcblx0XHRzb2NrZXQub24oJ3JldHVybl9wcml2YXRlcycsIChkYXRhKT0+IHtcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biBjaGFubmVsIHByaXbDqSdcblx0XHRcdH1cblx0XHRcdHZ1ZUxpc3RQcml2YXRlcy5wcml2YXRlcyA9IGRhdGFcblx0XHRcdHZ1ZUxpc3RQcml2YXRlcy5lcnJvciA9IGVycm9yXG5cblx0XHR9KVxuXG5cdFx0c29ja2V0Lm9uKCdzZWxlY3RfY2hhbicsIChjaGFuKSA9PiB7XG5cdCAgICBcdHZ1ZUxpc3RQcml2YXRlcy5zZWxlY3RlZCA9IGNoYW4uaWRfY2hhbm5lbFxuXHQgICAgfSlcblxuXG5cdFx0c29ja2V0Lm9uKCdzdWNjZXNzX2NyZWF0ZV9jaGFubmVsJywgKCk9PiB7XG5cdFx0XHRzb2NrZXQuZW1pdCgnZ2V0X3ByaXZhdGVzJywgY3VycmVudF91c2VyKVxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RQcml2YXRlcyIsImxldCBsaXN0VXNlcnMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdFVzZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RVc2VycycpXG5cdGlmKCRsaXN0VXNlcnMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0c29ja2V0LmVtaXQoJ2dldF91c2VycycsIGN1cnJlbnRfdXNlcilcblx0XHRzb2NrZXQub24oJ3JldHVybl91c2VycycsIChkYXRhKT0+IHtcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biB1c2VyIHRyb3V2w6kuLi4nXG5cdFx0XHR9XG5cdFx0XHRsZXQgdnVlTGlzdFVzZXJzID0gbmV3IFZ1ZSh7XG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHRcdCAgICAgICAgZWw6ICcjbGlzdFVzZXJzJyxcblx0XHQgICAgICAgIGRhdGE6IHtcblx0XHQgICAgICAgIFx0dXNlcnM6IGRhdGEsXG5cdFx0ICAgICAgICBcdGVycm9yOiBlcnJvclxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KVxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RVc2VycyIsImxldCBsb2FkZXIgPSAoc29ja2V0KSA9PiB7XG5cdGxldCBjdXJyZW50Q2hhblxuXHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJykgKSB7Y3VycmVudENoYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJykudmFsdWV9XG5cblx0bGV0ICRsb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkxvYWRlcicpXG5cdGlmKCRsb2FkZXIpIHtcblx0XHRsZXQgJHN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbmQnKVswXVxuXHRcdGxldCAkaW5wdXQgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbmQtbWVzc2FnZScpXG5cdFx0bGV0IHZ1ZWxvYWRlciA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjbWFpbkxvYWRlcicsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgIFx0Y3VycmVudENoYW46IGN1cnJlbnRDaGFuXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBtZXRob2RzOntcblx0ICAgICAgICB9XG5cdCAgICB9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsb2FkZXIiLCIvL3NlY3Rpb24tcHJvZmlsZVxuXG5sZXQgcHJvZmlsZSA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRwcm9maWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlY3Rpb24tcHJvZmlsZScpXG5cdGlmKCRwcm9maWxlKSB7XG5cdFx0bGV0IHZ1ZXByb2ZpbGUgPSBuZXcgVnVlKHtcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHQgICAgICAgIGVsOiAnI3NlY3Rpb24tcHJvZmlsZScsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgIFx0dXNlcjoge30sXG5cblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6e1xuXG5cdCAgICAgICAgfVxuXHQgICAgfSlcblx0ICAgIHNvY2tldC5lbWl0KCdnZXRfY3VycmVudF91c2VyJywgY3VycmVudF91c2VyKVxuXG5cdCAgICBzb2NrZXQub24oJ3N1Y2Nlc3NfZ2V0X2N1cnJlbnRfdXNlcicsICh1c2VyKSA9PiB7XG5cdCAgICBcdHZ1ZXByb2ZpbGUudXNlciA9IHVzZXJcblx0ICAgIH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IHByb2ZpbGUiLCJpbXBvcnQgQ29va2llIGZyb20gJ2pzLWNvb2tpZSdcblxubGV0IHNpZ25pbiA9IChzb2NrZXQpID0+IHtcblxuXHRsZXQgdnVlU2lnbmluID0gbmV3IFZ1ZSh7XG5cdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG4gICAgICAgIGVsOiAnI3NpZ25pbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgXHRjdXJyZW50Oidsb2dpbicsXG4gICAgICAgIFx0bmFtZTonJyxcbiAgICAgICAgXHRlbWFpbDonJyxcbiAgICAgICAgXHRwYXNzd29yZDonJyxcbiAgICAgICAgXHRjb25maXJtUGFzc3dvcmQ6JycsXG4gICAgICAgICAgICBiYXR0bGV0YWc6ICcnLFxuICAgICAgICBcdGVycm9yQ29uZmlybVBhc3N3b3JkOmZhbHNlLFxuICAgICAgICBcdGdsb2JhbEVycm9yOmZhbHNlLFxuICAgICAgICBcdGxvYWRpbmc6ZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczp7XG4gICAgICAgIFx0dG9nZ2xlOiBmdW5jdGlvbiAodG9nZ2xlKSB7XG4gICAgICAgIFx0XHR0aGlzLmN1cnJlbnQgPSB0b2dnbGVcbiAgICAgICAgXHR9LFxuICAgICAgICBcdGxvZ2luOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXHRcdHRoaXMubG9hZGluZyA9IHRydWVcbiAgICAgICAgXHRcdGxldCB1c2VyID0ge1xuICAgICAgICBcdFx0XHR1c2VybmFtZSA6IHRoaXMubmFtZSxcbiAgICAgICAgXHRcdFx0cGFzc3dvcmQgOiB0aGlzLnBhc3N3b3JkXG4gICAgICAgIFx0XHR9XG4gICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnY29ubmVjdF91c2VyJywgdXNlcilcblxuICAgICAgICBcdH0sXG4gICAgICAgIFx0bmV3QWNjb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIFx0XHR0aGlzLmxvYWRpbmcgPSB0cnVlXG5cbiAgICAgICAgXHRcdGlmICh0aGlzLnBhc3N3b3JkICE9IHRoaXMuY29uZmlybVBhc3N3b3JkKSB7XG4gICAgICAgIFx0XHRcdHRoaXMuZXJyb3JDb25maXJtUGFzc3dvcmQgPSB0cnVlXG4gICAgICAgIFx0XHRcdHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICAgIFx0XHR9IGVsc2Uge1xuICAgICAgICBcdFx0XHRsZXQgdXNlciA9IHtcbiAgICAgICAgXHRcdFx0XHR1c2VybmFtZSA6IHRoaXMubmFtZSxcbiAgICAgICAgXHRcdFx0XHRlbWFpbDogdGhpcy5lbWFpbCxcbiAgICAgICAgXHRcdFx0XHRwYXNzd29yZCA6IHRoaXMucGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXR0bGV0YWc6IHRoaXMuYmF0dGxldGFnXG4gICAgICAgIFx0XHRcdH1cbiAgICAgICAgXHRcdFx0c29ja2V0LmVtaXQoJ2NyZWF0ZV91c2VyJywgdXNlcilcbiAgICAgICAgXHRcdH1cbiAgICAgICAgXHR9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgc29ja2V0Lm9uKCdzdWNjZXNzX2Nvbm5lY3QnLCAocmVzKT0+IHtcbiAgICBcdHZ1ZVNpZ25pbi5sb2FkaW5nID0gZmFsc2VcbiAgICBcdGlmIChDb29raWUuZ2V0KCdjdXJyZW50X3VzZXInKSA9PSB1bmRlZmluZWQpIHtcbiAgICBcdFx0Q29va2llLnNldCgnY3VycmVudF91c2VyJywgcmVzLnVzZXJJZCwgeyBleHBpcmVzOiA3LCBwYXRoOiAnLycgfSlcbiAgICBcdH0gZWxzZSB7XG4gICAgXHRcdENvb2tpZS5yZW1vdmUoJ2N1cnJlbnRfdXNlcicpXG4gICAgXHRcdENvb2tpZS5zZXQoJ2N1cnJlbnRfdXNlcicsIHJlcy51c2VySWQsIHsgZXhwaXJlczogNywgcGF0aDogJy8nIH0pXG4gICAgXHR9XG5cbiAgICBcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSByZXMudXJsXG5cbiAgICB9KVxuXG4gICAgc29ja2V0Lm9uKCdlcnJvcl9jb25uZWN0JywgKGVycm9yKT0+IHtcbiAgICBcdHZ1ZVNpZ25pbi5nbG9iYWxFcnJvciA9IGVycm9yXG4gICAgXHR2dWVTaWduaW4ubG9hZGluZyA9IGZhbHNlXG4gICAgfSlcbn1cbmV4cG9ydCBkZWZhdWx0IHNpZ25pbiIsIi8qIVxuICogSmF2YVNjcmlwdCBDb29raWUgdjIuMi4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vanMtY29va2llL2pzLWNvb2tpZVxuICpcbiAqIENvcHlyaWdodCAyMDA2LCAyMDE1IEtsYXVzIEhhcnRsICYgRmFnbmVyIEJyYWNrXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuOyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuXHR2YXIgcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gZmFsc2U7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoZmFjdG9yeSk7XG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcblx0fVxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcblx0fVxuXHRpZiAoIXJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlcikge1xuXHRcdHZhciBPbGRDb29raWVzID0gd2luZG93LkNvb2tpZXM7XG5cdFx0dmFyIGFwaSA9IHdpbmRvdy5Db29raWVzID0gZmFjdG9yeSgpO1xuXHRcdGFwaS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0d2luZG93LkNvb2tpZXMgPSBPbGRDb29raWVzO1xuXHRcdFx0cmV0dXJuIGFwaTtcblx0XHR9O1xuXHR9XG59KGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gZXh0ZW5kICgpIHtcblx0XHR2YXIgaSA9IDA7XG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdGZvciAoOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IGFyZ3VtZW50c1sgaSBdO1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0cmVzdWx0W2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0IChjb252ZXJ0ZXIpIHtcblx0XHRmdW5jdGlvbiBhcGkgKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcblx0XHRcdHZhciByZXN1bHQ7XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdyaXRlXG5cblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRhdHRyaWJ1dGVzID0gZXh0ZW5kKHtcblx0XHRcdFx0XHRwYXRoOiAnLydcblx0XHRcdFx0fSwgYXBpLmRlZmF1bHRzLCBhdHRyaWJ1dGVzKTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHR2YXIgZXhwaXJlcyA9IG5ldyBEYXRlKCk7XG5cdFx0XHRcdFx0ZXhwaXJlcy5zZXRNaWxsaXNlY29uZHMoZXhwaXJlcy5nZXRNaWxsaXNlY29uZHMoKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGUrNSk7XG5cdFx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gZXhwaXJlcztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFdlJ3JlIHVzaW5nIFwiZXhwaXJlc1wiIGJlY2F1c2UgXCJtYXgtYWdlXCIgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxuXHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBhdHRyaWJ1dGVzLmV4cGlyZXMgPyBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKSA6ICcnO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuXHRcdFx0XHRcdGlmICgvXltcXHtcXFtdLy50ZXN0KHJlc3VsdCkpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0gcmVzdWx0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblxuXHRcdFx0XHRpZiAoIWNvbnZlcnRlci53cml0ZSkge1xuXHRcdFx0XHRcdHZhbHVlID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyh2YWx1ZSkpXG5cdFx0XHRcdFx0XHQucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnwzQXwzQ3wzRXwzRHwyRnwzRnw0MHw1Qnw1RHw1RXw2MHw3Qnw3RHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGNvbnZlcnRlci53cml0ZSh2YWx1ZSwga2V5KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGtleSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcoa2V5KSk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDVFfDYwfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvW1xcKFxcKV0vZywgZXNjYXBlKTtcblxuXHRcdFx0XHR2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG5cblx0XHRcdFx0Zm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIChkb2N1bWVudC5jb29raWUgPSBrZXkgKyAnPScgKyB2YWx1ZSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlYWRcblxuXHRcdFx0aWYgKCFrZXkpIHtcblx0XHRcdFx0cmVzdWx0ID0ge307XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLiBBbHNvIHByZXZlbnRzIG9kZCByZXN1bHQgd2hlblxuXHRcdFx0Ly8gY2FsbGluZyBcImdldCgpXCJcblx0XHRcdHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG5cdFx0XHR2YXIgcmRlY29kZSA9IC8oJVswLTlBLVpdezJ9KSsvZztcblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0Zm9yICg7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcblx0XHRcdFx0dmFyIGNvb2tpZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuXHRcdFx0XHRpZiAoIXRoaXMuanNvbiAmJiBjb29raWUuY2hhckF0KDApID09PSAnXCInKSB7XG5cdFx0XHRcdFx0Y29va2llID0gY29va2llLnNsaWNlKDEsIC0xKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIG5hbWUgPSBwYXJ0c1swXS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdFx0Y29va2llID0gY29udmVydGVyLnJlYWQgP1xuXHRcdFx0XHRcdFx0Y29udmVydGVyLnJlYWQoY29va2llLCBuYW1lKSA6IGNvbnZlcnRlcihjb29raWUsIG5hbWUpIHx8XG5cdFx0XHRcdFx0XHRjb29raWUucmVwbGFjZShyZGVjb2RlLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuanNvbikge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0Y29va2llID0gSlNPTi5wYXJzZShjb29raWUpO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoa2V5ID09PSBuYW1lKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBjb29raWU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0W25hbWVdID0gY29va2llO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cblx0XHRhcGkuc2V0ID0gYXBpO1xuXHRcdGFwaS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoYXBpLCBrZXkpO1xuXHRcdH07XG5cdFx0YXBpLmdldEpTT04gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gYXBpLmFwcGx5KHtcblx0XHRcdFx0anNvbjogdHJ1ZVxuXHRcdFx0fSwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblx0XHR9O1xuXHRcdGFwaS5kZWZhdWx0cyA9IHt9O1xuXG5cdFx0YXBpLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXksIGF0dHJpYnV0ZXMpIHtcblx0XHRcdGFwaShrZXksICcnLCBleHRlbmQoYXR0cmlidXRlcywge1xuXHRcdFx0XHRleHBpcmVzOiAtMVxuXHRcdFx0fSkpO1xuXHRcdH07XG5cblx0XHRhcGkud2l0aENvbnZlcnRlciA9IGluaXQ7XG5cblx0XHRyZXR1cm4gYXBpO1xuXHR9XG5cblx0cmV0dXJuIGluaXQoZnVuY3Rpb24gKCkge30pO1xufSkpO1xuIl19
