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
		socket.emit('get_privates');
		socket.on('return_privates', function (data) {
			if (data === null) {
				data = [];
				error = 'Aucun channel privé';
			}
			var vueListPrivates = new Vue({
				delimiters: ['${', '}'],
				el: '#listPrivates',
				data: {
					privates: data,
					error: error
				}
			});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2NoYXRib3guanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0Q2hhbm5lbHMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0VXNlcnMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9sb2FkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUdNLEc7Ozs7Ozs7eUJBRUU7QUFDTixPQUFJLE1BQUosQ0FBVyxVQUFYLEdBQXdCLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FBeEI7QUFDQSxPQUFJLFNBQVMsR0FBRyxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsR0FBdUIsT0FBMUIsQ0FBYjtBQUNBLDRCQUFTLE1BQVQ7QUFDQSwrQkFBYSxNQUFiO0FBQ0EsK0JBQWEsTUFBYjtBQUNBLCtCQUFhLE1BQWI7QUFDQSwwQkFBUSxNQUFSO0FBQ0EseUJBQU8sTUFBUDtBQUNBOzs7Ozs7QUFHRixTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxVQUFDLEtBQUQsRUFBVztBQUN2RCxLQUFJLE1BQU0sSUFBSSxHQUFKLEVBQVY7QUFDQSxLQUFJLElBQUo7QUFDRCxDQUhEOzs7Ozs7OztBQ3RCQSxJQUFJLFVBQVUsU0FBVixPQUFVLENBQUMsTUFBRCxFQUFZO0FBQ3pCLEtBQUksV0FBVyxTQUFTLGNBQVQsQ0FBd0IsZUFBeEIsQ0FBZjtBQUNBLEtBQUcsUUFBSCxFQUFhO0FBQ1osTUFBSSxVQUFVLFNBQVMsc0JBQVQsQ0FBZ0MsTUFBaEMsRUFBd0MsQ0FBeEMsQ0FBZDtBQUNBLE1BQUksU0FBVSxTQUFT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LEdBYkQ7QUFjQTtBQUNELENBcEJEO2tCQXFCZSxTOzs7Ozs7OztBQ3JCZixJQUFJLFNBQVMsU0FBVCxNQUFTLENBQUMsTUFBRCxFQUFZO0FBQ3hCLEtBQUksY0FBYyxTQUFTLGNBQVQsQ0FBd0IsaUJBQXhCLEVBQTJDLEtBQTdEO0FBQ0EsS0FBSSxVQUFVLFNBQVMsY0FBVCxDQUF3QixZQUF4QixDQUFkO0FBQ0EsS0FBRyxPQUFILEVBQVk7QUFDWCxNQUFJLFVBQVUsU0FBUyxzQkFBVCxDQUFnQyxNQUFoQyxFQUF3QyxDQUF4QyxDQUFkO0FBQ0EsTUFBSSxTQUFVLFNBQVMsY0FBVCxDQUF3QixjQUF4QixDQUFkO0FBQ0EsTUFBSSxZQUFZLElBQUksR0FBSixDQUFRO0FBQ3ZCLGVBQVksQ0FBQyxJQUFELEVBQU8sR0FBUCxDQURXO0FBRWpCLE9BQUksYUFGYTtBQUdqQixTQUFNO0FBQ0wsaUJBQWE7QUFEUixJQUhXO0FBTWpCLFlBQVE7QUFOUyxHQUFSLENBQWhCO0FBU0E7QUFDRCxDQWhCRDtrQkFpQmUsTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgdXNlckxpc3QgXHRmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdFVzZXJzLmpzJ1xuaW1wb3J0IHByaXZhdGVzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdFByaXZhdGVzLmpzJ1xuaW1wb3J0IG1lc3NhZ2VzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdE1lc3NhZ2VzLmpzJ1xuaW1wb3J0IGNoYW5uZWxzTGlzdCBmcm9tICcuL3ZpZXdzL2NoYXQvbGlzdENoYW5uZWxzLmpzJ1xuaW1wb3J0IGNoYXRib3ggXHRcdGZyb20gJy4vdmlld3MvY2hhdC9jaGF0Ym94LmpzJ1xuaW1wb3J0IGxvYWRlciBcdFx0ZnJvbSAnLi92aWV3cy9jaGF0L2xvYWRlci5qcydcblxuXG5jbGFzcyBBcHAge1xuXG5cdGluaXQoKSB7XG5cdFx0VnVlLmNvbmZpZy5kZWxpbWl0ZXJzID0gWyckeycsICd9J11cblx0XHRsZXQgc29ja2V0ID0gaW8od2luZG93LmxvY2F0aW9uLm9yaWdpbisnOjMwMDAnKVxuXHRcdHVzZXJMaXN0KHNvY2tldClcblx0XHRtZXNzYWdlc0xpc3Qoc29ja2V0KVxuXHRcdHByaXZhdGVzTGlzdChzb2NrZXQpXG5cdFx0Y2hhbm5lbHNMaXN0KHNvY2tldClcblx0XHRjaGF0Ym94KHNvY2tldClcblx0XHRsb2FkZXIoc29ja2V0KVxuXHR9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIChldmVudCkgID0+e1xuICBsZXQgYXBwID0gbmV3IEFwcFxuICBhcHAuaW5pdCgpXG59KVxuXG4iLCJsZXQgY2hhdGJveCA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRjaGF0Ym94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlY3Rpb24taW5wdXQnKVxuXHRpZigkY2hhdGJveCkge1xuXHRcdGxldCAkc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VuZCcpWzBdXG5cdFx0bGV0ICRpbnB1dCAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VuZC1tZXNzYWdlJylcblx0XHRsZXQgdnVlY2hhdGJveCA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjc2VjdGlvbi1pbnB1dCcsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgIFx0bWVzc2FnZTogJycsXG5cdCAgICAgICAgXHRjdXJyZW50Q2hhbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBtZXRob2RzOntcblx0ICAgICAgICBcdHNlbmQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIFx0XHQkaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0Jylcblx0XHRcdCAgICBcdC8vIENoZWNrIGlmIHRoZSBjdXJyZW50IG1lc3NhZ2UgaXMgZW1wdHkgb3Igbm90XG5cdFx0XHQgICAgXHRpZiAodGhpcy5tZXNzYWdlICYmIHRoaXMubWVzc2FnZSAhPSAnJykge1xuXHRcdFx0ICAgIFx0XHR0aGlzLmN1cnJlbnRDaGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlXG5cdFx0XHQgICAgXHRcdC8vIENyZWF0aW5nIGEgbmV4IG1lc3NhZ2Vcblx0XHQgICAgXHRcdCAgXHQvLyByZWluaXRpYWxpc2UgdGhlIGlucHV0IGFuZCBibHVyIGl0XG5cdFx0ICAgICAgICBcdFx0bGV0IG1lc3NhZ2UgPSB7XG5cdFx0ICAgICAgICBcdFx0XHRjb250ZW50OiB0aGlzLm1lc3NhZ2UsXG5cdFx0ICAgICAgICBcdFx0XHRpZF91c2VyOiAxLFxuXHRcdCAgICAgICAgXHRcdFx0aWRfY2hhbm5lbDogdGhpcy5jdXJyZW50Q2hhbixcblx0XHQgICAgICAgIFx0XHR9XG5cblx0XHQgICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnc2VuZF9tZXNzYWdlJywgbWVzc2FnZSlcblx0XHQgICAgICAgIFx0XHR0aGlzLm1lc3NhZ2UgPSAnJ1xuXHRcdCAgICAgICAgXHR9XG5cdCAgICAgICAgXHR9XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblxuXHQgICAgc29ja2V0Lm9uKCdzdWNjZXNzX3NlbmRfbWVzc2FnZScsICgpID0+IHtcblx0ICAgIFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVsX21lc3NhZ2VzJywgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpLnZhbHVlKVxuXHQgICAgfSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgY2hhdGJveCIsImxldCBsaXN0Q2hhbm5lbHMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdENoYW5uZWxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RDaGFubmVscycpXG5cdGlmKCRsaXN0Q2hhbm5lbHMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0bGV0ICRzZWxlY3RlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKVxuXHRcdHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbHMnKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX2NoYW5uZWxzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgdHJvdXbDqS4uLidcblx0XHRcdH1cblx0XHRcdGxldCB2dWVMaXN0Q2hhbm5lbHMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0Q2hhbm5lbHMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHRjaGFubmVsczogZGF0YSxcblx0XHQgICAgICAgIFx0ZXJyb3I6IGVycm9yLFxuXHRcdCAgICAgICAgXHRzZWxlY3RlZDogbnVsbFxuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIG1ldGhvZHM6e1xuXHRcdCAgICAgICAgXHRzZWxlY3RDaGFuOiBmdW5jdGlvbihpZCkge1xuXHRcdCAgICAgICAgXHRcdHRoaXMuc2VsZWN0ZWQgPSBpZFxuXHRcdCAgICAgICAgXHRcdCRzZWxlY3RlZC52YWx1ZSA9IGlkXG5cdFx0ICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVsX21lc3NhZ2VzJywgaWQpXG5cdFx0ICAgICAgICBcdH1cblx0XHQgICAgICAgIH1cblx0XHQgICAgfSlcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0Q2hhbm5lbHMiLCJsZXQgbGlzdE1lc3NhZ2VzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RNZXNzYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0TWVzc2FnZXMnKVxuXHRpZigkbGlzdE1lc3NhZ2VzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdGxldCB2dWVMaXN0TWVzc2FnZXMgPSBuZXcgVnVlKHtcblx0XHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdFx0ICAgICAgICBlbDogJyNsaXN0TWVzc2FnZXMnLFxuXHRcdCAgICAgICAgZGF0YToge1xuXHRcdCAgICAgICAgXHRtZXNzYWdlczogW10sXG5cdFx0ICAgICAgICBcdGVycm9yOiBudWxsXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fbWVzc2FnZXMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gbWVzc2FnZSB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLm1lc3NhZ2VzID0gZGF0YVxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLmVycm9yID0gZXJyb3Jcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0TWVzc2FnZXMiLCJsZXQgbGlzdFByaXZhdGVzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RQcml2YXRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0UHJpdmF0ZXMnKVxuXHRpZigkbGlzdFByaXZhdGVzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdHNvY2tldC5lbWl0KCdnZXRfcHJpdmF0ZXMnKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX3ByaXZhdGVzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgcHJpdsOpJ1xuXHRcdFx0fVxuXHRcdFx0bGV0IHZ1ZUxpc3RQcml2YXRlcyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RQcml2YXRlcycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdHByaXZhdGVzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjplcnJvclxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KVxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RQcml2YXRlcyIsImxldCBsaXN0VXNlcnMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdFVzZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RVc2VycycpXG5cdGlmKCRsaXN0VXNlcnMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0c29ja2V0LmVtaXQoJ2dldF91c2VycycpXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fdXNlcnMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gdXNlciB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0bGV0IHZ1ZUxpc3RVc2VycyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RVc2VycycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdHVzZXJzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjogZXJyb3Jcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSlcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0VXNlcnMiLCJsZXQgbG9hZGVyID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgY3VycmVudENoYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJykudmFsdWVcblx0bGV0ICRsb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkxvYWRlcicpXG5cdGlmKCRsb2FkZXIpIHtcblx0XHRsZXQgJHN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbmQnKVswXVxuXHRcdGxldCAkaW5wdXQgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbmQtbWVzc2FnZScpXG5cdFx0bGV0IHZ1ZWxvYWRlciA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjbWFpbkxvYWRlcicsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgIFx0Y3VycmVudENoYW46IGN1cnJlbnRDaGFuXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBtZXRob2RzOntcblx0ICAgICAgICB9XG5cdCAgICB9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsb2FkZXIiXX0=
