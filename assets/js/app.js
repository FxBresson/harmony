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
		}
	}]);

	return App;
}();

document.addEventListener("DOMContentLoaded", function (event) {
	var app = new App();
	app.init();
});

},{"./views/chat/listChannels.js":2,"./views/chat/listMessages.js":3,"./views/chat/listPrivates.js":4,"./views/chat/listUsers.js":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var listChannels = function listChannels(socket) {
	var $listChannels = document.getElementById('listChannels');
	if ($listChannels) {
		var error = null;
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
						socket.emit('get_channel_messages', id);
					}
				}
			});
		});
	}
};
exports.default = listChannels;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var listMessages = function listMessages(socket) {
	var $listMessages = document.getElementById('listMessages');
	if ($listMessages) {
		var error = null;
		//socket.emit('get_messages')
		var vueListMessages = new Vue({
			delimiters: ['${', '}'],
			el: '#listMessages',
			data: {
				messages: [],
				error: null
			}
		});
		socket.on('return_messages', function (data) {
			console.log('return_messages', data);
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2xpc3RDaGFubmVscy5qcyIsImRldi9qcy92aWV3cy9jaGF0L2xpc3RNZXNzYWdlcy5qcyIsImRldi9qcy92aWV3cy9jaGF0L2xpc3RQcml2YXRlcy5qcyIsImRldi9qcy92aWV3cy9jaGF0L2xpc3RVc2Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7SUFHTSxHOzs7Ozs7O3lCQUVFO0FBQ04sT0FBSSxNQUFKLENBQVcsVUFBWCxHQUF3QixDQUFDLElBQUQsRUFBTyxHQUFQLENBQXhCO0FBQ0EsT0FBSSxTQUFTLEdBQUcsT0FBTyxRQUFQLENBQWdCLE1BQWhCLEdBQXVCLE9BQTFCLENBQWI7QUFDQSw0QkFBUyxNQUFUO0FBQ0EsK0JBQWEsTUFBYjtBQUNBLCtCQUFhLE1BQWI7QUFDQSwrQkFBYSxNQUFiO0FBQ0E7Ozs7OztBQUdGLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFVBQUMsS0FBRCxFQUFXO0FBQ3ZELEtBQUksTUFBTSxJQUFJLEdBQUosRUFBVjtBQUNBLEtBQUksSUFBSjtBQUNELENBSEQ7Ozs7Ozs7O0FDbEJBLElBQUksZUFBZSxTQUFmLFlBQWUsQ0FBQyxNQUFELEVBQVk7QUFDOUIsS0FBSSxnQkFBZ0IsU0FBUyxjQUFULENBQXdCLGNBQXhCLENBQXBCO0FBQ0EsS0FBRyxhQUFILEVBQWtCO0FBQ2pCLE1BQUksUUFBUSxJQUFaO0FBQ0EsU0FBTyxJQUFQLENBQVksY0FBWjtBQUNBLFNBQU8sRUFBUCxDQUFVLGlCQUFWLEVBQTZCLFVBQUMsSUFBRCxFQUFTO0FBQ3JDLE9BQUcsU0FBUyxJQUFaLEVBQWtCO0FBQ2pCLFdBQVEsRUFBUjtBQUNBLFlBQVEseUJBQVI7QUFDQTtBQUNELE9BQUksa0JBQWtCLElBQUksR0FBSixDQUFRO0FBQzdCLGdCQUFZLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FEaUI7QUFFdkIsUUFBSSxlQUZtQjtBQUd2QixVQUFNO0FBQ0wsZUFBVSxJQURMO0FBRUwsWUFBTyxLQUZGO0FBR0wsZUFBVTtBQUhMLEtBSGlCO0FBUXZCLGFBQVE7QUFDUCxpQkFBWSxvQkFBUyxFQUFULEVBQWE7QUFDeEIsV0FBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsYUFBTyxJQUFQLENBQVksc0JBQVosRUFBb0MsRUFBcEM7QUFDQTtBQUpNO0FBUmUsSUFBUixDQUF0QjtBQWVBLEdBcEJEO0FBcUJBO0FBQ0QsQ0EzQkQ7a0JBNEJlLFk7Ozs7Ozs7O0FDNUJmLElBQUksZUFBZSxTQUFmLFlBQWUsQ0FBQyxNQUFELEVBQVk7QUFDOUIsS0FBSSxnQkFBZ0IsU0FBUyxjQUFULENBQXdCLGNBQXhCLENBQXBCO0FBQ0EsS0FBRyxhQUFILEVBQWtCO0FBQ2pCLE1BQUksUUFBUSxJQUFaO0FBQ0E7QUFDQSxNQUFJLGtCQUFrQixJQUFJLEdBQUosQ0FBUTtBQUM1QixlQUFZLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FEZ0I7QUFFdEIsT0FBSSxlQUZrQjtBQUd0QixTQUFNO0FBQ0wsY0FBVSxFQURMO0FBRUwsV0FBTztBQUZGO0FBSGdCLEdBQVIsQ0FBdEI7QUFRQSxTQUFPLEVBQVAsQ0FBVSxpQkFBVixFQUE2QixVQUFDLElBQUQsRUFBUztBQUNyQyxXQUFRLEdBQVIsQ0FBWSxpQkFBWixFQUErQixJQUEvQjtBQUNBLE9BQUcsU0FBUyxJQUFaLEVBQWtCO0FBQ2pCLFdBQVEsRUFBUjtBQUNBLFlBQVEseUJBQVI7QUFDQTtBQUNELG1CQUFnQixRQUFoQixHQUEyQixJQUEzQjtBQUNBLG1CQUFnQixLQUFoQixHQUF3QixLQUF4QjtBQUNBLEdBUkQ7QUFTQTtBQUNELENBdkJEO2tCQXdCZSxZOzs7Ozs7OztBQ3hCZixJQUFJLGVBQWUsU0FBZixZQUFlLENBQUMsTUFBRCxFQUFZO0FBQzlCLEtBQUksZ0JBQWdCLFNBQVMsY0FBVCxDQUF3QixjQUF4QixDQUFwQjtBQUNBLEtBQUcsYUFBSCxFQUFrQjtBQUNqQixNQUFJLFFBQVEsSUFBWjtBQUNBLFNBQU8sSUFBUCxDQUFZLGNBQVo7QUFDQSxTQUFPLEVBQVAsQ0FBVSxpQkFBVixFQUE2QixVQUFDLElBQUQsRUFBUztBQUNyQyxPQUFHLFNBQVMsSUFBWixFQUFrQjtBQUNqQixXQUFRLEVBQVI7QUFDQSxZQUFRLHFCQUFSO0FBQ0E7QUFDRCxPQUFJLGtCQUFrQixJQUFJLEdBQUosQ0FBUTtBQUM3QixnQkFBWSxDQUFDLElBQUQsRUFBTyxHQUFQLENBRGlCO0FBRXZCLFFBQUksZUFGbUI7QUFHdkIsVUFBTTtBQUNMLGVBQVUsSUFETDtBQUVMLFlBQU07QUFGRDtBQUhpQixJQUFSLENBQXRCO0FBUUEsR0FiRDtBQWNBO0FBQ0QsQ0FwQkQ7a0JBcUJlLFk7Ozs7Ozs7O0FDckJmLElBQUksWUFBWSxTQUFaLFNBQVksQ0FBQyxNQUFELEVBQVk7QUFDM0IsS0FBSSxhQUFhLFNBQVMsY0FBVCxDQUF3QixXQUF4QixDQUFqQjtBQUNBLEtBQUcsVUFBSCxFQUFlO0FBQ2QsTUFBSSxRQUFRLElBQVo7QUFDQSxTQUFPLElBQVAsQ0FBWSxXQUFaO0FBQ0EsU0FBTyxFQUFQLENBQVUsY0FBVixFQUEwQixVQUFDLElBQUQsRUFBUztBQUNsQyxPQUFHLFNBQVMsSUFBWixFQUFrQjtBQUNqQixXQUFRLEVBQVI7QUFDQSxZQUFRLHNCQUFSO0FBQ0E7QUFDRCxPQUFJLGVBQWUsSUFBSSxHQUFKLENBQVE7QUFDMUIsZ0JBQVksQ0FBQyxJQUFELEVBQU8sR0FBUCxDQURjO0FBRXBCLFFBQUksWUFGZ0I7QUFHcEIsVUFBTTtBQUNMLFlBQU8sSUFERjtBQUVMLFlBQU87QUFGRjtBQUhjLElBQVIsQ0FBbkI7QUFRQSxHQWJEO0FBY0E7QUFDRCxDQXBCRDtrQkFxQmUsUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgdXNlckxpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RVc2Vycy5qcydcbmltcG9ydCBwcml2YXRlc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RQcml2YXRlcy5qcydcbmltcG9ydCBtZXNzYWdlc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RNZXNzYWdlcy5qcydcbmltcG9ydCBjaGFubmVsc0xpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RDaGFubmVscy5qcydcblxuXG5jbGFzcyBBcHAge1xuXG5cdGluaXQoKSB7XG5cdFx0VnVlLmNvbmZpZy5kZWxpbWl0ZXJzID0gWyckeycsICd9J11cblx0XHRsZXQgc29ja2V0ID0gaW8od2luZG93LmxvY2F0aW9uLm9yaWdpbisnOjMwMDAnKVxuXHRcdHVzZXJMaXN0KHNvY2tldClcblx0XHRtZXNzYWdlc0xpc3Qoc29ja2V0KVxuXHRcdHByaXZhdGVzTGlzdChzb2NrZXQpXG5cdFx0Y2hhbm5lbHNMaXN0KHNvY2tldClcblx0fVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoZXZlbnQpICA9PntcbiAgbGV0IGFwcCA9IG5ldyBBcHBcbiAgYXBwLmluaXQoKVxufSlcblxuIiwibGV0IGxpc3RDaGFubmVscyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0Q2hhbm5lbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdENoYW5uZWxzJylcblx0aWYoJGxpc3RDaGFubmVscykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxzJylcblx0XHRzb2NrZXQub24oJ3JldHVybl9jaGFubmVscycsIChkYXRhKT0+IHtcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biBjaGFubmVsIHRyb3V2w6kuLi4nXG5cdFx0XHR9XG5cdFx0XHRsZXQgdnVlTGlzdENoYW5uZWxzID0gbmV3IFZ1ZSh7XG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHRcdCAgICAgICAgZWw6ICcjbGlzdENoYW5uZWxzJyxcblx0XHQgICAgICAgIGRhdGE6IHtcblx0XHQgICAgICAgIFx0Y2hhbm5lbHM6IGRhdGEsXG5cdFx0ICAgICAgICBcdGVycm9yOiBlcnJvcixcblx0XHQgICAgICAgIFx0c2VsZWN0ZWQ6IG51bGxcblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICBtZXRob2RzOntcblx0XHQgICAgICAgIFx0c2VsZWN0Q2hhbjogZnVuY3Rpb24oaWQpIHtcblx0XHQgICAgICAgIFx0XHR0aGlzLnNlbGVjdGVkID0gaWRcblx0XHQgICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxfbWVzc2FnZXMnLCBpZClcblx0XHQgICAgICAgIFx0fVxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KVxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RDaGFubmVscyIsImxldCBsaXN0TWVzc2FnZXMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdE1lc3NhZ2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RNZXNzYWdlcycpXG5cdGlmKCRsaXN0TWVzc2FnZXMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0Ly9zb2NrZXQuZW1pdCgnZ2V0X21lc3NhZ2VzJylcblx0XHRsZXQgdnVlTGlzdE1lc3NhZ2VzID0gbmV3IFZ1ZSh7XG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHRcdCAgICAgICAgZWw6ICcjbGlzdE1lc3NhZ2VzJyxcblx0XHQgICAgICAgIGRhdGE6IHtcblx0XHQgICAgICAgIFx0bWVzc2FnZXM6IFtdLFxuXHRcdCAgICAgICAgXHRlcnJvcjogbnVsbFxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KVxuXHRcdHNvY2tldC5vbigncmV0dXJuX21lc3NhZ2VzJywgKGRhdGEpPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ3JldHVybl9tZXNzYWdlcycsIGRhdGEpXG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gbWVzc2FnZSB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLm1lc3NhZ2VzID0gZGF0YVxuXHRcdFx0dnVlTGlzdE1lc3NhZ2VzLmVycm9yID0gZXJyb3Jcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0TWVzc2FnZXMiLCJsZXQgbGlzdFByaXZhdGVzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RQcml2YXRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0UHJpdmF0ZXMnKVxuXHRpZigkbGlzdFByaXZhdGVzKSB7XG5cdFx0bGV0IGVycm9yID0gbnVsbFxuXHRcdHNvY2tldC5lbWl0KCdnZXRfcHJpdmF0ZXMnKVxuXHRcdHNvY2tldC5vbigncmV0dXJuX3ByaXZhdGVzJywgKGRhdGEpPT4ge1xuXHRcdFx0aWYoZGF0YSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhICA9IFtdXG5cdFx0XHRcdGVycm9yID0gJ0F1Y3VuIGNoYW5uZWwgcHJpdsOpJ1xuXHRcdFx0fVxuXHRcdFx0bGV0IHZ1ZUxpc3RQcml2YXRlcyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RQcml2YXRlcycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdHByaXZhdGVzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjplcnJvclxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KVxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RQcml2YXRlcyIsImxldCBsaXN0VXNlcnMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdFVzZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RVc2VycycpXG5cdGlmKCRsaXN0VXNlcnMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0c29ja2V0LmVtaXQoJ2dldF91c2VycycpXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fdXNlcnMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gdXNlciB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0bGV0IHZ1ZUxpc3RVc2VycyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RVc2VycycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdHVzZXJzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjogZXJyb3Jcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSlcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0VXNlcnMiXX0=
