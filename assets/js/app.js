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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2NoYXRib3guanMiLCJkZXYvanMvdmlld3MvY2hhdC9oZWFkZXJDaGF0LmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbGlzdENoYW5uZWxzLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbGlzdE1lc3NhZ2VzLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbGlzdFByaXZhdGVzLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbGlzdFVzZXJzLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvbG9hZGVyLmpzIiwiZGV2L2pzL3ZpZXdzL2NoYXQvcHJvZmlsZS5qcyIsImRldi9qcy92aWV3cy9zaWduaW4uanMiLCJub2RlX21vZHVsZXMvanMtY29va2llL3NyYy9qcy5jb29raWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUlBOzs7O0FBR0E7Ozs7Ozs7O0lBR00sRztBQUVMLGdCQUFjO0FBQUE7O0FBQ1YsT0FBSyxNQUFMLEdBQWMsR0FBRyxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsR0FBdUIsT0FBMUIsQ0FBZDtBQUNIOzs7OzZCQUVVO0FBQ1YsT0FBRyxtQkFBTyxHQUFQLENBQVcsY0FBWCxNQUErQixTQUFsQyxFQUE0QztBQUFDLGFBQVMsUUFBVCxDQUFrQixJQUFsQixHQUF5QixPQUFPLFFBQVAsQ0FBZ0IsTUFBekM7QUFBZ0Q7QUFDN0YsVUFBTyxZQUFQLEdBQXNCLG1CQUFPLEdBQVAsQ0FBVyxjQUFYLENBQXRCO0FBQ0EsNEJBQVMsS0FBSyxNQUFkO0FBQ0EsK0JBQWEsS0FBSyxNQUFsQjtBQUNBLCtCQUFhLEtBQUssTUFBbEI7QUFDQSwrQkFBYSxLQUFLLE1BQWxCO0FBQ0EsMEJBQVEsS0FBSyxNQUFi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QVQsRUFBYyxHQUFkLENBQVA7QUFDQSxHQUZEO0FBR0EsTUFBSSxPQUFKLEdBQWMsWUFBWTtBQUN6QixVQUFPLElBQUksS0FBSixDQUFVO0FBQ2hCLFVBQU07QUFEVSxJQUFWLEVBRUosR0FBRyxLQUFILENBQVMsSUFBVCxDQUFjLFNBQWQsQ0FGSSxDQUFQO0FBR0EsR0FKRDtBQUtBLE1BQUksUUFBSixHQUFlLEVBQWY7O0FBRUEsTUFBSSxNQUFKLEdBQWEsVUFBVSxHQUFWLEVBQWUsVUFBZixFQUEyQjtBQUN2QyxPQUFJLEdBQUosRUFBUyxFQUFULEVBQWEsT0FBTyxVQUFQLEVBQW1CO0FBQy9CLGFBQVMsQ0FBQztBQURxQixJQUFuQixDQUFiO0FBR0EsR0FKRDs7QUFNQSxNQUFJLGFBQUosR0FBb0IsSUFBcEI7O0FBRUEsU0FBTyxHQUFQO0FBQ0E7O0FBRUQsUUFBTyxLQUFLLFlBQVksQ0FBRSxDQUFuQixDQUFQO0FBQ0EsQ0E3SkMsQ0FBRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgdXNlckxpc3QgXHRmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdFVzZXJzLmpzJ1xuaW1wb3J0IHByaXZhdGVzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdFByaXZhdGVzLmpzJ1xuaW1wb3J0IG1lc3NhZ2VzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdE1lc3NhZ2VzLmpzJ1xuaW1wb3J0IGNoYW5uZWxzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdENoYW5uZWxzLmpzJ1xuaW1wb3J0IGNoYXRib3ggXHRcdGZyb20gJy4vdmlld3MvY2hhdC9jaGF0Ym94LmpzJ1xuaW1wb3J0IGxvYWRlciBcdFx0ZnJvbSAnLi92aWV3cy9jaGF0L2xvYWRlci5qcydcbmltcG9ydCBwcm9maWwgXHRcdGZyb20gJy4vdmlld3MvY2hhdC9wcm9maWxlLmpzJ1xuaW1wb3J0IGhlYWRlciBcdFx0ZnJvbSAnLi92aWV3cy9jaGF0L2hlYWRlckNoYXQuanMnXG5cblxuXG5pbXBvcnQgQ29va2llICAgICAgIGZyb20gJ2pzLWNvb2tpZSdcblxuXG5pbXBvcnQgc2lnbmluICAgICAgIGZyb20gJy4vdmlld3Mvc2lnbmluLmpzJ1xuXG5cbmNsYXNzIEFwcCB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdCAgICB0aGlzLnNvY2tldCA9IGlvKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4rJzozMDAwJylcblx0fVxuXG5cdGluaXRDaGF0KCkge1xuXHRcdGlmKENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpID09PSB1bmRlZmluZWQpe2RvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2lufVxuXHRcdHdpbmRvdy5jdXJyZW50X3VzZXIgPSBDb29raWUuZ2V0KCdjdXJyZW50X3VzZXInKVxuXHRcdHVzZXJMaXN0KHRoaXMuc29ja2V0KVxuXHRcdG1lc3NhZ2VzTGlzdCh0aGlzLnNvY2tldClcblx0XHRwcml2YXRlc0xpc3QodGhpcy5zb2NrZXQpXG5cdFx0Y2hhbm5lbHNMaXN0KHRoaXMuc29ja2V0KVxuXHRcdGNoYXRib3godGhpcy5zb2NrZXQpXG5cdFx0bG9hZGVyKHRoaXMuc29ja2V0KVxuXHRcdHByb2ZpbCh0aGlzLnNvY2tldClcblx0XHRoZWFkZXIodGhpcy5zb2NrZXQpXG5cdH1cblxuXHRpbml0U2lnbmluKCkge1xuXHRcdHNpZ25pbih0aGlzLnNvY2tldClcblx0fVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoZXZlbnQpICA9PntcbiAgXHRsZXQgYXBwID0gbmV3IEFwcFxuICBcdGxldCAkYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF1cbiAgXHRpZiAoICRib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2lnbmluJykgKSB7XG4gIFx0XHRpZiAoQ29va2llLmdldCgnY3VycmVudF91c2VyJykpIHtcbiAgXHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4rJy8/YWN0aW9uPWNoYXQnXG4gIFx0XHR9IGVsc2UgIHtcbiAgXHRcdFx0YXBwLmluaXRTaWduaW4oKVxuICBcdFx0fVxuXG4gIFx0fSBlbHNlIGlmICgkYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoYXQnKSkge1xuICBcdFx0YXBwLmluaXRDaGF0KClcbiAgXHR9XG5cbn0pXG5cbiIsImxldCBjaGF0Ym94ID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGNoYXRib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VjdGlvbi1pbnB1dCcpXG5cdGlmKCRjaGF0Ym94KSB7XG5cdFx0bGV0IGlkQ2hhbiA9IDBcblx0XHRsZXQgdnVlY2hhdGJveCA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjc2VjdGlvbi1pbnB1dCcsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgIFx0bWVzc2FnZTogJycsXG5cdCAgICAgICAgXHRjdXJyZW50Q2hhbjogbnVsbFxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgbWV0aG9kczp7XG5cdCAgICAgICAgXHRzZW5kOiBmdW5jdGlvbigpIHtcblx0XHRcdCAgICBcdC8vIENoZWNrIGlmIHRoZSBjdXJyZW50IG1lc3NhZ2UgaXMgZW1wdHkgb3Igbm90XG5cdFx0XHQgICAgXHRpZiAodGhpcy5tZXNzYWdlICYmIHRoaXMubWVzc2FnZSAhPSAnJyAmJiB0aGlzLmN1cnJlbnRDaGFuICE9IG51bGwpIHtcblx0XHRcdCAgICBcdFx0Ly8gQ3JlYXRpbmcgYSBuZXggbWVzc2FnZVxuXHRcdCAgICBcdFx0ICBcdC8vIHJlaW5pdGlhbGlzZSB0aGUgaW5wdXQgYW5kIGJsdXIgaXRcblx0XHQgICAgICAgIFx0XHRsZXQgbWVzc2FnZSA9IHtcblx0XHQgICAgICAgIFx0XHRcdGNvbnRlbnQ6IHRoaXMubWVzc2FnZSxcblx0XHQgICAgICAgIFx0XHRcdGlkX3VzZXI6IGN1cnJlbnRfdXNlcixcblx0XHQgICAgICAgIFx0XHRcdGlkX2NoYW5uZWw6IHRoaXMuY3VycmVudENoYW4sXG5cdFx0ICAgICAgICBcdFx0fVxuXG5cdFx0ICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ3NlbmRfbWVzc2FnZScsIG1lc3NhZ2UpXG5cdFx0ICAgICAgICBcdFx0aWRDaGFuID0gdGhpcy5jdXJyZW50Q2hhblxuXHRcdCAgICAgICAgXHRcdHRoaXMubWVzc2FnZSA9ICcnXG5cdFx0ICAgICAgICBcdH1cblx0ICAgICAgICBcdH1cblx0ICAgICAgICB9XG5cdCAgICB9KVxuXG5cdCAgICBzb2NrZXQub24oJ3N1Y2Nlc3Nfc2VuZF9tZXNzYWdlJywgKGlkKSA9PiB7XG5cdCAgICBcdGlmKGlkICE9IGlkQ2hhbikge1xuXHQgICAgXHRcdHNvY2tldC5lbWl0KCdhZGRfY2hhbm5lbF9ub3RpZmljYXRpb24nLCBpZCApXG5cdCAgICBcdH0gZWxzZSB7XG5cdCAgICBcdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVsX21lc3NhZ2VzJyxpZENoYW4gKVxuXHQgICAgXHR9XG5cdCAgICB9KVxuXG5cdCAgICBzb2NrZXQub24oJ3NlbGVjdF9jaGFuJywgKGNoYW4pID0+IHtcblx0ICAgIFx0dnVlY2hhdGJveC5jdXJyZW50Q2hhbiA9IGNoYW4uaWRfY2hhbm5lbFxuXHQgICAgfSlcblxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBjaGF0Ym94IiwibGV0IGhlYWRlckNoYXQgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkaGVhZGVyQ2hhdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWN0aW9uLXRvcCcpXG5cdGlmKCRoZWFkZXJDaGF0KSB7XG5cdFx0bGV0IGlkQ2hhbiA9IDBcblx0XHRsZXQgdnVlaGVhZGVyQ2hhdCA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjc2VjdGlvbi10b3AnLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdHRpdGxlOiAnJyxcblx0ICAgICAgICBcdGN1cnJlbnRDaGFuOicnLFxuXHQgICAgICAgIFx0ZGVzYzonJ1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgbWV0aG9kczp7XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblxuXG5cdCAgICBzb2NrZXQub24oJ3NlbGVjdF9jaGFuJywgKGNoYW4pID0+IHtcblx0ICAgIFx0Y29uc29sZS5sb2coXCJramtua1wiLCBjaGFuKVxuXHQgICAgXHR2dWVoZWFkZXJDaGF0LmN1cnJlbnRDaGFuID0gY2hhbi5pZF9jaGFubmVsXG5cdCAgICBcdHZ1ZWhlYWRlckNoYXQudGl0bGUgPSBjaGFuLm5hbWVcblx0ICAgIFx0dnVlaGVhZGVyQ2hhdC5kZXNjID0gY2hhbi5kZXNjcmlwdGlvblxuXHQgICAgXHRjb25zb2xlLmxvZyh2dWVoZWFkZXJDaGF0LCB2dWVoZWFkZXJDaGF0LnRpdGxlKVxuXHQgICAgfSlcblxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBoZWFkZXJDaGF0IiwibGV0IGxpc3RDaGFubmVscyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0Q2hhbm5lbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdENoYW5uZWxzJylcblx0aWYoJGxpc3RDaGFubmVscykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRsZXQgJHNlbGVjdGVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpXG5cdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVscycpXG5cdFx0bGV0IHZ1ZUxpc3RDaGFubmVscyA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjbGlzdENoYW5uZWxzJyxcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgXHRjaGFubmVsczogW10sXG5cdCAgICAgICAgXHRlcnJvcjogbnVsbCxcblx0ICAgICAgICBcdHNlbGVjdGVkOiBudWxsXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBtZXRob2RzOntcblx0ICAgICAgICBcdHNlbGVjdENoYW46IGZ1bmN0aW9uKGlkKSB7XG5cblx0ICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ3NlbGVjdF9jaGFuJywgaWQpXG5cdCAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbF9tZXNzYWdlcycsIGlkKVxuXHQgICAgICAgIFx0fVxuXHQgICAgICAgIH1cblx0ICAgIH0pXG5cblx0XHRzb2NrZXQub24oJ3NlbGVjdF9jaGFuJywgKGNoYW4pID0+IHtcblx0XHRcdGxldCBjaGFucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodnVlTGlzdENoYW5uZWxzLmNoYW5uZWxzKSlcblx0XHRcdGZvciggbGV0IGMgb2YgY2hhbnMgKXtcblx0XHRcdFx0aWYgKGMuaWRfY2hhbm5lbCA9PSBjaGFuKSB7XG5cdFx0XHRcdFx0Yy5ub3RpZmljYXRpb24gPSB1bmRlZmluZWRcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dnVlTGlzdENoYW5uZWxzLmNoYW5uZWxzID0gY2hhbnNcblx0ICAgIFx0dnVlTGlzdENoYW5uZWxzLnNlbGVjdGVkID0gY2hhbi5pZF9jaGFubmVsXG5cdCAgICB9KVxuXG5cdCAgICBzb2NrZXQub24oJ2FkZF9jaGFubmVsX25vdGlmaWNhdGlvbicsIChpZCkgPT4ge1xuXHQgICAgXHRsZXQgY2hhbnMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZ1ZUxpc3RDaGFubmVscy5jaGFubmVscykpXG5cdCAgICBcdGZvciggbGV0IGNoYW4gb2YgY2hhbnMgKXtcblx0ICAgIFx0XHRpZiAoY2hhbi5pZF9jaGFubmVsID09IGlkKSB7XG5cdCAgICBcdFx0XHRpZiAoY2hhbi5ub3RpZmljYXRpb24pIHtcblx0ICAgIFx0XHRcdFx0Y2hhbi5ub3RpZmljYXRpb24gKytcblx0ICAgIFx0XHRcdH0gZWxzZSB7XG5cdCAgICBcdFx0XHRcdGNoYW4ubm90aWZpY2F0aW9uID0gMVxuXHQgICAgXHRcdFx0fVxuXHQgICAgXHRcdH1cblx0ICAgIFx0fVxuXHQgICAgXHR2dWVMaXN0Q2hhbm5lbHMuY2hhbm5lbHMgPSBjaGFuc1xuXG5cdCAgICB9KVxuXHRcdHNvY2tldC5vbigncmV0dXJuX2NoYW5uZWxzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgdHJvdXbDqS4uLidcblx0XHRcdH1cblx0XHRcdHZ1ZUxpc3RDaGFubmVscy5jaGFubmVscyA9IGRhdGFcblx0XHRcdHZ1ZUxpc3RDaGFubmVscy5lcnJvciA9IGVycm9yXG5cblxuXG5cblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0Q2hhbm5lbHMiLCJsZXQgbGlzdE1lc3NhZ2VzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RNZXNzYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0TWVzc2FnZXMnKVxuXHRpZigkbGlzdE1lc3NhZ2VzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdGxldCB2dWVMaXN0TWVzc2FnZXMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0TWVzc2FnZXMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHRtZXNzYWdlczogW10sXG5cdFx0ICAgICAgICBcdGVycm9yOiBudWxsXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fbWVzc2FnZXMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gbWVzc2FnZSB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLm1lc3NhZ2VzID0gZGF0YVxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLmVycm9yID0gZXJyb3Jcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0TWVzc2FnZXMiLCJsZXQgbGlzdFByaXZhdGVzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RQcml2YXRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0UHJpdmF0ZXMnKVxuXHRpZigkbGlzdFByaXZhdGVzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdGNvbnNvbGUubG9nKGN1cnJlbnRfdXNlcilcblx0XHRWdWUuY29tcG9uZW50KCdtb2RhbCcsIHtcblx0XHQgIHRlbXBsYXRlOiAnI21vZGFsLWNyZWF0ZScsXG5cdFx0ICBwcm9wczogWydzaG93JywgJ3RpdGxlJ10sXG5cdFx0ICBkYXRhOiBmdW5jdGlvbigpIHtcblx0XHQgICAgcmV0dXJuIHtcblx0XHQgICAgICBpbnRlcm5hbFNob3c6ICcnLFxuXHRcdCAgICAgIGludGVybmFsVGl0bGU6JycsXG5cdFx0ICAgICAgaW50ZXJuYWxEZXNjOicnXG5cdFx0ICAgIH1cblx0XHQgIH0sXG5cdFx0ICB3YXRjaDoge1xuXHRcdCAgICAnaW50ZXJuYWxTaG93JzogZnVuY3Rpb24oKSB7XG5cdFx0ICAgICAgXHRpZiAoIXRoaXMuaW50ZXJuYWxTaG93KSB7dGhpcy4kZW1pdCgnY2xvc2UnLCB0aGlzLmludGVybmFsU2hvdyl9XG5cdFx0ICAgIH1cblx0XHQgIH0sXG5cdFx0ICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcblx0XHQgICAgdGhpcy5pbnRlcm5hbFNob3cgID0gdGhpcy5zaG93XG5cdFx0ICAgIHRoaXMuaW50ZXJuYWxUaXRsZSA9IHRoaXMudGl0bGVcblx0XHQgICAgdGhpcy5pbnRlcm5hbERlc2MgID0gdGhpcy5kZXNjcmlwdGlvblxuXHRcdCAgfVxuXHRcdH0pXG5cblxuXHRcdGxldCB2dWVMaXN0UHJpdmF0ZXMgPSBuZXcgVnVlKHtcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHQgICAgICAgIGVsOiAnI2xpc3RQcml2YXRlcycsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgIFx0cHJpdmF0ZXM6IFtdLFxuXHQgICAgICAgIFx0ZXJyb3I6IG51bGwsXG5cdCAgICAgICAgXHRzaG93TW9kYWw6IGZhbHNlLFxuXHQgICAgICAgIFx0dGl0bGU6ICcnLFxuXHQgICAgICAgIFx0ZGVzY3JpcHRpb246JycsXG5cdCAgICAgICAgXHRzZWxlY3RlZDogbnVsbFxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgbWV0aG9kczoge1xuICAgICAgICBcdFx0Y2xvc2VNb2RhbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIFx0XHRcdHRoaXMuc2hvd01vZGFsID0gZmFsc2VcbiAgICAgICAgXHRcdFx0dGhpcy4kY2hpbGRyZW5bMF0uaW50ZXJuYWxTaG93ID0gZmFsc2VcblxuICAgICAgICBcdFx0fSxcbiAgICAgICAgXHRcdGNyZWF0ZU5ld0NoYW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdFx0XHR0aGlzLnRpdGxlID0gdGhpcy4kY2hpbGRyZW5bMF0uaW50ZXJuYWxUaXRsZVxuICAgICAgICBcdFx0XHR0aGlzLmRlc2NyaXB0aW9uID0gdGhpcy4kY2hpbGRyZW5bMF0uaW50ZXJuYWxEZXNjXG4gICAgICAgIFx0XHRcdHRoaXMuY2xvc2VNb2RhbCgpXG4gICAgICAgIFx0XHRcdGxldCBwcml2YXRlQ2hhbiA9IHtcbiAgICAgICAgXHRcdFx0XHRpZF90eXBlOiAyLFxuICAgICAgICBcdFx0XHRcdHBvc2l0aW9uOiBudWxsLFxuICAgICAgICBcdFx0XHRcdG5hbWU6IHRoaXMudGl0bGUsXG4gICAgICAgIFx0XHRcdFx0ZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICAgIFx0XHRcdFx0aWRfdXNlcjogY3VycmVudF91c2VyXG4gICAgICAgIFx0XHRcdH1cbiAgICAgICAgXHRcdFx0dGhpcy50aXRsZSA9ICcnXG4gICAgICAgIFx0XHRcdHRoaXMuZGVzY3JpcHRpb24gPSAnJ1xuICAgICAgICBcdFx0XHR0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbFRpdGxlID0gJydcbiAgICAgICAgXHRcdFx0dGhpcy4kY2hpbGRyZW5bMF0uaW50ZXJuYWxEZXNjID0gJydcbiAgICAgICAgXHRcdFx0c29ja2V0LmVtaXQoJ2NyZWF0ZV9jaGFubmVsJywgcHJpdmF0ZUNoYW4pXG5cbiAgICAgICAgXHRcdH0sXG4gICAgICAgIFx0XHRzZWxlY3RDaGFuOiBmdW5jdGlvbihpZCkge1xuICAgICAgICBcdFx0XHRzb2NrZXQuZW1pdCgnc2VsZWN0X2NoYW4nLCBpZClcbiAgICAgICAgXHRcdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVsX21lc3NhZ2VzJywgaWQpXG4gICAgICAgIFx0XHR9XG4gICAgICAgIFx0fVxuXHQgICAgfSlcblx0XHRzb2NrZXQuZW1pdCgnZ2V0X3ByaXZhdGVzJywgY3VycmVudF91c2VyKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX3ByaXZhdGVzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgcHJpdsOpJ1xuXHRcdFx0fVxuXHRcdFx0dnVlTGlzdFByaXZhdGVzLnByaXZhdGVzID0gZGF0YVxuXHRcdFx0dnVlTGlzdFByaXZhdGVzLmVycm9yID0gZXJyb3JcblxuXHRcdH0pXG5cblx0XHRzb2NrZXQub24oJ3NlbGVjdF9jaGFuJywgKGNoYW4pID0+IHtcblx0ICAgIFx0dnVlTGlzdFByaXZhdGVzLnNlbGVjdGVkID0gY2hhbi5pZF9jaGFubmVsXG5cdCAgICB9KVxuXG5cblx0XHRzb2NrZXQub24oJ3N1Y2Nlc3NfY3JlYXRlX2NoYW5uZWwnLCAoKT0+IHtcblx0XHRcdHNvY2tldC5lbWl0KCdnZXRfcHJpdmF0ZXMnLCBjdXJyZW50X3VzZXIpXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdFByaXZhdGVzIiwibGV0IGxpc3RVc2VycyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0VXNlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdFVzZXJzJylcblx0aWYoJGxpc3RVc2Vycykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRzb2NrZXQuZW1pdCgnZ2V0X3VzZXJzJywgY3VycmVudF91c2VyKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX3VzZXJzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIHVzZXIgdHJvdXbDqS4uLidcblx0XHRcdH1cblx0XHRcdGxldCB2dWVMaXN0VXNlcnMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0VXNlcnMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHR1c2VyczogZGF0YSxcblx0XHQgICAgICAgIFx0ZXJyb3I6IGVycm9yXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdFVzZXJzIiwibGV0IGxvYWRlciA9IChzb2NrZXQpID0+IHtcblx0bGV0IGN1cnJlbnRDaGFuXG5cdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKSApIHtjdXJyZW50Q2hhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKS52YWx1ZX1cblxuXHRsZXQgJGxvYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluTG9hZGVyJylcblx0aWYoJGxvYWRlcikge1xuXHRcdGxldCAkc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VuZCcpWzBdXG5cdFx0bGV0ICRpbnB1dCAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VuZC1tZXNzYWdlJylcblx0XHRsZXQgdnVlbG9hZGVyID0gbmV3IFZ1ZSh7XG5cdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0ICAgICAgICBlbDogJyNtYWluTG9hZGVyJyxcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgXHRjdXJyZW50Q2hhbjogY3VycmVudENoYW5cblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6e1xuXHQgICAgICAgIH1cblx0ICAgIH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxvYWRlciIsIi8vc2VjdGlvbi1wcm9maWxlXG5cbmxldCBwcm9maWxlID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJHByb2ZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VjdGlvbi1wcm9maWxlJylcblx0aWYoJHByb2ZpbGUpIHtcblx0XHRsZXQgdnVlcHJvZmlsZSA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjc2VjdGlvbi1wcm9maWxlJyxcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgXHR1c2VyOiB7fSxcblxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgbWV0aG9kczp7XG5cblx0ICAgICAgICB9XG5cdCAgICB9KVxuXHQgICAgc29ja2V0LmVtaXQoJ2dldF9jdXJyZW50X3VzZXInLCBjdXJyZW50X3VzZXIpXG5cblx0ICAgIHNvY2tldC5vbignc3VjY2Vzc19nZXRfY3VycmVudF91c2VyJywgKHVzZXIpID0+IHtcblx0ICAgIFx0dnVlcHJvZmlsZS51c2VyID0gdXNlclxuXHQgICAgfSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgcHJvZmlsZSIsImltcG9ydCBDb29raWUgZnJvbSAnanMtY29va2llJ1xuXG5sZXQgc2lnbmluID0gKHNvY2tldCkgPT4ge1xuXG5cdGxldCB2dWVTaWduaW4gPSBuZXcgVnVlKHtcblx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcbiAgICAgICAgZWw6ICcjc2lnbmluJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICBcdGN1cnJlbnQ6J2xvZ2luJyxcbiAgICAgICAgXHRuYW1lOicnLFxuICAgICAgICBcdGVtYWlsOicnLFxuICAgICAgICBcdHBhc3N3b3JkOicnLFxuICAgICAgICBcdGNvbmZpcm1QYXNzd29yZDonJyxcbiAgICAgICAgICAgIGJhdHRsZXRhZzogJycsXG4gICAgICAgIFx0ZXJyb3JDb25maXJtUGFzc3dvcmQ6ZmFsc2UsXG4gICAgICAgIFx0Z2xvYmFsRXJyb3I6ZmFsc2UsXG4gICAgICAgIFx0bG9hZGluZzpmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOntcbiAgICAgICAgXHR0b2dnbGU6IGZ1bmN0aW9uICh0b2dnbGUpIHtcbiAgICAgICAgXHRcdHRoaXMuY3VycmVudCA9IHRvZ2dsZVxuICAgICAgICBcdH0sXG4gICAgICAgIFx0bG9naW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdFx0dGhpcy5sb2FkaW5nID0gdHJ1ZVxuICAgICAgICBcdFx0bGV0IHVzZXIgPSB7XG4gICAgICAgIFx0XHRcdHVzZXJuYW1lIDogdGhpcy5uYW1lLFxuICAgICAgICBcdFx0XHRwYXNzd29yZCA6IHRoaXMucGFzc3dvcmRcbiAgICAgICAgXHRcdH1cbiAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdjb25uZWN0X3VzZXInLCB1c2VyKVxuXG4gICAgICAgIFx0fSxcbiAgICAgICAgXHRuZXdBY2NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgXHRcdHRoaXMubG9hZGluZyA9IHRydWVcblxuICAgICAgICBcdFx0aWYgKHRoaXMucGFzc3dvcmQgIT0gdGhpcy5jb25maXJtUGFzc3dvcmQpIHtcbiAgICAgICAgXHRcdFx0dGhpcy5lcnJvckNvbmZpcm1QYXNzd29yZCA9IHRydWVcbiAgICAgICAgXHRcdFx0dGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgXHRcdH0gZWxzZSB7XG4gICAgICAgIFx0XHRcdGxldCB1c2VyID0ge1xuICAgICAgICBcdFx0XHRcdHVzZXJuYW1lIDogdGhpcy5uYW1lLFxuICAgICAgICBcdFx0XHRcdGVtYWlsOiB0aGlzLmVtYWlsLFxuICAgICAgICBcdFx0XHRcdHBhc3N3b3JkIDogdGhpcy5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdHRsZXRhZzogdGhpcy5iYXR0bGV0YWdcbiAgICAgICAgXHRcdFx0fVxuICAgICAgICBcdFx0XHRzb2NrZXQuZW1pdCgnY3JlYXRlX3VzZXInLCB1c2VyKVxuICAgICAgICBcdFx0fVxuICAgICAgICBcdH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBzb2NrZXQub24oJ3N1Y2Nlc3NfY29ubmVjdCcsIChyZXMpPT4ge1xuICAgIFx0dnVlU2lnbmluLmxvYWRpbmcgPSBmYWxzZVxuICAgIFx0aWYgKENvb2tpZS5nZXQoJ2N1cnJlbnRfdXNlcicpID09IHVuZGVmaW5lZCkge1xuICAgIFx0XHRDb29raWUuc2V0KCdjdXJyZW50X3VzZXInLCByZXMudXNlcklkLCB7IGV4cGlyZXM6IDcsIHBhdGg6ICcvJyB9KVxuICAgIFx0fSBlbHNlIHtcbiAgICBcdFx0Q29va2llLnJlbW92ZSgnY3VycmVudF91c2VyJylcbiAgICBcdFx0Q29va2llLnNldCgnY3VycmVudF91c2VyJywgcmVzLnVzZXJJZCwgeyBleHBpcmVzOiA3LCBwYXRoOiAnLycgfSlcbiAgICBcdH1cblxuICAgIFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHJlcy51cmxcblxuICAgIH0pXG5cbiAgICBzb2NrZXQub24oJ2Vycm9yX2Nvbm5lY3QnLCAoZXJyb3IpPT4ge1xuICAgIFx0dnVlU2lnbmluLmdsb2JhbEVycm9yID0gZXJyb3JcbiAgICBcdHZ1ZVNpZ25pbi5sb2FkaW5nID0gZmFsc2VcbiAgICB9KVxufVxuZXhwb3J0IGRlZmF1bHQgc2lnbmluIiwiLyohXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4yLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llXG4gKlxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG5cdHZhciByZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSBmYWxzZTtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XG5cdFx0dmFyIE9sZENvb2tpZXMgPSB3aW5kb3cuQ29va2llcztcblx0XHR2YXIgYXBpID0gd2luZG93LkNvb2tpZXMgPSBmYWN0b3J5KCk7XG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR3aW5kb3cuQ29va2llcyA9IE9sZENvb2tpZXM7XG5cdFx0XHRyZXR1cm4gYXBpO1xuXHRcdH07XG5cdH1cbn0oZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gYXJndW1lbnRzWyBpIF07XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xuXHRcdGZ1bmN0aW9uIGFwaSAoa2V5LCB2YWx1ZSwgYXR0cmlidXRlcykge1xuXHRcdFx0dmFyIHJlc3VsdDtcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV3JpdGVcblxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGF0dHJpYnV0ZXMgPSBleHRlbmQoe1xuXHRcdFx0XHRcdHBhdGg6ICcvJ1xuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdHZhciBleHBpcmVzID0gbmV3IERhdGUoKTtcblx0XHRcdFx0XHRleHBpcmVzLnNldE1pbGxpc2Vjb25kcyhleHBpcmVzLmdldE1pbGxpc2Vjb25kcygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBleHBpcmVzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gV2UncmUgdXNpbmcgXCJleHBpcmVzXCIgYmVjYXVzZSBcIm1heC1hZ2VcIiBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFXG5cdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcyA/IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXN1bHQgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSByZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXG5cdFx0XHRcdGlmICghY29udmVydGVyLndyaXRlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHZhbHVlKSlcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlID0gY29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0a2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhrZXkpKTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9bXFwoXFwpXS9nLCBlc2NhcGUpO1xuXG5cdFx0XHRcdHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcblxuXHRcdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0XHRpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJz0nICsgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9IGtleSArICc9JyArIHZhbHVlICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVhZFxuXG5cdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRyZXN1bHQgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuXHRcdFx0Ly8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuIEFsc28gcHJldmVudHMgb2RkIHJlc3VsdCB3aGVuXG5cdFx0XHQvLyBjYWxsaW5nIFwiZ2V0KClcIlxuXHRcdFx0dmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcblx0XHRcdHZhciByZGVjb2RlID0gLyglWzAtOUEtWl17Mn0pKy9nO1xuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHRmb3IgKDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0XHR2YXIgY29va2llID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5qc29uICYmIGNvb2tpZS5jaGFyQXQoMCkgPT09ICdcIicpIHtcblx0XHRcdFx0XHRjb29raWUgPSBjb29raWUuc2xpY2UoMSwgLTEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgbmFtZSA9IHBhcnRzWzBdLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0XHRjb29raWUgPSBjb252ZXJ0ZXIucmVhZCA/XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZXIucmVhZChjb29raWUsIG5hbWUpIDogY29udmVydGVyKGNvb2tpZSwgbmFtZSkgfHxcblx0XHRcdFx0XHRcdGNvb2tpZS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5qc29uKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IGNvb2tpZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRbbmFtZV0gPSBjb29raWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGFwaS5zZXQgPSBhcGk7XG5cdFx0YXBpLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBhcGkuY2FsbChhcGksIGtleSk7XG5cdFx0fTtcblx0XHRhcGkuZ2V0SlNPTiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBhcGkuYXBwbHkoe1xuXHRcdFx0XHRqc29uOiB0cnVlXG5cdFx0XHR9LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXHRcdH07XG5cdFx0YXBpLmRlZmF1bHRzID0ge307XG5cblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xuXHRcdFx0YXBpKGtleSwgJycsIGV4dGVuZChhdHRyaWJ1dGVzLCB7XG5cdFx0XHRcdGV4cGlyZXM6IC0xXG5cdFx0XHR9KSk7XG5cdFx0fTtcblxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcblxuXHRcdHJldHVybiBhcGk7XG5cdH1cblxuXHRyZXR1cm4gaW5pdChmdW5jdGlvbiAoKSB7fSk7XG59KSk7XG4iXX0=
