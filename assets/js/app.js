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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
	function App() {
		_classCallCheck(this, App);
	}

	_createClass(App, [{
		key: 'init',
		value: function init() {

			window.current_user = 1;
			Vue.config.delimiters = ['${', '}'];
			var socket = io(window.location.origin + ':3000');
			(0, _listUsers2.default)(socket);
			(0, _listMessages2.default)(socket);
			(0, _listPrivates2.default)(socket);
			(0, _listChannels2.default)(socket);
			(0, _chatbox2.default)(socket);
			(0, _loader2.default)(socket);
		}
	}]);

	return App;
}();

document.addEventListener("DOMContentLoaded", function (event) {
	var app = new App();
	app.init();
});

},{"./views/chat/chatbox.js":2,"./views/chat/listChannels.js":3,"./views/chat/listMessages.js":4,"./views/chat/listPrivates.js":5,"./views/chat/listUsers.js":6,"./views/chat/loader.js":7}],2:[function(require,module,exports){
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
	var currentChan = document.getElementById('selectedChannel').value;
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2NoYXRib3guanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0Q2hhbm5lbHMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0VXNlcnMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9sb2FkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUdNLEc7Ozs7Ozs7eUJBRUU7O0FBRU4sVUFBTyxZQUFQLEdBQXNCLENBQXRCO0FBQ0EsT0FBSSxNQUFKLENBQVcsVUFBWCxHQUF3QixDQUFDLElBQUQsRUFBTyxHQUFQLENBQXhCO0FBQ0EsT0FBSSxTQUFTLEdBQUcsT0FBTyxRQUFQLENBQWdCLE1BQWhCLEdBQXVCLE9BQTFCLENBQWI7QUFDQSw0QkFBUyxNQUFUO0FBQ0EsK0JBQWEsTUFBYjtBQUNBLCtCQUFhLE1BQWI7QUFDQSwrQkFBYSxNQUFiO0FBQ0EsMEJBQVEsTUFBUjtBQUNBLHlCQUFPLE1BQVA7QUFDQTs7Ozs7O0FBR0YsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsVUFBQyxLQUFELEVBQVc7QUFDdkQsS0FBSSxNQUFNLElBQUksR0FBSixFQUFWO0FBQ0EsS0FBSSxJQUFKO0FBQ0QsQ0FIRDs7Ozs7Ozs7QUN4QkEsSUFBSSxVQUFVLFNBQVYsT0FBVSxDQUFDLE1BQUQsRUFBWTtBQUN6QixLQUFJLFdBQVcsU0FBUyxjQUFULENBQXdCLGVBQXhCLENBQWY7QUFDQSxLQUFHLFFBQUgsRUFBYTtBQUNaLE1BQUksVUFBVSxTQUFTLHNCQUFULENBQWdDLE1BQWhDLEVBQXdDLENB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O0FBQ0EsWUFBUSxzQkFBUjtBQUNBO0FBQ0QsT0FBSSxlQUFlLElBQUksR0FBSixDQUFRO0FBQzFCLGdCQUFZLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FEYztBQUVwQixRQUFJLFlBRmdCO0FBR3BCLFVBQU07QUFDTCxZQUFPLElBREY7QUFFTCxZQUFPO0FBRkY7QUFIYyxJQUFSLENBQW5CO0FBUUEsR0FiRDtBQWNBO0FBQ0QsQ0FwQkQ7a0JBcUJlLFM7Ozs7Ozs7O0FDckJmLElBQUksU0FBUyxTQUFULE1BQVMsQ0FBQyxNQUFELEVBQVk7QUFDeEIsS0FBSSxjQUFjLFNBQVMsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkMsS0FBN0Q7QUFDQSxLQUFJLFVBQVUsU0FBUyxjQUFULENBQXdCLFlBQXhCLENBQWQ7QUFDQSxLQUFHLE9BQUgsRUFBWTtBQUNYLE1BQUksVUFBVSxTQUFTLHNCQUFULENBQWdDLE1BQWhDLEVBQXdDLENBQXhDLENBQWQ7QUFDQSxNQUFJLFNBQVUsU0FBUyxjQUFULENBQXdCLGNBQXhCLENBQWQ7QUFDQSxNQUFJLFlBQVksSUFBSSxHQUFKLENBQVE7QUFDdkIsZUFBWSxDQUFDLElBQUQsRUFBTyxHQUFQLENBRFc7QUFFakIsT0FBSSxhQUZhO0FBR2pCLFNBQU07QUFDTCxpQkFBYTtBQURSLElBSFc7QUFNakIsWUFBUTtBQU5TLEdBQVIsQ0FBaEI7QUFTQTtBQUNELENBaEJEO2tCQWlCZSxNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB1c2VyTGlzdCBcdGZyb20gJy4vdmlld3MvY2hhdC9saXN0VXNlcnMuanMnXG5pbXBvcnQgcHJpdmF0ZXNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMnXG5pbXBvcnQgbWVzc2FnZXNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMnXG5pbXBvcnQgY2hhbm5lbHNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0Q2hhbm5lbHMuanMnXG5pbXBvcnQgY2hhdGJveCBcdFx0ZnJvbSAnLi92aWV3cy9jaGF0L2NoYXRib3guanMnXG5pbXBvcnQgbG9hZGVyIFx0XHRmcm9tICcuL3ZpZXdzL2NoYXQvbG9hZGVyLmpzJ1xuXG5cbmNsYXNzIEFwcCB7XG5cblx0aW5pdCgpIHtcblxuXHRcdHdpbmRvdy5jdXJyZW50X3VzZXIgPSAxXG5cdFx0VnVlLmNvbmZpZy5kZWxpbWl0ZXJzID0gWyckeycsICd9J11cblx0XHRsZXQgc29ja2V0ID0gaW8od2luZG93LmxvY2F0aW9uLm9yaWdpbisnOjMwMDAnKVxuXHRcdHVzZXJMaXN0KHNvY2tldClcblx0XHRtZXNzYWdlc0xpc3Qoc29ja2V0KVxuXHRcdHByaXZhdGVzTGlzdChzb2NrZXQpXG5cdFx0Y2hhbm5lbHNMaXN0KHNvY2tldClcblx0XHRjaGF0Ym94KHNvY2tldClcblx0XHRsb2FkZXIoc29ja2V0KVxuXHR9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIChldmVudCkgID0+e1xuICBsZXQgYXBwID0gbmV3IEFwcFxuICBhcHAuaW5pdCgpXG59KVxuXG4iLCJsZXQgY2hhdGJveCA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRjaGF0Ym94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlY3Rpb24taW5wdXQnKVxuXHRpZigkY2hhdGJveCkge1xuXHRcdGxldCAkc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VuZCcpWzBdXG5cdFx0bGV0ICRpbnB1dCAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VuZC1tZXNzYWdlJylcblx0XHRsZXQgdnVlY2hhdGJveCA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjc2VjdGlvbi1pbnB1dCcsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgIFx0bWVzc2FnZTogJycsXG5cdCAgICAgICAgXHRjdXJyZW50Q2hhbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBtZXRob2RzOntcblx0ICAgICAgICBcdHNlbmQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIFx0XHQkaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0Jylcblx0XHRcdCAgICBcdC8vIENoZWNrIGlmIHRoZSBjdXJyZW50IG1lc3NhZ2UgaXMgZW1wdHkgb3Igbm90XG5cdFx0XHQgICAgXHRpZiAodGhpcy5tZXNzYWdlICYmIHRoaXMubWVzc2FnZSAhPSAnJykge1xuXHRcdFx0ICAgIFx0XHR0aGlzLmN1cnJlbnRDaGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlXG5cdFx0XHQgICAgXHRcdC8vIENyZWF0aW5nIGEgbmV4IG1lc3NhZ2Vcblx0XHQgICAgXHRcdCAgXHQvLyByZWluaXRpYWxpc2UgdGhlIGlucHV0IGFuZCBibHVyIGl0XG5cdFx0ICAgICAgICBcdFx0bGV0IG1lc3NhZ2UgPSB7XG5cdFx0ICAgICAgICBcdFx0XHRjb250ZW50OiB0aGlzLm1lc3NhZ2UsXG5cdFx0ICAgICAgICBcdFx0XHRpZF91c2VyOiAxLFxuXHRcdCAgICAgICAgXHRcdFx0aWRfY2hhbm5lbDogdGhpcy5jdXJyZW50Q2hhbixcblx0XHQgICAgICAgIFx0XHR9XG5cblx0XHQgICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnc2VuZF9tZXNzYWdlJywgbWVzc2FnZSlcblx0XHQgICAgICAgIFx0XHR0aGlzLm1lc3NhZ2UgPSAnJ1xuXHRcdCAgICAgICAgXHR9XG5cdCAgICAgICAgXHR9XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblxuXHQgICAgc29ja2V0Lm9uKCdzdWNjZXNzX3NlbmRfbWVzc2FnZScsICgpID0+IHtcblx0ICAgIFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVsX21lc3NhZ2VzJywgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlKVxuXHQgICAgfSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgY2hhdGJveCIsImxldCBsaXN0Q2hhbm5lbHMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdENoYW5uZWxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RDaGFubmVscycpXG5cdGlmKCRsaXN0Q2hhbm5lbHMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0bGV0ICRzZWxlY3RlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKVxuXHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbHMnKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX2NoYW5uZWxzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgdHJvdXbDqS4uLidcblx0XHRcdH1cblx0XHRcdGxldCB2dWVMaXN0Q2hhbm5lbHMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0Q2hhbm5lbHMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHRjaGFubmVsczogZGF0YSxcblx0XHQgICAgICAgIFx0ZXJyb3I6IGVycm9yLFxuXHRcdCAgICAgICAgXHRzZWxlY3RlZDogbnVsbFxuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIG1ldGhvZHM6e1xuXHRcdCAgICAgICAgXHRzZWxlY3RDaGFuOiBmdW5jdGlvbihpZCkge1xuXHRcdCAgICAgICAgXHRcdHRoaXMuc2VsZWN0ZWQgPSBpZFxuXHRcdCAgICAgICAgXHRcdCRzZWxlY3RlZC52YWx1ZSA9IGlkXG5cdFx0ICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVsX21lc3NhZ2VzJywgaWQpXG5cdFx0ICAgICAgICBcdH1cblx0XHQgICAgICAgIH1cblx0XHQgICAgfSlcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0Q2hhbm5lbHMiLCJsZXQgbGlzdE1lc3NhZ2VzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RNZXNzYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0TWVzc2FnZXMnKVxuXHRpZigkbGlzdE1lc3NhZ2VzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdGxldCB2dWVMaXN0TWVzc2FnZXMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0TWVzc2FnZXMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHRtZXNzYWdlczogW10sXG5cdFx0ICAgICAgICBcdGVycm9yOiBudWxsXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fbWVzc2FnZXMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gbWVzc2FnZSB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLm1lc3NhZ2VzID0gZGF0YVxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLmVycm9yID0gZXJyb3Jcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0TWVzc2FnZXMiLCJsZXQgbGlzdFByaXZhdGVzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RQcml2YXRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0UHJpdmF0ZXMnKVxuXHRpZigkbGlzdFByaXZhdGVzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdHNvY2tldC5lbWl0KCdnZXRfcHJpdmF0ZXMnLCB3aW5kb3cuY3VycmVudF91c2VyKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX3ByaXZhdGVzJywgKGRhdGEpPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coZGF0YSlcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biBjaGFubmVsIHByaXbDqSdcblx0XHRcdH1cblx0XHRcdFZ1ZS5jb21wb25lbnQoJ21vZGFsJywge1xuXHRcdFx0ICB0ZW1wbGF0ZTogJyNtb2RhbC1jcmVhdGUnLFxuXHRcdFx0ICBwcm9wczogWydzaG93JywgJ3RpdGxlJ10sXG5cdFx0XHQgIGRhdGE6IGZ1bmN0aW9uKCkge1xuXHRcdFx0ICAgIHJldHVybiB7XG5cdFx0XHQgICAgICBpbnRlcm5hbFNob3c6ICcnLFxuXHRcdFx0ICAgICAgaW50ZXJuYWxUaXRsZTonJyxcblx0XHRcdCAgICAgIGludGVybmFsRGVzYzonJ1xuXHRcdFx0ICAgIH1cblx0XHRcdCAgfSxcblx0XHRcdCAgd2F0Y2g6IHtcblx0XHRcdCAgICAnaW50ZXJuYWxTaG93JzogZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgICBcdGlmICghdGhpcy5pbnRlcm5hbFNob3cpIHt0aGlzLiRlbWl0KCdjbG9zZScsIHRoaXMuaW50ZXJuYWxTaG93KX1cblx0XHRcdCAgICB9XG5cdFx0XHQgIH0sXG5cdFx0XHQgIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0ICAgIHRoaXMuaW50ZXJuYWxTaG93ICA9IHRoaXMuc2hvd1xuXHRcdFx0ICAgIHRoaXMuaW50ZXJuYWxUaXRsZSA9IHRoaXMudGl0bGVcblx0XHRcdCAgICB0aGlzLmludGVybmFsRGVzYyAgPSB0aGlzLmRlc2NyaXB0aW9uXG5cdFx0XHQgIH1cblx0XHRcdH0pXG5cblxuXHRcdFx0bGV0IHZ1ZUxpc3RQcml2YXRlcyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RQcml2YXRlcycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdHByaXZhdGVzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjogZXJyb3IsXG5cdFx0ICAgICAgICBcdHNob3dNb2RhbDogZmFsc2UsXG5cdFx0ICAgICAgICBcdHRpdGxlOiAnJyxcblx0XHQgICAgICAgIFx0ZGVzY3JpcHRpb246Jydcblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICBtZXRob2RzOiB7XG5cdCAgICAgICAgXHRcdGNsb3NlTW9kYWw6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIFx0XHRcdHRoaXMuc2hvd01vZGFsID0gZmFsc2Vcblx0ICAgICAgICBcdFx0XHR0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbFNob3cgPSBmYWxzZVxuXG5cdCAgICAgICAgXHRcdH0sXG5cdCAgICAgICAgXHRcdGNyZWF0ZU5ld0NoYW46IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIFx0XHRcdHRoaXMudGl0bGUgPSB0aGlzLiRjaGlsZHJlblswXS5pbnRlcm5hbFRpdGxlXG5cdCAgICAgICAgXHRcdFx0dGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuJGNoaWxkcmVuWzBdLmludGVybmFsRGVzY1xuXHQgICAgICAgIFx0XHRcdHRoaXMuY2xvc2VNb2RhbCgpXG5cdCAgICAgICAgXHRcdFx0bGV0IHByaXZhdGVDaGFuID0ge1xuXHQgICAgICAgIFx0XHRcdFx0aWRfdHlwZTogMixcblx0ICAgICAgICBcdFx0XHRcdHBvc2l0aW9uOiBudWxsLFxuXHQgICAgICAgIFx0XHRcdFx0bmFtZTogdGhpcy50aXRsZSxcblx0ICAgICAgICBcdFx0XHRcdGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuXHQgICAgICAgIFx0XHRcdFx0aWRfdXNlcjogMVxuXHQgICAgICAgIFx0XHRcdH1cblx0ICAgICAgICBcdFx0XHRzb2NrZXQuZW1pdCgnY3JlYXRlX2NoYW5uZWwnLCBwcml2YXRlQ2hhbilcblxuXHQgICAgICAgIFx0XHR9XG5cdCAgICAgICAgXHR9XG5cdFx0ICAgIH0pXG5cdFx0fSlcblxuXG5cdFx0c29ja2V0Lm9uKCdzdWNjZXNzX2NyZWF0ZV9jaGFubmVsJywgKCk9PiB7XG5cdFx0XHRzb2NrZXQuZW1pdCgncmV0dXJuX3ByaXZhdGVzJywgd2luZG93LmN1cnJlbnRfdXNlcilcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0UHJpdmF0ZXMiLCJsZXQgbGlzdFVzZXJzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RVc2VycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0VXNlcnMnKVxuXHRpZigkbGlzdFVzZXJzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdHNvY2tldC5lbWl0KCdnZXRfdXNlcnMnKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX3VzZXJzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIHVzZXIgdHJvdXbDqS4uLidcblx0XHRcdH1cblx0XHRcdGxldCB2dWVMaXN0VXNlcnMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0VXNlcnMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHR1c2VyczogZGF0YSxcblx0XHQgICAgICAgIFx0ZXJyb3I6IGVycm9yXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdFVzZXJzIiwibGV0IGxvYWRlciA9IChzb2NrZXQpID0+IHtcblx0bGV0IGN1cnJlbnRDaGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlXG5cdGxldCAkbG9hZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5Mb2FkZXInKVxuXHRpZigkbG9hZGVyKSB7XG5cdFx0bGV0ICRzdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZW5kJylbMF1cblx0XHRsZXQgJGlucHV0ICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZW5kLW1lc3NhZ2UnKVxuXHRcdGxldCB2dWVsb2FkZXIgPSBuZXcgVnVlKHtcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHQgICAgICAgIGVsOiAnI21haW5Mb2FkZXInLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdGN1cnJlbnRDaGFuOiBjdXJyZW50Q2hhblxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgbWV0aG9kczp7XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbG9hZGVyIl19
