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
			if (id != idChan) {
				socket.emit('add_channel_notification', id);
			} else {
				socket.emit('get_channel_messages', idChan);
			}
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
		var vueListChannels = new Vue({
			delimiters: ['${', '}'],
			el: '#listChannels',
			data: {
				channels: [],
				error: null,
				selected: null
			},
			methods: {
				selectChan: function selectChan(id) {

					socket.emit('select_chan', id);
					socket.emit('get_channel_messages', id);
				}
			}
		});

		socket.on('select_chan', function (chan) {
			var chans = JSON.parse(JSON.stringify(vueListChannels.channels));
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = chans[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var c = _step.value;

					if (c.id_channel == chan) {
						c.notification = undefined;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			vueListChannels.channels = chans;
			vueListChannels.selected = chan.id_channel;
		});

		socket.on('add_channel_notification', function (id) {
			var chans = JSON.parse(JSON.stringify(vueListChannels.channels));
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = chans[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var chan = _step2.value;

					if (chan.id_channel == id) {
						if (chan.notification) {
							chan.notification++;
						} else {
							chan.notification = 1;
						}
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			vueListChannels.channels = chans;
		});
		socket.on('return_channels', function (data) {
			if (data === null) {
				data = [];
				error = 'Aucun channel trouvé...';
			}
			vueListChannels.channels = data;
			vueListChannels.error = error;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2NoYXRib3guanMiLCJkZXYvanMvdmlld3MvY2hhdC9oZWFkZXJDaGF0LmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbGlzdENoYW5uZWxzLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbGlzdE1lc3NhZ2VzLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbGlzdFByaXZhdGVzLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbGlzdFVzZXJzLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbG9hZGVyLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvcHJvZmlsZS5qcyIsImRldi9qcy92aWV3cy9zaWduaW4uanMiLCJub2RlX21vZHVsZXMvanMtY29va2llL3NyYy9qcy5jb29raWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUlBOzs7O0FBR0E7Ozs7Ozs7O0lBR00sRztBQUVMLGdCQUFjO0FBQUE7O0FBQ1YsT0FBSyxNQUFMLEdBQWMsR0FBRyxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsR0FBdUIsT0FBMUIsQ0FBZDtBQUNIOzs7OzZCQUVVO0FBQ1YsT0FBRyxtQkFBTyxHQUFQLENBQVcsY0FBWCxNQUErQixTQUFsQyxFQUE0QztBQUFDLGFBQVMsUUFBVCxDQUFrQixJQUFsQixHQUF5QixPQUFPLFFBQVAsQ0FBZ0IsTUFBekM7QUFBZ0Q7QUFDN0YsVUFBTyxZQUFQLEdBQXNCLG1CQUFPLEdBQVAsQ0FBVyxjQUFYLENBQXRCO0FBQ0EsNEJBQVMsS0FBSyxNQUFkO0FBQ0EsK0JBQWEsS0FBSyxNQUFsQjtBQUNBLCtCQUFhLEtBQUssTUFBbEI7QUFDQSwrQkFBYSxLQUFLLE1BQWxCO0FBQ0EsMEJBQVEsS0FBSyxNQUFi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LENBQUUsQ0FBbkIsQ0FBUDtBQUNBLENBN0pDLENBQUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHVzZXJMaXN0IFx0ZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RVc2Vycy5qcydcbmltcG9ydCBwcml2YXRlc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RQcml2YXRlcy5qcydcbmltcG9ydCBtZXNzYWdlc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RNZXNzYWdlcy5qcydcbmltcG9ydCBjaGFubmVsc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RDaGFubmVscy5qcydcbmltcG9ydCBjaGF0Ym94IFx0XHRmcm9tICcuL3ZpZXdzL2NoYXQvY2hhdGJveC5qcydcbmltcG9ydCBsb2FkZXIgXHRcdGZyb20gJy4vdmlld3MvY2hhdC9sb2FkZXIuanMnXG5pbXBvcnQgcHJvZmlsIFx0XHRmcm9tICcuL3ZpZXdzL2NoYXQvcHJvZmlsZS5qcydcbmltcG9ydCBoZWFkZXIgXHRcdGZyb20gJy4vdmlld3MvY2hhdC9oZWFkZXJDaGF0LmpzJ1xuXG5cblxuaW1wb3J0IENvb2tpZSAgICAgICBmcm9tICdqcy1jb29raWUnXG5cblxuaW1wb3J0IHNpZ25pbiAgICAgICBmcm9tICcuL3ZpZXdzL3NpZ25pbi5qcydcblxuXG5jbGFzcyBBcHAge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHQgICAgdGhpcy5zb2NrZXQgPSBpbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKyc6MzAwMCcpXG5cdH1cblxuXHRpbml0Q2hhdCgpIHtcblx0XHRpZihDb29raWUuZ2V0KCdjdXJyZW50X3VzZXInKSA9PT0gdW5kZWZpbmVkKXtkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbn1cblx0XHR3aW5kb3cuY3VycmVudF91c2VyID0gQ29va2llLmdldCgnY3VycmVudF91c2VyJylcblx0XHR1c2VyTGlzdCh0aGlzLnNvY2tldClcblx0XHRtZXNzYWdlc0xpc3QodGhpcy5zb2NrZXQpXG5cdFx0cHJpdmF0ZXNMaXN0KHRoaXMuc29ja2V0KVxuXHRcdGNoYW5uZWxzTGlzdCh0aGlzLnNvY2tldClcblx0XHRjaGF0Ym94KHRoaXMuc29ja2V0KVxuXHRcdGxvYWRlcih0aGlzLnNvY2tldClcblx0XHRwcm9maWwodGhpcy5zb2NrZXQpXG5cdFx0aGVhZGVyKHRoaXMuc29ja2V0KVxuXHR9XG5cblx0aW5pdFNpZ25pbigpIHtcblx0XHRzaWduaW4odGhpcy5zb2NrZXQpXG5cdH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKGV2ZW50KSAgPT57XG4gIFx0bGV0IGFwcCA9IG5ldyBBcHBcbiAgXHRsZXQgJGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdXG4gIFx0aWYgKCAkYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3NpZ25pbicpICkge1xuICBcdFx0aWYgKENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpKSB7XG4gIFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luKycvP2FjdGlvbj1jaGF0J1xuICBcdFx0fSBlbHNlICB7XG4gIFx0XHRcdGFwcC5pbml0U2lnbmluKClcbiAgXHRcdH1cblxuICBcdH0gZWxzZSBpZiAoJGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGF0JykpIHtcbiAgXHRcdGFwcC5pbml0Q2hhdCgpXG4gIFx0fVxuXG59KVxuXG4iLCJsZXQgY2hhdGJveCA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRjaGF0Ym94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlY3Rpb24taW5wdXQnKVxuXHRpZigkY2hhdGJveCkge1xuXHRcdGxldCBpZENoYW4gPSAwXG5cdFx0bGV0IHZ1ZWNoYXRib3ggPSBuZXcgVnVlKHtcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHQgICAgICAgIGVsOiAnI3NlY3Rpb24taW5wdXQnLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdG1lc3NhZ2U6ICcnLFxuXHQgICAgICAgIFx0Y3VycmVudENoYW46IG51bGxcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6e1xuXHQgICAgICAgIFx0c2VuZDogZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgXHQvLyBDaGVjayBpZiB0aGUgY3VycmVudCBtZXNzYWdlIGlzIGVtcHR5IG9yIG5vdFxuXHRcdFx0ICAgIFx0aWYgKHRoaXMubWVzc2FnZSAmJiB0aGlzLm1lc3NhZ2UgIT0gJycgJiYgdGhpcy5jdXJyZW50Q2hhbiAhPSBudWxsKSB7XG5cdFx0XHQgICAgXHRcdC8vIENyZWF0aW5nIGEgbmV4IG1lc3NhZ2Vcblx0XHQgICAgXHRcdCAgXHQvLyByZWluaXRpYWxpc2UgdGhlIGlucHV0IGFuZCBibHVyIGl0XG5cdFx0ICAgICAgICBcdFx0bGV0IG1lc3NhZ2UgPSB7XG5cdFx0ICAgICAgICBcdFx0XHRjb250ZW50OiB0aGlzLm1lc3NhZ2UsXG5cdFx0ICAgICAgICBcdFx0XHRpZF91c2VyOiBjdXJyZW50X3VzZXIsXG5cdFx0ICAgICAgICBcdFx0XHRpZF9jaGFubmVsOiB0aGlzLmN1cnJlbnRDaGFuLFxuXHRcdCAgICAgICAgXHRcdH1cblxuXHRcdCAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdzZW5kX21lc3NhZ2UnLCBtZXNzYWdlKVxuXHRcdCAgICAgICAgXHRcdGlkQ2hhbiA9IHRoaXMuY3VycmVudENoYW5cblx0XHQgICAgICAgIFx0XHR0aGlzLm1lc3NhZ2UgPSAnJ1xuXHRcdCAgICAgICAgXHR9XG5cdCAgICAgICAgXHR9XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblxuXHQgICAgc29ja2V0Lm9uKCdzdWNjZXNzX3NlbmRfbWVzc2FnZScsIChpZCkgPT4ge1xuXHQgICAgXHRpZihpZCAhPSBpZENoYW4pIHtcblx0ICAgIFx0XHRzb2NrZXQuZW1pdCgnYWRkX2NoYW5uZWxfbm90aWZpY2F0aW9uJywgaWQgKVxuXHQgICAgXHR9IGVsc2Uge1xuXHQgICAgXHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbF9tZXNzYWdlcycsaWRDaGFuIClcblx0ICAgIFx0fVxuXHQgICAgfSlcblxuXHQgICAgc29ja2V0Lm9uKCdzZWxlY3RfY2hhbicsIChjaGFuKSA9PiB7XG5cdCAgICBcdHZ1ZWNoYXRib3guY3VycmVudENoYW4gPSBjaGFuLmlkX2NoYW5uZWxcblx0ICAgIH0pXG5cblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgY2hhdGJveCIsImxldCBoZWFkZXJDaGF0ID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGhlYWRlckNoYXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VjdGlvbi10b3AnKVxuXHRpZigkaGVhZGVyQ2hhdCkge1xuXHRcdGxldCBpZENoYW4gPSAwXG5cdFx0bGV0IHZ1ZWhlYWRlckNoYXQgPSBuZXcgVnVlKHtcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHQgICAgICAgIGVsOiAnI3NlY3Rpb24tdG9wJyxcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgXHR0aXRsZTogJycsXG5cdCAgICAgICAgXHRjdXJyZW50Q2hhbjonJyxcblx0ICAgICAgICBcdGRlc2M6Jydcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6e1xuXHQgICAgICAgIH1cblx0ICAgIH0pXG5cblxuXHQgICAgc29ja2V0Lm9uKCdzZWxlY3RfY2hhbicsIChjaGFuKSA9PiB7XG5cdCAgICBcdGNvbnNvbGUubG9nKFwia2prbmtcIiwgY2hhbilcblx0ICAgIFx0dnVlaGVhZGVyQ2hhdC5jdXJyZW50Q2hhbiA9IGNoYW4uaWRfY2hhbm5lbFxuXHQgICAgXHR2dWVoZWFkZXJDaGF0LnRpdGxlID0gY2hhbi5uYW1lXG5cdCAgICBcdHZ1ZWhlYWRlckNoYXQuZGVzYyA9IGNoYW4uZGVzY3JpcHRpb25cblx0ICAgIFx0Y29uc29sZS5sb2codnVlaGVhZGVyQ2hhdCwgdnVlaGVhZGVyQ2hhdC50aXRsZSlcblx0ICAgIH0pXG5cblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgaGVhZGVyQ2hhdCIsImxldCBsaXN0Q2hhbm5lbHMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdENoYW5uZWxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RDaGFubmVscycpXG5cdGlmKCRsaXN0Q2hhbm5lbHMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0bGV0ICRzZWxlY3RlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKVxuXHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbHMnKVxuXHRcdGxldCB2dWVMaXN0Q2hhbm5lbHMgPSBuZXcgVnVlKHtcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHQgICAgICAgIGVsOiAnI2xpc3RDaGFubmVscycsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgIFx0Y2hhbm5lbHM6IFtdLFxuXHQgICAgICAgIFx0ZXJyb3I6IG51bGwsXG5cdCAgICAgICAgXHRzZWxlY3RlZDogbnVsbFxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgbWV0aG9kczp7XG5cdCAgICAgICAgXHRzZWxlY3RDaGFuOiBmdW5jdGlvbihpZCkge1xuXG5cdCAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdzZWxlY3RfY2hhbicsIGlkKVxuXHQgICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxfbWVzc2FnZXMnLCBpZClcblx0ICAgICAgICBcdH1cblx0ICAgICAgICB9XG5cdCAgICB9KVxuXG5cdFx0c29ja2V0Lm9uKCdzZWxlY3RfY2hhbicsIChjaGFuKSA9PiB7XG5cdFx0XHRsZXQgY2hhbnMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZ1ZUxpc3RDaGFubmVscy5jaGFubmVscykpXG5cdFx0XHRmb3IoIGxldCBjIG9mIGNoYW5zICl7XG5cdFx0XHRcdGlmIChjLmlkX2NoYW5uZWwgPT0gY2hhbikge1xuXHRcdFx0XHRcdGMubm90aWZpY2F0aW9uID0gdW5kZWZpbmVkXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHZ1ZUxpc3RDaGFubmVscy5jaGFubmVscyA9IGNoYW5zXG5cdCAgICBcdHZ1ZUxpc3RDaGFubmVscy5zZWxlY3RlZCA9IGNoYW4uaWRfY2hhbm5lbFxuXHQgICAgfSlcblxuXHQgICAgc29ja2V0Lm9uKCdhZGRfY2hhbm5lbF9ub3RpZmljYXRpb24nLCAoaWQpID0+IHtcblx0ICAgIFx0bGV0IGNoYW5zID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh2dWVMaXN0Q2hhbm5lbHMuY2hhbm5lbHMpKVxuXHQgICAgXHRmb3IoIGxldCBjaGFuIG9mIGNoYW5zICl7XG5cdCAgICBcdFx0aWYgKGNoYW4uaWRfY2hhbm5lbCA9PSBpZCkge1xuXHQgICAgXHRcdFx0aWYgKGNoYW4ubm90aWZpY2F0aW9uKSB7XG5cdCAgICBcdFx0XHRcdGNoYW4ubm90aWZpY2F0aW9uICsrXG5cdCAgICBcdFx0XHR9IGVsc2Uge1xuXHQgICAgXHRcdFx0XHRjaGFuLm5vdGlmaWNhdGlvbiA9IDFcblx0ICAgIFx0XHRcdH1cblx0ICAgIFx0XHR9XG5cdCAgICBcdH1cblx0ICAgIFx0dnVlTGlzdENoYW5uZWxzLmNoYW5uZWxzID0gY2hhbnNcblxuXHQgICAgfSlcblx0XHRzb2NrZXQub24oJ3JldHVybl9jaGFubmVscycsIChkYXRhKT0+IHtcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biBjaGFubmVsIHRyb3V2w6kuLi4nXG5cdFx0XHR9XG5cdFx0XHR2dWVMaXN0Q2hhbm5lbHMuY2hhbm5lbHMgPSBkYXRhXG5cdFx0XHR2dWVMaXN0Q2hhbm5lbHMuZXJyb3IgPSBlcnJvclxuXG5cblxuXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdENoYW5uZWxzIiwibGV0IGxpc3RNZXNzYWdlcyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0TWVzc2FnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdE1lc3NhZ2VzJylcblx0aWYoJGxpc3RNZXNzYWdlcykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRsZXQgdnVlTGlzdE1lc3NhZ2VzID0gbmV3IFZ1ZSh7XG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHRcdCAgICAgICAgZWw6ICcjbGlzdE1lc3NhZ2VzJyxcblx0XHQgICAgICAgIGRhdGE6IHtcblx0XHQgICAgICAgIFx0bWVzc2FnZXM6IFtdLFxuXHRcdCAgICAgICAgXHRlcnJvcjogbnVsbFxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KVxuXHRcdHNvY2tldC5vbigncmV0dXJuX21lc3NhZ2VzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIG1lc3NhZ2UgdHJvdXbDqS4uLidcblx0XHRcdH1cblx0XHRcdHZ1ZUxpc3RNZXNzYWdlcy5tZXNzYWdlcyA9IGRhdGFcblx0XHRcdHZ1ZUxpc3RNZXNzYWdlcy5lcnJvciA9IGVycm9yXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdE1lc3NhZ2VzIiwibGV0IGxpc3RQcml2YXRlcyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0UHJpdmF0ZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdFByaXZhdGVzJylcblx0aWYoJGxpc3RQcml2YXRlcykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRjb25zb2xlLmxvZyhjdXJyZW50X3VzZXIpXG5cdFx0VnVlLmNvbXBvbmVudCgnbW9kYWwnLCB7XG5cdFx0ICB0ZW1wbGF0ZTogJyNtb2RhbC1jcmVhdGUnLFxuXHRcdCAgcHJvcHM6IFsnc2hvdycsICd0aXRsZSddLFxuXHRcdCAgZGF0YTogZnVuY3Rpb24oKSB7XG5cdFx0ICAgIHJldHVybiB7XG5cdFx0ICAgICAgaW50ZXJuYWxTaG93OiAnJyxcblx0XHQgICAgICBpbnRlcm5hbFRpdGxlOicnLFxuXHRcdCAgICAgIGludGVybmFsRGVzYzonJ1xuXHRcdCAgICB9XG5cdFx0ICB9LFxuXHRcdCAgd2F0Y2g6IHtcblx0XHQgICAgJ2ludGVybmFsU2hvdyc6IGZ1bmN0aW9uKCkge1xuXHRcdCAgICAgIFx0aWYgKCF0aGlzLmludGVybmFsU2hvdykge3RoaXMuJGVtaXQoJ2Nsb3NlJywgdGhpcy5pbnRlcm5hbFNob3cpfVxuXHRcdCAgICB9XG5cdFx0ICB9LFxuXHRcdCAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XG5cdFx0ICAgIHRoaXMuaW50ZXJuYWxTaG93ICA9IHRoaXMuc2hvd1xuXHRcdCAgICB0aGlzLmludGVybmFsVGl0bGUgPSB0aGlzLnRpdGxlXG5cdFx0ICAgIHRoaXMuaW50ZXJuYWxEZXNjICA9IHRoaXMuZGVzY3JpcHRpb25cblx0XHQgIH1cblx0XHR9KVxuXG5cblx0XHRsZXQgdnVlTGlzdFByaXZhdGVzID0gbmV3IFZ1ZSh7XG5cdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0ICAgICAgICBlbDogJyNsaXN0UHJpdmF0ZXMnLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdHByaXZhdGVzOiBbXSxcblx0ICAgICAgICBcdGVycm9yOiBudWxsLFxuXHQgICAgICAgIFx0c2hvd01vZGFsOiBmYWxzZSxcblx0ICAgICAgICBcdHRpdGxlOiAnJyxcblx0ICAgICAgICBcdGRlc2NyaXB0aW9uOicnLFxuXHQgICAgICAgIFx0c2VsZWN0ZWQ6IG51bGxcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgXHRcdGNsb3NlTW9kYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdFx0XHR0aGlzLnNob3dNb2RhbCA9IGZhbHNlXG4gICAgICAgIFx0XHRcdHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsU2hvdyA9IGZhbHNlXG5cbiAgICAgICAgXHRcdH0sXG4gICAgICAgIFx0XHRjcmVhdGVOZXdDaGFuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXHRcdFx0dGhpcy50aXRsZSA9IHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsVGl0bGVcbiAgICAgICAgXHRcdFx0dGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsRGVzY1xuICAgICAgICBcdFx0XHR0aGlzLmNsb3NlTW9kYWwoKVxuICAgICAgICBcdFx0XHRsZXQgcHJpdmF0ZUNoYW4gPSB7XG4gICAgICAgIFx0XHRcdFx0aWRfdHlwZTogMixcbiAgICAgICAgXHRcdFx0XHRwb3NpdGlvbjogbnVsbCxcbiAgICAgICAgXHRcdFx0XHRuYW1lOiB0aGlzLnRpdGxlLFxuICAgICAgICBcdFx0XHRcdGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgICBcdFx0XHRcdGlkX3VzZXI6IGN1cnJlbnRfdXNlclxuICAgICAgICBcdFx0XHR9XG4gICAgICAgIFx0XHRcdHRoaXMudGl0bGUgPSAnJ1xuICAgICAgICBcdFx0XHR0aGlzLmRlc2NyaXB0aW9uID0gJydcbiAgICAgICAgXHRcdFx0dGhpcy4kY2hpbGRyZW5bMF0uaW50ZXJuYWxUaXRsZSA9ICcnXG4gICAgICAgIFx0XHRcdHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsRGVzYyA9ICcnXG4gICAgICAgIFx0XHRcdHNvY2tldC5lbWl0KCdjcmVhdGVfY2hhbm5lbCcsIHByaXZhdGVDaGFuKVxuXG4gICAgICAgIFx0XHR9LFxuICAgICAgICBcdFx0c2VsZWN0Q2hhbjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgXHRcdFx0c29ja2V0LmVtaXQoJ3NlbGVjdF9jaGFuJywgaWQpXG4gICAgICAgIFx0XHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbF9tZXNzYWdlcycsIGlkKVxuICAgICAgICBcdFx0fVxuICAgICAgICBcdH1cblx0ICAgIH0pXG5cdFx0c29ja2V0LmVtaXQoJ2dldF9wcml2YXRlcycsIGN1cnJlbnRfdXNlcilcblx0XHRzb2NrZXQub24oJ3JldHVybl9wcml2YXRlcycsIChkYXRhKT0+IHtcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biBjaGFubmVsIHByaXbDqSdcblx0XHRcdH1cblx0XHRcdHZ1ZUxpc3RQcml2YXRlcy5wcml2YXRlcyA9IGRhdGFcblx0XHRcdHZ1ZUxpc3RQcml2YXRlcy5lcnJvciA9IGVycm9yXG5cblx0XHR9KVxuXG5cdFx0c29ja2V0Lm9uKCdzZWxlY3RfY2hhbicsIChjaGFuKSA9PiB7XG5cdCAgICBcdHZ1ZUxpc3RQcml2YXRlcy5zZWxlY3RlZCA9IGNoYW4uaWRfY2hhbm5lbFxuXHQgICAgfSlcblxuXG5cdFx0c29ja2V0Lm9uKCdzdWNjZXNzX2NyZWF0ZV9jaGFubmVsJywgKCk9PiB7XG5cdFx0XHRzb2NrZXQuZW1pdCgnZ2V0X3ByaXZhdGVzJywgY3VycmVudF91c2VyKVxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RQcml2YXRlcyIsImxldCBsaXN0VXNlcnMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdFVzZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RVc2VycycpXG5cdGlmKCRsaXN0VXNlcnMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG4gICAgbGV0IHZ1ZUxpc3RVc2VycyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RVc2VycycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdHVzZXJzOiBbXSxcblx0XHQgICAgICAgIFx0ZXJyb3I6IG51bGxcblx0XHQgICAgICAgIH0sXG4gICAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgICBzZW5kSW52aXRlOiBmdW5jdGlvbihpZF91c2VyKSB7XG4gICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCdzZW5kX2ludml0ZScsIHtjdXJyZW50X3VzZXI6IGN1cnJlbnRfdXNlciwgdXNlcl90b19pbnZpdGU6IGlkX3VzZXJ9KTsgXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGFjY2VwdEludml0ZTogZnVuY3Rpb24oaWRfdXNlcikge1xuICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnYWNjZXB0X2ludml0ZScsIHtjdXJyZW50X3VzZXI6IGN1cnJlbnRfdXNlciwgdXNlcl9pbml0aWF0b3I6IGlkX3VzZXJ9KTsgXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlZnVzZUludml0ZTogZnVuY3Rpb24oaWRfdXNlcikge1xuICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgncmVmdXNlX2ludml0ZScsIHtjdXJyZW50X3VzZXI6IGN1cnJlbnRfdXNlciwgdXNlcl9pbml0aWF0b3I6IGlkX3VzZXJ9KTsgXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgfSlcblx0XHRzb2NrZXQub24oJ3JldHVybl91c2VycycsIChkYXRhKT0+IHtcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biB1c2VyIHRyb3V2w6kuLi4nXG5cdFx0XHR9XG4gICAgICB2dWVMaXN0VXNlcnMudXNlcnMgPSBkYXRhXG5cdFx0XHR2dWVMaXN0VXNlcnMuZXJyb3IgPSBlcnJvclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcblx0XHRcdFxuXHRcdH0pXG4gICAgXG4gICAgc29ja2V0Lm9uKCdzdWNjZXNzX2ZyaWVuZF9pbnRlcnJhY3Rpb24nLCAoKSA9PiB7XG5cdFx0ICBzb2NrZXQuZW1pdCgnZ2V0X3VzZXJzJywgY3VycmVudF91c2VyKVxuICAgIH0pXG4gICAgXG5cdFx0c29ja2V0LmVtaXQoJ2dldF91c2VycycsIGN1cnJlbnRfdXNlcilcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdFVzZXJzIiwibGV0IGxvYWRlciA9IChzb2NrZXQpID0+IHtcblx0bGV0IGN1cnJlbnRDaGFuXG5cdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKSApIHtjdXJyZW50Q2hhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKS52YWx1ZX1cblxuXHRsZXQgJGxvYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluTG9hZGVyJylcblx0aWYoJGxvYWRlcikge1xuXHRcdGxldCAkc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VuZCcpWzBdXG5cdFx0bGV0ICRpbnB1dCAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VuZC1tZXNzYWdlJylcblx0XHRsZXQgdnVlbG9hZGVyID0gbmV3IFZ1ZSh7XG5cdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0ICAgICAgICBlbDogJyNtYWluTG9hZGVyJyxcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgXHRjdXJyZW50Q2hhbjogY3VycmVudENoYW5cblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6e1xuXHQgICAgICAgIH1cblx0ICAgIH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxvYWRlciIsIi8vc2VjdGlvbi1wcm9maWxlXG5cbmxldCBwcm9maWxlID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJHByb2ZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VjdGlvbi1wcm9maWxlJylcblx0aWYoJHByb2ZpbGUpIHtcblx0XHRsZXQgdnVlcHJvZmlsZSA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjc2VjdGlvbi1wcm9maWxlJyxcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgXHR1c2VyOiB7fSxcblxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgbWV0aG9kczp7XG5cblx0ICAgICAgICB9XG5cdCAgICB9KVxuXHQgICAgc29ja2V0LmVtaXQoJ2dldF9jdXJyZW50X3VzZXInLCBjdXJyZW50X3VzZXIpXG5cblx0ICAgIHNvY2tldC5vbignc3VjY2Vzc19nZXRfY3VycmVudF91c2VyJywgKHVzZXIpID0+IHtcblx0ICAgIFx0dnVlcHJvZmlsZS51c2VyID0gdXNlclxuXHQgICAgfSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgcHJvZmlsZSIsImltcG9ydCBDb29raWUgZnJvbSAnanMtY29va2llJ1xuXG5sZXQgc2lnbmluID0gKHNvY2tldCkgPT4ge1xuXG5cdGxldCB2dWVTaWduaW4gPSBuZXcgVnVlKHtcblx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcbiAgICAgICAgZWw6ICcjc2lnbmluJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICBcdGN1cnJlbnQ6J2xvZ2luJyxcbiAgICAgICAgXHRuYW1lOicnLFxuICAgICAgICBcdGVtYWlsOicnLFxuICAgICAgICBcdHBhc3N3b3JkOicnLFxuICAgICAgICBcdGNvbmZpcm1QYXNzd29yZDonJyxcbiAgICAgICAgICAgIGJhdHRsZXRhZzogJycsXG4gICAgICAgIFx0ZXJyb3JDb25maXJtUGFzc3dvcmQ6ZmFsc2UsXG4gICAgICAgIFx0Z2xvYmFsRXJyb3I6ZmFsc2UsXG4gICAgICAgIFx0bG9hZGluZzpmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOntcbiAgICAgICAgXHR0b2dnbGU6IGZ1bmN0aW9uICh0b2dnbGUpIHtcbiAgICAgICAgXHRcdHRoaXMuY3VycmVudCA9IHRvZ2dsZVxuICAgICAgICBcdH0sXG4gICAgICAgIFx0bG9naW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdFx0dGhpcy5sb2FkaW5nID0gdHJ1ZVxuICAgICAgICBcdFx0bGV0IHVzZXIgPSB7XG4gICAgICAgIFx0XHRcdHVzZXJuYW1lIDogdGhpcy5uYW1lLFxuICAgICAgICBcdFx0XHRwYXNzd29yZCA6IHRoaXMucGFzc3dvcmRcbiAgICAgICAgXHRcdH1cbiAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdjb25uZWN0X3VzZXInLCB1c2VyKVxuXG4gICAgICAgIFx0fSxcbiAgICAgICAgXHRuZXdBY2NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgXHRcdHRoaXMubG9hZGluZyA9IHRydWVcblxuICAgICAgICBcdFx0aWYgKHRoaXMucGFzc3dvcmQgIT0gdGhpcy5jb25maXJtUGFzc3dvcmQpIHtcbiAgICAgICAgXHRcdFx0dGhpcy5lcnJvckNvbmZpcm1QYXNzd29yZCA9IHRydWVcbiAgICAgICAgXHRcdFx0dGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgXHRcdH0gZWxzZSB7XG4gICAgICAgIFx0XHRcdGxldCB1c2VyID0ge1xuICAgICAgICBcdFx0XHRcdHVzZXJuYW1lIDogdGhpcy5uYW1lLFxuICAgICAgICBcdFx0XHRcdGVtYWlsOiB0aGlzLmVtYWlsLFxuICAgICAgICBcdFx0XHRcdHBhc3N3b3JkIDogdGhpcy5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdHRsZXRhZzogdGhpcy5iYXR0bGV0YWdcbiAgICAgICAgXHRcdFx0fVxuICAgICAgICBcdFx0XHRzb2NrZXQuZW1pdCgnY3JlYXRlX3VzZXInLCB1c2VyKVxuICAgICAgICBcdFx0fVxuICAgICAgICBcdH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBzb2NrZXQub24oJ3N1Y2Nlc3NfY29ubmVjdCcsIChyZXMpPT4ge1xuICAgIFx0dnVlU2lnbmluLmxvYWRpbmcgPSBmYWxzZVxuICAgIFx0aWYgKENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpID09IHVuZGVmaW5lZCkge1xuICAgIFx0XHRDb29raWUuc2V0KCdjdXJyZW50X3VzZXInLCByZXMudXNlcklkLCB7IGV4cGlyZXM6IDcsIHBhdGg6ICcvJyB9KVxuICAgIFx0fSBlbHNlIHtcbiAgICBcdFx0Q29va2llLnJlbW92ZSgnY3VycmVudF91c2VyJylcbiAgICBcdFx0Q29va2llLnNldCgnY3VycmVudF91c2VyJywgcmVzLnVzZXJJZCwgeyBleHBpcmVzOiA3LCBwYXRoOiAnLycgfSlcbiAgICBcdH1cblxuICAgIFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHJlcy51cmxcblxuICAgIH0pXG5cbiAgICBzb2NrZXQub24oJ2Vycm9yX2Nvbm5lY3QnLCAoZXJyb3IpPT4ge1xuICAgIFx0dnVlU2lnbmluLmdsb2JhbEVycm9yID0gZXJyb3JcbiAgICBcdHZ1ZVNpZ25pbi5sb2FkaW5nID0gZmFsc2VcbiAgICB9KVxufVxuZXhwb3J0IGRlZmF1bHQgc2lnbmluIiwiLyohXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4yLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llXG4gKlxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG5cdHZhciByZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSBmYWxzZTtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XG5cdFx0dmFyIE9sZENvb2tpZXMgPSB3aW5kb3cuQ29va2llcztcblx0XHR2YXIgYXBpID0gd2luZG93LkNvb2tpZXMgPSBmYWN0b3J5KCk7XG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR3aW5kb3cuQ29va2llcyA9IE9sZENvb2tpZXM7XG5cdFx0XHRyZXR1cm4gYXBpO1xuXHRcdH07XG5cdH1cbn0oZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gYXJndW1lbnRzWyBpIF07XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xuXHRcdGZ1bmN0aW9uIGFwaSAoa2V5LCB2YWx1ZSwgYXR0cmlidXRlcykge1xuXHRcdFx0dmFyIHJlc3VsdDtcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV3JpdGVcblxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGF0dHJpYnV0ZXMgPSBleHRlbmQoe1xuXHRcdFx0XHRcdHBhdGg6ICcvJ1xuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdHZhciBleHBpcmVzID0gbmV3IERhdGUoKTtcblx0XHRcdFx0XHRleHBpcmVzLnNldE1pbGxpc2Vjb25kcyhleHBpcmVzLmdldE1pbGxpc2Vjb25kcygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBleHBpcmVzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gV2UncmUgdXNpbmcgXCJleHBpcmVzXCIgYmVjYXVzZSBcIm1heC1hZ2VcIiBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFXG5cdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcyA/IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXN1bHQgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSByZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXG5cdFx0XHRcdGlmICghY29udmVydGVyLndyaXRlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHZhbHVlKSlcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlID0gY29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0a2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhrZXkpKTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9bXFwoXFwpXS9nLCBlc2NhcGUpO1xuXG5cdFx0XHRcdHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcblxuXHRcdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0XHRpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJz0nICsgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9IGtleSArICc9JyArIHZhbHVlICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVhZFxuXG5cdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRyZXN1bHQgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuXHRcdFx0Ly8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuIEFsc28gcHJldmVudHMgb2RkIHJlc3VsdCB3aGVuXG5cdFx0XHQvLyBjYWxsaW5nIFwiZ2V0KClcIlxuXHRcdFx0dmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcblx0XHRcdHZhciByZGVjb2RlID0gLyglWzAtOUEtWl17Mn0pKy9nO1xuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHRmb3IgKDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0XHR2YXIgY29va2llID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5qc29uICYmIGNvb2tpZS5jaGFyQXQoMCkgPT09ICdcIicpIHtcblx0XHRcdFx0XHRjb29raWUgPSBjb29raWUuc2xpY2UoMSwgLTEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgbmFtZSA9IHBhcnRzWzBdLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0XHRjb29raWUgPSBjb252ZXJ0ZXIucmVhZCA/XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZXIucmVhZChjb29raWUsIG5hbWUpIDogY29udmVydGVyKGNvb2tpZSwgbmFtZSkgfHxcblx0XHRcdFx0XHRcdGNvb2tpZS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5qc29uKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IGNvb2tpZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRbbmFtZV0gPSBjb29raWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGFwaS5zZXQgPSBhcGk7XG5cdFx0YXBpLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBhcGkuY2FsbChhcGksIGtleSk7XG5cdFx0fTtcblx0XHRhcGkuZ2V0SlNPTiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBhcGkuYXBwbHkoe1xuXHRcdFx0XHRqc29uOiB0cnVlXG5cdFx0XHR9LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXHRcdH07XG5cdFx0YXBpLmRlZmF1bHRzID0ge307XG5cblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xuXHRcdFx0YXBpKGtleSwgJycsIGV4dGVuZChhdHRyaWJ1dGVzLCB7XG5cdFx0XHRcdGV4cGlyZXM6IC0xXG5cdFx0XHR9KSk7XG5cdFx0fTtcblxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcblxuXHRcdHJldHVybiBhcGk7XG5cdH1cblxuXHRyZXR1cm4gaW5pdChmdW5jdGlvbiAoKSB7fSk7XG59KSk7XG4iXX0=
