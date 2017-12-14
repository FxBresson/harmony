(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _listUsers = require('./views/chat/listUsers.js');

var _listUsers2 = _interopRequireDefault(_listUsers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
	function App() {
		_classCallCheck(this, App);
	}

	_createClass(App, [{
		key: 'init',
		value: function init() {
			console.log('init');
			var socket = io(window.location.origin + ':3000');
			(0, _listUsers2.default)(socket);
			console.log(_listUsers2.default);
		}
	}]);

	return App;
}();

document.addEventListener("DOMContentLoaded", function (event) {
	var app = new App();
	app.init();
});

},{"./views/chat/listUsers.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var listUsers = function listUsers(socket) {
	var $listUsers = document.getElementById('listUsers');
	if ($listUsers) {
		socket.emit('get_users');
		socket.on('users', function (data) {
			var vueListUsers = new Vue({
				el: '#listUsers',
				data: {
					users: data
				}
			});
			console.log(vueListUsers);
		});
	}
};
exports.default = listUsers;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2xpc3RVc2Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQTs7Ozs7Ozs7SUFHTSxHOzs7Ozs7O3lCQUVFO0FBQ04sV0FBUSxHQUFSLENBQVksTUFBWjtBQUNBLE9BQUksU0FBUyxHQUFHLE9BQU8sUUFBUCxDQUFnQixNQUFoQixHQUF1QixPQUExQixDQUFiO0FBQ0EsNEJBQVMsTUFBVDtBQUNBLFdBQVEsR0FBUjtBQUNBOzs7Ozs7QUFHRixTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxVQUFDLEtBQUQsRUFBVztBQUN2RCxLQUFJLE1BQU0sSUFBSSxHQUFKLEVBQVY7QUFDQSxLQUFJLElBQUo7QUFDRCxDQUhEOzs7Ozs7OztBQ2JBLElBQUksWUFBWSxTQUFaLFNBQVksQ0FBQyxNQUFELEVBQVk7QUFDM0IsS0FBSSxhQUFhLFNBQVMsY0FBVCxDQUF3QixXQUF4QixDQUFqQjtBQUNBLEtBQUcsVUFBSCxFQUFlO0FBQ2QsU0FBTyxJQUFQLENBQVksV0FBWjtBQUNBLFNBQU8sRUFBUCxDQUFVLE9BQVYsRUFBbUIsVUFBQyxJQUFELEVBQVM7QUFDM0IsT0FBSSxlQUFlLElBQUksR0FBSixDQUFRO0FBQ3BCLFFBQUksWUFEZ0I7QUFFcEIsVUFBTTtBQUNMLFlBQU87QUFERjtBQUZjLElBQVIsQ0FBbkI7QUFNRyxXQUFRLEdBQVIsQ0FBWSxZQUFaO0FBRUgsR0FURDtBQVVBO0FBQ0QsQ0FmRDtrQkFnQmUsUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgdXNlcmxpc3QgZnJvbSAnLi92aWV3cy9jaGF0L2xpc3RVc2Vycy5qcydcblxuXG5jbGFzcyBBcHAge1xuXG5cdGluaXQoKSB7XG5cdFx0Y29uc29sZS5sb2coJ2luaXQnKVxuXHRcdGxldCBzb2NrZXQgPSBpbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKyc6MzAwMCcpXG5cdFx0dXNlcmxpc3Qoc29ja2V0KVxuXHRcdGNvbnNvbGUubG9nKHVzZXJsaXN0KVxuXHR9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIChldmVudCkgID0+e1xuICBsZXQgYXBwID0gbmV3IEFwcFxuICBhcHAuaW5pdCgpXG59KVxuXG4iLCJsZXQgbGlzdFVzZXJzID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGxpc3RVc2VycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0VXNlcnMnKVxuXHRpZigkbGlzdFVzZXJzKSB7XG5cdFx0c29ja2V0LmVtaXQoJ2dldF91c2VycycpXG5cdFx0c29ja2V0Lm9uKCd1c2VycycsIChkYXRhKT0+IHtcblx0XHRcdGxldCB2dWVMaXN0VXNlcnMgPSBuZXcgVnVlKHtcblx0XHQgICAgICAgIGVsOiAnI2xpc3RVc2VycycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdHVzZXJzOiBkYXRhXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0ICAgIGNvbnNvbGUubG9nKHZ1ZUxpc3RVc2VycylcblxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RVc2VycyJdfQ==
