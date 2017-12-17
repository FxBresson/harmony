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
		}
	}]);

	return App;
}();

document.addEventListener("DOMContentLoaded", function (event) {
	var app = new App();
	app.init();
});

},{"./views/chat/chatbox.js":2,"./views/chat/listChannels.js":3,"./views/chat/listMessages.js":4,"./views/chat/listPrivates.js":5,"./views/chat/listUsers.js":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var chatbox = function chatbox(socket) {
	var $chatbox = document.getElementById('section-input');
	if ($chatbox) {
		console.log('erckejhn');
		var $submit = document.getElementsByClassName('send')[0];
		var $message = document.getElementById('send-message');
		var vuechatbox = new Vue({
			delimiters: ['${', '}'],
			el: '#section-input',
			data: {
				message: ''
			},
			methods: {
				send: function send() {
					console.log(document.getElementById('selectedChannel').value);
					var message = {
						content: this.message,
						id_user: 1,
						id_channel: document.getElementById('selectedChannel').value
					};
					socket.emit('send_message', message);
				}
			}
		});

		socket.on('success_send_message', function () {
			socket.emit('get_channel_messages', document.getElementById('selectedChannel').value);
		});

		// let error = null
		// socket.emit('get_channels')
		// socket.on('return_channels', (data)=> {
		// 	if(data === null) {
		// 		data  = []
		// 		error = 'Aucun channel trouvé...'
		// 	}
		// 	let vuechatbox = new Vue({
		// 		delimiters: ['${', '}'],
		//         el: '#chatbox',
		//         data: {
		//         	channels: data,
		//         	error: error,
		//         	selected: null
		//         },
		//         methods:{
		//         	selectChan: function(id) {
		//         		this.selected = id
		//         		socket.emit('get_channel_messages', id)
		//         	}
		//         }
		//     })
		// })
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2NoYXRib3guanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0Q2hhbm5lbHMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0VXNlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7SUFHTSxHOzs7Ozs7O3lCQUVFO0FBQ04sT0FBSSxNQUFKLENBQVcsVUFBWCxHQUF3QixDQUFDLElBQUQsRUFBTyxHQUFQLENBQXhCO0FBQ0EsT0FBSSxTQUFTLEdBQUcsT0FBTyxRQUFQLENBQWdCLE1BQWhCLEdBQXVCLE9BQTFCLENBQWI7QUFDQSw0QkFBUyxNQUFUO0FBQ0EsK0JBQWEsTUFBYjtBQUNBLCtCQUFhLE1BQWI7QUFDQSwrQkFBYSxNQUFiO0FBQ0EsMEJBQVEsTUFBUjtBQUNBOzs7Ozs7QUFHRixTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxVQUFDLEtBQUQsRUFBVztBQUN2RCxLQUFJLE1BQU0sSUFBSSxHQUFKLEVBQVY7QUFDQSxLQUFJLElBQUo7QUFDRCxDQUhEOzs7Ozs7OztBQ3BCQSxJQUFJLFVBQVUsU0FBVixPQUFVLENBQUMsTUFBRCxFQUFZO0FBQ3pCLEtBQUksV0FBVyxTQUFTLGNBQVQsQ0FBd0IsZUFBeEIsQ0FBZjtBQUNBLEtBQUcsUUFBSCxFQUFhO0FBQ1osVUFBUSxHQUFSLENBQVksVUFBWjtBQUNBLE1BQUksVUFBVSxTQUFTLHNCQUFULENBQWdDLE1BQWhDLEVBQXdDLENBQXhDLENBQWQ7QUFDQSxNQUFJLFdBQVcsU0FBUyxjQUFULENBQXdCLGNBQXhCLENBQWY7QUFDQSxNQUFJLGFBQWEsSUFBSSxHQUFKLENBQVE7QUFDeEIsZUFBWSxDQUFDLElBQUQsRUFBTyxHQUFQLENBRFk7QUFFbEIsT0FBSSxnQkFGYztBQUdsQixTQUFNO0FBQ0wsYUFBUztBQURKLElBSFk7QUFNbEIsWUFBUTtBQUNQLFVBQU0sZ0JBQVc7QUFDaEIsYUFBUSxHQUFSLENBQVksU0FBUyxjQUFULENBQXdCLGlCQUF4QixFQUEyQyxLQUF2RDtBQUNBLFNBQUksVUFBVTtBQUNiLGVBQVMsS0FBSyxPQUREO0FBRWIsZUFBUyxDQUZJO0FBR2Isa0JBQVksU0FBUyxjQUFULENBQXdCLGlCQUF4QixFQUEyQztBQUgxQyxNQUFkO0FBS0EsWUFBTyxJQUFQLENBQVksY0FBWixFQUE0QixPQUE1QjtBQUNBO0FBVE07QUFOVSxHQUFSLENBQWpCOztBQW1CRyxTQUFPLEVBQVAsQ0FBVSxzQkFBVixFQUFrQyxZQUFNO0FBQ3ZDLFVBQU8sSUFBUCxDQUFZLHNCQUFaLEVBQW9DLFNBQVMsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkMsS0FBL0U7QUFDQSxHQUZEOztBQUlIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNELENBckREO2tCQXNEZSxPOzs7Ozs7OztBQ3REZixJQUFJLGVBQWUsU0FBZixZQUFlLENBQUMsTUFBRCxFQUFZO0FBQzlCLEtBQUksZ0JBQWdCLFNBQVMsY0FBVCxDQUF3QixjQUF4QixDQUFwQjtBQUNBLEtBQUcsYUFBSCxFQUFrQjtBQUNqQixNQUFJLFFBQVEsSUFBWjtBQUNBLE1BQUksWUFBWSxTQUFTLGNBQVQsQ0FBd0IsaUJBQXhCLENBQWhCO0FBQ0EsU0FBTyxJQUFQLENBQVksY0FBWjtBQUNBLFNBQU8sRUFBUCxDQUFVLGlCQUFWLEVBQTZCLFVBQUMsSUFBRCxFQUFTO0FBQ3JDLE9BQUcsU0FBUyxJQUFaLEVBQWtCO0FBQ2pCLFdBQVEsRUFBUjtBQUNBLFlBQVEseUJBQVI7QUFDQTtBQUNELE9BQUksa0JBQWtCLElBQUksR0FBSixDQUFRO0FBQzdCLGdCQUFZLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FEaUI7QUFFdkIsUUFBSSxlQUZtQjtBQUd2QixVQUFNO0FBQ0wsZUFBVSxJQURMO0FBRUwsWUFBTyxLQUZGO0FBR0wsZUFBVTtBQUhMLEtBSGlCO0FBUXZCLGFBQVE7QUFDUCxpQkFBWSxvQkFBUyxFQUFULEVBQWE7QUFDeEIsV0FBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsZ0JBQVUsS0FBVixHQUFrQixFQUFsQjtBQUNBLGFBQU8sSUFBUCxDQUFZLHNCQUFaLEVBQW9DLEVBQXBDO0FBQ0E7QUFMTTtBQVJlLElBQVIsQ0FBdEI7QUFnQkEsR0FyQkQ7QUFzQkE7QUFDRCxDQTdCRDtrQkE4QmUsWTs7Ozs7Ozs7QUM5QmYsSUFBSSxlQUFlLFNBQWYsWUFBZSxDQUFDLE1BQUQsRUFBWTtBQUM5QixLQUFJLGdCQUFnQixTQUFTLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBcEI7QUFDQSxLQUFHLGFBQUgsRUFBa0I7QUFDakIsTUFBSSxRQUFRLElBQVo7QUFDQSxNQUFJLGtCQUFrQixJQUFJLEdBQUosQ0FBUTtBQUM1QixlQUFZLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FEZ0I7QUFFdEIsT0FBSSxlQUZrQjtBQUd0QixTQUFNO0FBQ0wsY0FBVSxFQURMO0FBRUwsV0FBTztBQUZGO0FBSGdCLEdBQVIsQ0FBdEI7QUFRQSxTQUFPLEVBQVAsQ0FBVSxpQkFBVixFQUE2QixVQUFDLElBQUQsRUFBUztBQUNyQyxPQUFHLFNBQVMsSUFBWixFQUFrQjtBQUNqQixXQUFRLEVBQVI7QUFDQSxZQUFRLHlCQUFSO0FBQ0E7QUFDRCxtQkFBZ0IsUUFBaEIsR0FBMkIsSUFBM0I7QUFDQSxtQkFBZ0IsS0FBaEIsR0FBd0IsS0FBeEI7QUFDQSxHQVBEO0FBUUE7QUFDRCxDQXJCRDtrQkFzQmUsWTs7Ozs7Ozs7QUN0QmYsSUFBSSxlQUFlLFNBQWYsWUFBZSxDQUFDLE1BQUQsRUFBWTtBQUM5QixLQUFJLGdCQUFnQixTQUFTLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBcEI7QUFDQSxLQUFHLGFBQUgsRUFBa0I7QUFDakIsTUFBSSxRQUFRLElBQVo7QUFDQSxTQUFPLElBQVAsQ0FBWSxjQUFaO0FBQ0EsU0FBTyxFQUFQLENBQVUsaUJBQVYsRUFBNkIsVUFBQyxJQUFELEVBQVM7QUFDckMsT0FBRyxTQUFTLElBQVosRUFBa0I7QUFDakIsV0FBUSxFQUFSO0FBQ0EsWUFBUSxxQkFBUjtBQUNBO0FBQ0QsT0FBSSxrQkFBa0IsSUFBSSxHQUFKLENBQVE7QUFDN0IsZ0JBQVksQ0FBQyxJQUFELEVBQU8sR0FBUCxDQURpQjtBQUV2QixRQUFJLGVBRm1CO0FBR3ZCLFVBQU07QUFDTCxlQUFVLElBREw7QUFFTCxZQUFNO0FBRkQ7QUFIaUIsSUFBUixDQUF0QjtBQVFBLEdBYkQ7QUFjQTtBQUNELENBcEJEO2tCQXFCZSxZOzs7Ozs7OztBQ3JCZixJQUFJLFlBQVksU0FBWixTQUFZLENBQUMsTUFBRCxFQUFZO0FBQzNCLEtBQUksYUFBYSxTQUFTLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBakI7QUFDQSxLQUFHLFVBQUgsRUFBZTtBQUNkLE1BQUksUUFBUSxJQUFaO0FBQ0EsU0FBTyxJQUFQLENBQVksV0FBWjtBQUNBLFNBQU8sRUFBUCxDQUFVLGNBQVYsRUFBMEIsVUFBQyxJQUFELEVBQVM7QUFDbEMsT0FBRyxTQUFTLElBQVosRUFBa0I7QUFDakIsV0FBUSxFQUFSO0FBQ0EsWUFBUSxzQkFBUjtBQUNBO0FBQ0QsT0FBSSxlQUFlLElBQUksR0FBSixDQUFRO0FBQzFCLGdCQUFZLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FEYztBQUVwQixRQUFJLFlBRmdCO0FBR3BCLFVBQU07QUFDTCxZQUFPLElBREY7QUFFTCxZQUFPO0FBRkY7QUFIYyxJQUFSLENBQW5CO0FBUUEsR0FiRDtBQWNBO0FBQ0QsQ0FwQkQ7a0JBcUJlLFMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHVzZXJMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0VXNlcnMuanMnXG5pbXBvcnQgcHJpdmF0ZXNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMnXG5pbXBvcnQgbWVzc2FnZXNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMnXG5pbXBvcnQgY2hhbm5lbHNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0Q2hhbm5lbHMuanMnXG5pbXBvcnQgY2hhdGJveCBmcm9tICcuL3ZpZXdzL2NoYXQvY2hhdGJveC5qcydcblxuXG5jbGFzcyBBcHAge1xuXG5cdGluaXQoKSB7XG5cdFx0VnVlLmNvbmZpZy5kZWxpbWl0ZXJzID0gWyckeycsICd9J11cblx0XHRsZXQgc29ja2V0ID0gaW8od2luZG93LmxvY2F0aW9uLm9yaWdpbisnOjMwMDAnKVxuXHRcdHVzZXJMaXN0KHNvY2tldClcblx0XHRtZXNzYWdlc0xpc3Qoc29ja2V0KVxuXHRcdHByaXZhdGVzTGlzdChzb2NrZXQpXG5cdFx0Y2hhbm5lbHNMaXN0KHNvY2tldClcblx0XHRjaGF0Ym94KHNvY2tldClcblx0fVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoZXZlbnQpICA9PntcbiAgbGV0IGFwcCA9IG5ldyBBcHBcbiAgYXBwLmluaXQoKVxufSlcblxuIiwibGV0IGNoYXRib3ggPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkY2hhdGJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWN0aW9uLWlucHV0Jylcblx0aWYoJGNoYXRib3gpIHtcblx0XHRjb25zb2xlLmxvZygnZXJja2VqaG4nKVxuXHRcdGxldCAkc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VuZCcpWzBdXG5cdFx0bGV0ICRtZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbmQtbWVzc2FnZScpXG5cdFx0bGV0IHZ1ZWNoYXRib3ggPSBuZXcgVnVlKHtcblx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHQgICAgICAgIGVsOiAnI3NlY3Rpb24taW5wdXQnLFxuXHQgICAgICAgIGRhdGE6IHtcblx0ICAgICAgICBcdG1lc3NhZ2U6ICcnXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBtZXRob2RzOntcblx0ICAgICAgICBcdHNlbmQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIFx0XHRjb25zb2xlLmxvZyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJykudmFsdWUpXG5cdCAgICAgICAgXHRcdGxldCBtZXNzYWdlID0ge1xuXHQgICAgICAgIFx0XHRcdGNvbnRlbnQ6IHRoaXMubWVzc2FnZSxcblx0ICAgICAgICBcdFx0XHRpZF91c2VyOiAxLFxuXHQgICAgICAgIFx0XHRcdGlkX2NoYW5uZWw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZENoYW5uZWwnKS52YWx1ZSxcblx0ICAgICAgICBcdFx0fVxuXHQgICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnc2VuZF9tZXNzYWdlJywgbWVzc2FnZSlcblx0ICAgICAgICBcdH1cblx0ICAgICAgICB9XG5cdCAgICB9KVxuXG5cdCAgICBzb2NrZXQub24oJ3N1Y2Nlc3Nfc2VuZF9tZXNzYWdlJywgKCkgPT4ge1xuXHQgICAgXHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxfbWVzc2FnZXMnLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJykudmFsdWUpXG5cdCAgICB9KVxuXG5cdFx0Ly8gbGV0IGVycm9yID0gbnVsbFxuXHRcdC8vIHNvY2tldC5lbWl0KCdnZXRfY2hhbm5lbHMnKVxuXHRcdC8vIHNvY2tldC5vbigncmV0dXJuX2NoYW5uZWxzJywgKGRhdGEpPT4ge1xuXHRcdC8vIFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdC8vIFx0XHRkYXRhICA9IFtdXG5cdFx0Ly8gXHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgdHJvdXbDqS4uLidcblx0XHQvLyBcdH1cblx0XHQvLyBcdGxldCB2dWVjaGF0Ym94ID0gbmV3IFZ1ZSh7XG5cdFx0Ly8gXHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHRcdC8vICAgICAgICAgZWw6ICcjY2hhdGJveCcsXG5cdFx0Ly8gICAgICAgICBkYXRhOiB7XG5cdFx0Ly8gICAgICAgICBcdGNoYW5uZWxzOiBkYXRhLFxuXHRcdC8vICAgICAgICAgXHRlcnJvcjogZXJyb3IsXG5cdFx0Ly8gICAgICAgICBcdHNlbGVjdGVkOiBudWxsXG5cdFx0Ly8gICAgICAgICB9LFxuXHRcdC8vICAgICAgICAgbWV0aG9kczp7XG5cdFx0Ly8gICAgICAgICBcdHNlbGVjdENoYW46IGZ1bmN0aW9uKGlkKSB7XG5cdFx0Ly8gICAgICAgICBcdFx0dGhpcy5zZWxlY3RlZCA9IGlkXG5cdFx0Ly8gICAgICAgICBcdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVsX21lc3NhZ2VzJywgaWQpXG5cdFx0Ly8gICAgICAgICBcdH1cblx0XHQvLyAgICAgICAgIH1cblx0XHQvLyAgICAgfSlcblx0XHQvLyB9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBjaGF0Ym94IiwibGV0IGxpc3RDaGFubmVscyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0Q2hhbm5lbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdENoYW5uZWxzJylcblx0aWYoJGxpc3RDaGFubmVscykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRsZXQgJHNlbGVjdGVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpXG5cdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVscycpXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fY2hhbm5lbHMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gY2hhbm5lbCB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0bGV0IHZ1ZUxpc3RDaGFubmVscyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RDaGFubmVscycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdGNoYW5uZWxzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjogZXJyb3IsXG5cdFx0ICAgICAgICBcdHNlbGVjdGVkOiBudWxsXG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgbWV0aG9kczp7XG5cdFx0ICAgICAgICBcdHNlbGVjdENoYW46IGZ1bmN0aW9uKGlkKSB7XG5cdFx0ICAgICAgICBcdFx0dGhpcy5zZWxlY3RlZCA9IGlkXG5cdFx0ICAgICAgICBcdFx0JHNlbGVjdGVkLnZhbHVlID0gaWRcblx0XHQgICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxfbWVzc2FnZXMnLCBpZClcblx0XHQgICAgICAgIFx0fVxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KVxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RDaGFubmVscyIsImxldCBsaXN0TWVzc2FnZXMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdE1lc3NhZ2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RNZXNzYWdlcycpXG5cdGlmKCRsaXN0TWVzc2FnZXMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0bGV0IHZ1ZUxpc3RNZXNzYWdlcyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RNZXNzYWdlcycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdG1lc3NhZ2VzOiBbXSxcblx0XHQgICAgICAgIFx0ZXJyb3I6IG51bGxcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSlcblx0XHRzb2NrZXQub24oJ3JldHVybl9tZXNzYWdlcycsIChkYXRhKT0+IHtcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biBtZXNzYWdlIHRyb3V2w6kuLi4nXG5cdFx0XHR9XG5cdFx0XHR2dWVMaXN0TWVzc2FnZXMubWVzc2FnZXMgPSBkYXRhXG5cdFx0XHR2dWVMaXN0TWVzc2FnZXMuZXJyb3IgPSBlcnJvclxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RNZXNzYWdlcyIsImxldCBsaXN0UHJpdmF0ZXMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdFByaXZhdGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RQcml2YXRlcycpXG5cdGlmKCRsaXN0UHJpdmF0ZXMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0c29ja2V0LmVtaXQoJ2dldF9wcml2YXRlcycpXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fcHJpdmF0ZXMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gY2hhbm5lbCBwcml2w6knXG5cdFx0XHR9XG5cdFx0XHRsZXQgdnVlTGlzdFByaXZhdGVzID0gbmV3IFZ1ZSh7XG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHRcdCAgICAgICAgZWw6ICcjbGlzdFByaXZhdGVzJyxcblx0XHQgICAgICAgIGRhdGE6IHtcblx0XHQgICAgICAgIFx0cHJpdmF0ZXM6IGRhdGEsXG5cdFx0ICAgICAgICBcdGVycm9yOmVycm9yXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0fSlcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbGlzdFByaXZhdGVzIiwibGV0IGxpc3RVc2VycyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0VXNlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdFVzZXJzJylcblx0aWYoJGxpc3RVc2Vycykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRzb2NrZXQuZW1pdCgnZ2V0X3VzZXJzJylcblx0XHRzb2NrZXQub24oJ3JldHVybl91c2VycycsIChkYXRhKT0+IHtcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biB1c2VyIHRyb3V2w6kuLi4nXG5cdFx0XHR9XG5cdFx0XHRsZXQgdnVlTGlzdFVzZXJzID0gbmV3IFZ1ZSh7XG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHRcdCAgICAgICAgZWw6ICcjbGlzdFVzZXJzJyxcblx0XHQgICAgICAgIGRhdGE6IHtcblx0XHQgICAgICAgIFx0dXNlcnM6IGRhdGEsXG5cdFx0ICAgICAgICBcdGVycm9yOiBlcnJvclxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KVxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RVc2VycyJdfQ==
