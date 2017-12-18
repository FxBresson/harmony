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
		socket.on('return_channels', function (data) {
			if (data === null) {
				data = [];
				error = 'Aucun channel privé';
			}
			Vue.component('modal', {
				template: '#modal-template',
				//The child has a prop named 'value'. v-model will automatically bind to this prop
				props: ['show'],
				data: function data() {
					return {
						internalValue: ''
					};
				},
				watch: {
					'internalValue': function internalValue() {
						// When the internal value changes, we $emit an event. Because this event is
						// named 'input', v-model will automatically update the parent value
						if (!this.internalValue) {
							this.$emit('close', this.internalValue);
						}
					}
				},
				created: function created() {
					// We initially sync the internalValue with the value passed in by the parent
					this.internalValue = this.show;
				}
			});

			var vueListPrivates = new Vue({
				delimiters: ['${', '}'],
				el: '#listPrivates',
				data: {
					privates: data,
					error: error,
					showModal: false
				},
				methods: {
					closeModal: function closeModal() {
						vueListPrivates.showModal = false;
					}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyIsImRldi9qcy92aWV3cy9jaGF0L2NoYXRib3guanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0Q2hhbm5lbHMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9saXN0VXNlcnMuanMiLCJkZXYvanMvdmlld3MvY2hhdC9sb2FkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUdNLEc7Ozs7Ozs7eUJBRUU7QUFDTixPQUFJLE1BQUosQ0FBVyxVQUFYLEdBQXdCLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FBeEI7QUFDQSxPQUFJLFNBQVMsR0FBRyxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsR0FBdUIsT0FBMUIsQ0FBYjtBQUNBLDRCQUFTLE1BQVQ7QUFDQSwrQkFBYSxNQUFiO0FBQ0EsK0JBQWEsTUFBYjtBQUNBLCtCQUFhLE1BQWI7QUFDQSwwQkFBUSxNQUFSO0FBQ0EseUJBQU8sTUFBUDtBQUNBOzs7Ozs7QUFHRixTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxVQUFDLEtBQUQsRUFBVztBQUN2RCxLQUFJLE1BQU0sSUFBSSxHQUFKLEVBQVY7QUFDQSxLQUFJLElBQUo7QUFDRCxDQUhEOzs7Ozs7OztBQ3RCQSxJQUFJLFVBQVUsU0FBVixPQUFVLENBQUMsTUFBRCxFQUFZO0FBQ3pCLEtBQUksV0FBVyxTQUFTLGNBQVQsQ0FBd0IsZUFBeEIsQ0FBZjtBQUNBLEtBQUcsUUFBSCxFQUFhO0FBQ1osTUFBSSxVQUFVLFNBQVMsc0JBQVQsQ0FBZ0MsTUFBaEMsRUFBd0MsQ0FBeEMsQ0FBZDtBQUNBLE1BQUksU0FBVSxTQUFTLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBZDtBQUNBLE1BQUksYUFBYSxJQUFJLEdBQUosQ0FBUTtBQUN4QixlQUFZLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FEWTtBQUVsQixPQUFJLGdCQUZjO0FBR2xCLFNBQU07QUFDTCxhQUFTLEVBREo7QUFFTCxpQkFBYSxTQUFTLGNBQVQsQ0FBd0IsaUJBQXhCLEVBQTJDO0FBRm5ELElBSFk7QUFPbEIsWUFBUTtBQUNQLFVBQU0sZ0JBQVc7QUFDaEIsY0FBUyxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBVDtBQUNIO0FBQ0EsU0FBSSxLQUFLLE9BQUwsSUFBZ0IsS0FBSyxPQUFMLElBQWdCLEVBQXBDLEVBQXdDO0FBQ3ZDLFdBQUssV0FBTCxHQUFtQixTQUFTLGNBQVQsQ0FBd0IsaUJBQXhCLEVBQTJDLEtBQTlEO0FBQ0E7QUFDRTtBQUNDLFVBQUksVUFBVTtBQUNiLGdCQUFTLEtBQUssT0FERDtBQUViLGdCQUFTLENBRkk7QUFHYixtQkFBWSxLQUFLO0FBSEosT0FBZDs7QUFNQSxhQUFPLElBQVAsQ0FBWSxjQUFaLEVBQTRCLE9BQTVCO0FBQ0EsV0FBSyxPQUFMLEdBQWUsRUFBZjtBQUNBO0FBQ0Q7QUFqQk07QUFQVSxHQUFSLENBQWpCOztBQTRCRyxTQUFPLEVBQVAsQ0FBVSxzQkFBVixFQUFrQyxZQUFNO0FBQ3ZDLFVBQU8sSUFBUCxDQUFZLHNCQUFaLEVBQW9DLFNBQVMsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkMsS0FBL0U7QUFDQSxHQUZEO0FBR0g7QUFDRCxDQXJDRDtrQkFzQ2UsTzs7Ozs7Ozs7QUN0Q2YsSUFBSSxlQUFlLFNBQWYsWUFBZSxDQUFDLE1BQUQsRUFBWTtBQUM5QixLQUFJLGdCQUFnQixTQUFTLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBcEI7QUFDQSxLQUFHLGFBQUgsRUFBa0I7QUFDakIsTUFBSSxRQUFRLElBQVo7QUFDQSxNQUFJLFlBQVksU0FBUyxjQUFULENBQXdCLGlCQUF4QixDQUFoQjtBQUNBLFNBQU8sSUFBUCxDQUFZLGNBQVo7QUFDQSxTQUFPLEVBQVAsQ0FBVSxpQkFBVixFQUE2QixVQUFDLElBQUQsRUFBUztBQUNyQyxPQUFHLFNBQVMsSUFBWixFQUFrQjtBQUNqQixXQUFRLEVBQVI7QUFDQSxZQUFRLHlCQUFSO0FBQ0E7QUFDRCxPQUFJLGtCQUFrQixJQUFJLEdBQUosQ0FBUTtBQUM3QixnQkFBWSxDQUFDLElBQUQsRUFBTyxHQUFQLENBRGlCO0FBRXZCLFFBQUksZUFGbUI7QUFHdkIsVUFBTTtBQUNMLGVBQVUsSUFETDtBQUVMLFlBQU8sS0FGRjtBQUdMLGVBQVU7QUFITCxLQUhpQjtBQVF2QixhQUFRO0FBQ1AsaUJBQVksb0JBQVMsRUFBVCxFQUFhO0FBQ3hCLFdBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLGdCQUFVLEtBQVYsR0FBa0IsRUFBbEI7QUFDQSxhQUFPLElBQVAsQ0FBWSxzQkFBWixFQUFvQyxFQUFwQztBQUNBO0FBTE07QUFSZSxJQUFSLENBQXRCO0FBZ0JBLEdBckJEO0FBc0JBO0FBQ0QsQ0E3QkQ7a0JBOEJlLFk7Ozs7Ozs7O0FDOUJmLElBQUksZUFBZSxTQUFmLFlBQWUsQ0FBQyxNQUFELEVBQVk7QUFDOUIsS0FBSSxnQkFBZ0IsU0FBUyxjQUFULENBQXdCLGNBQXhCLENBQXBCO0FBQ0EsS0FBRyxhQUFILEVBQWtCO0FBQ2pCLE1BQUksUUFBUSxJQUFaO0FBQ0EsTUFBSSxrQkFBa0IsSUFBSSxHQUFKLENBQVE7QUFDNUIsZUFBWSxDQUFDLElBQUQsRUFBTyxHQUFQLENBRGdCO0FBRXRCLE9BQUksZUFGa0I7QUFHdEIsU0FBTTtBQUNMLGNBQVUsRUFETDtBQUVMLFdBQU87QUFGRjtBQUhnQixHQUFSLENBQXRCO0FBUUEsU0FBTyxFQUFQLENBQVUsaUJBQVYsRUFBNkIsVUFBQyxJQUFELEVBQVM7QUFDckMsT0FBRyxTQUFTLElBQVosRUFBa0I7QUFDakIsV0FBUSxFQUFSO0FBQ0EsWUFBUSx5QkFBUjtBQUNBO0FBQ0QsbUJBQWdCLFFBQWhCLEdBQTJCLElBQTNCO0FBQ0EsbUJBQWdCLEtBQWhCLEdBQXdCLEtBQXhCO0FBQ0EsR0FQRDtBQVFBO0FBQ0QsQ0FyQkQ7a0JBc0JlLFk7Ozs7Ozs7O0FDdEJmLElBQUksZUFBZSxTQUFmLFlBQWUsQ0FBQyxNQUFELEVBQVk7QUFDOUIsS0FBSSxnQkFBZ0IsU0FBUyxjQUFULENBQXdCLGNBQXhCLENBQXBCO0FBQ0EsS0FBRyxhQUFILEVBQWtCO0FBQ2pCLE1BQUksUUFBUSxJQUFaO0FBQ0EsU0FBTyxFQUFQLENBQVUsaUJBQVYsRUFBNkIsVUFBQyxJQUFELEVBQVM7QUFDckMsT0FBRyxTQUFTLElBQVosRUFBa0I7QUFDakIsV0FBUSxFQUFSO0FBQ0EsWUFBUSxxQkFBUjtBQUNBO0FBQ0QsT0FBSSxTQUFKLENBQWMsT0FBZCxFQUF1QjtBQUNyQixjQUFVLGlCQURXO0FBRXJCO0FBQ0EsV0FBTyxDQUFDLE1BQUQsQ0FIYztBQUlyQixVQUFNLGdCQUFXO0FBQ2YsWUFBTztBQUNMLHFCQUFlO0FBRFYsTUFBUDtBQUdELEtBUm9CO0FBU3JCLFdBQU87QUFDTCxzQkFBaUIseUJBQVc7QUFDMUI7QUFDQTtBQUNBLFVBQUksQ0FBQyxLQUFLLGFBQVYsRUFBeUI7QUFBQyxZQUFLLEtBQUwsQ0FBVyxPQUFYLEVBQW9CLEtBQUssYUFBekI7QUFBeUM7QUFFcEU7QUFOSSxLQVRjO0FBaUJyQixhQUFTLG1CQUFXO0FBQ2xCO0FBQ0EsVUFBSyxhQUFMLEdBQXFCLEtBQUssSUFBMUI7QUFDRDtBQXBCb0IsSUFBdkI7O0FBd0JBLE9BQUksa0JBQWtCLElBQUksR0FBSixDQUFRO0FBQzdCLGdCQUFZLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FEaUI7QUFFdkIsUUFBSSxlQUZtQjtBQUd2QixVQUFNO0FBQ0wsZUFBVSxJQURMO0FBRUwsWUFBTSxLQUZEO0FBR0wsZ0JBQVc7QUFITixLQUhpQjtBQVF2QixhQUFTO0FBQ1IsaUJBQVksc0JBQVc7QUFDdEIsc0JBQWdCLFNBQWhCLEdBQTRCLEtBQTVCO0FBQ0E7QUFITztBQVJjLElBQVIsQ0FBdEI7QUFjQSxHQTNDRDtBQTRDQTtBQUNELENBakREO2tCQWtEZSxZOzs7Ozs7OztBQ2xEZixJQUFJLFlBQVksU0FBWixTQUFZLENBQUMsTUFBRCxFQUFZO0FBQzNCLEtBQUksYUFBYSxTQUFTLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBakI7QUFDQSxLQUFHLFVBQUgsRUFBZTtBQUNkLE1BQUksUUFBUSxJQUFaO0FBQ0EsU0FBTyxJQUFQLENBQVksV0FBWjtBQUNBLFNBQU8sRUFBUCxDQUFVLGNBQVYsRUFBMEIsVUFBQyxJQUFELEVBQVM7QUFDbEMsT0FBRyxTQUFTLElBQVosRUFBa0I7QUFDakIsV0FBUSxFQUFSO0FBQ0EsWUFBUSxzQkFBUjtBQUNBO0FBQ0QsT0FBSSxlQUFlLElBQUksR0FBSixDQUFRO0FBQzFCLGdCQUFZLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FEYztBQUVwQixRQUFJLFlBRmdCO0FBR3BCLFVBQU07QUFDTCxZQUFPLElBREY7QUFFTCxZQUFPO0FBRkY7QUFIYyxJQUFSLENBQW5CO0FBUUEsR0FiRDtBQWNBO0FBQ0QsQ0FwQkQ7a0JBcUJlLFM7Ozs7Ozs7O0FDckJmLElBQUksU0FBUyxTQUFULE1BQVMsQ0FBQyxNQUFELEVBQVk7QUFDeEIsS0FBSSxjQUFjLFNBQVMsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkMsS0FBN0Q7QUFDQSxLQUFJLFVBQVUsU0FBUyxjQUFULENBQXdCLFlBQXhCLENBQWQ7QUFDQSxLQUFHLE9BQUgsRUFBWTtBQUNYLE1BQUksVUFBVSxTQUFTLHNCQUFULENBQWdDLE1BQWhDLEVBQXdDLENBQXhDLENBQWQ7QUFDQSxNQUFJLFNBQVUsU0FBUyxjQUFULENBQXdCLGNBQXhCLENBQWQ7QUFDQSxNQUFJLFlBQVksSUFBSSxHQUFKLENBQVE7QUFDdkIsZUFBWSxDQUFDLElBQUQsRUFBTyxHQUFQLENBRFc7QUFFakIsT0FBSSxhQUZhO0FBR2pCLFNBQU07QUFDTCxpQkFBYTtBQURSLElBSFc7QUFNakIsWUFBUTtBQU5TLEdBQVIsQ0FBaEI7QUFTQTtBQUNELENBaEJEO2tCQWlCZSxNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB1c2VyTGlzdCBcdGZyb20gJy4vdmlld3MvY2hhdC9saXN0VXNlcnMuanMnXG5pbXBvcnQgcHJpdmF0ZXNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0UHJpdmF0ZXMuanMnXG5pbXBvcnQgbWVzc2FnZXNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0TWVzc2FnZXMuanMnXG5pbXBvcnQgY2hhbm5lbHNMaXN0IGZyb20gJy4vdmlld3MvY2hhdC9saXN0Q2hhbm5lbHMuanMnXG5pbXBvcnQgY2hhdGJveCBcdFx0ZnJvbSAnLi92aWV3cy9jaGF0L2NoYXRib3guanMnXG5pbXBvcnQgbG9hZGVyIFx0XHRmcm9tICcuL3ZpZXdzL2NoYXQvbG9hZGVyLmpzJ1xuXG5cbmNsYXNzIEFwcCB7XG5cblx0aW5pdCgpIHtcblx0XHRWdWUuY29uZmlnLmRlbGltaXRlcnMgPSBbJyR7JywgJ30nXVxuXHRcdGxldCBzb2NrZXQgPSBpbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKyc6MzAwMCcpXG5cdFx0dXNlckxpc3Qoc29ja2V0KVxuXHRcdG1lc3NhZ2VzTGlzdChzb2NrZXQpXG5cdFx0cHJpdmF0ZXNMaXN0KHNvY2tldClcblx0XHRjaGFubmVsc0xpc3Qoc29ja2V0KVxuXHRcdGNoYXRib3goc29ja2V0KVxuXHRcdGxvYWRlcihzb2NrZXQpXG5cdH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKGV2ZW50KSAgPT57XG4gIGxldCBhcHAgPSBuZXcgQXBwXG4gIGFwcC5pbml0KClcbn0pXG5cbiIsImxldCBjaGF0Ym94ID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgJGNoYXRib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VjdGlvbi1pbnB1dCcpXG5cdGlmKCRjaGF0Ym94KSB7XG5cdFx0bGV0ICRzdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZW5kJylbMF1cblx0XHRsZXQgJGlucHV0ICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZW5kLW1lc3NhZ2UnKVxuXHRcdGxldCB2dWVjaGF0Ym94ID0gbmV3IFZ1ZSh7XG5cdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0ICAgICAgICBlbDogJyNzZWN0aW9uLWlucHV0Jyxcblx0ICAgICAgICBkYXRhOiB7XG5cdCAgICAgICAgXHRtZXNzYWdlOiAnJyxcblx0ICAgICAgICBcdGN1cnJlbnRDaGFuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJykudmFsdWVcblx0ICAgICAgICB9LFxuXHQgICAgICAgIG1ldGhvZHM6e1xuXHQgICAgICAgIFx0c2VuZDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgXHRcdCRpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXQnKVxuXHRcdFx0ICAgIFx0Ly8gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgbWVzc2FnZSBpcyBlbXB0eSBvciBub3Rcblx0XHRcdCAgICBcdGlmICh0aGlzLm1lc3NhZ2UgJiYgdGhpcy5tZXNzYWdlICE9ICcnKSB7XG5cdFx0XHQgICAgXHRcdHRoaXMuY3VycmVudENoYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJykudmFsdWVcblx0XHRcdCAgICBcdFx0Ly8gQ3JlYXRpbmcgYSBuZXggbWVzc2FnZVxuXHRcdCAgICBcdFx0ICBcdC8vIHJlaW5pdGlhbGlzZSB0aGUgaW5wdXQgYW5kIGJsdXIgaXRcblx0XHQgICAgICAgIFx0XHRsZXQgbWVzc2FnZSA9IHtcblx0XHQgICAgICAgIFx0XHRcdGNvbnRlbnQ6IHRoaXMubWVzc2FnZSxcblx0XHQgICAgICAgIFx0XHRcdGlkX3VzZXI6IDEsXG5cdFx0ICAgICAgICBcdFx0XHRpZF9jaGFubmVsOiB0aGlzLmN1cnJlbnRDaGFuLFxuXHRcdCAgICAgICAgXHRcdH1cblxuXHRcdCAgICAgICAgXHRcdHNvY2tldC5lbWl0KCdzZW5kX21lc3NhZ2UnLCBtZXNzYWdlKVxuXHRcdCAgICAgICAgXHRcdHRoaXMubWVzc2FnZSA9ICcnXG5cdFx0ICAgICAgICBcdH1cblx0ICAgICAgICBcdH1cblx0ICAgICAgICB9XG5cdCAgICB9KVxuXG5cdCAgICBzb2NrZXQub24oJ3N1Y2Nlc3Nfc2VuZF9tZXNzYWdlJywgKCkgPT4ge1xuXHQgICAgXHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxfbWVzc2FnZXMnLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJykudmFsdWUpXG5cdCAgICB9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBjaGF0Ym94IiwibGV0IGxpc3RDaGFubmVscyA9IChzb2NrZXQpID0+IHtcblx0bGV0ICRsaXN0Q2hhbm5lbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdENoYW5uZWxzJylcblx0aWYoJGxpc3RDaGFubmVscykge1xuXHRcdGxldCBlcnJvciA9IG51bGxcblx0XHRsZXQgJHNlbGVjdGVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkQ2hhbm5lbCcpXG5cdFx0c29ja2V0LmVtaXQoJ2dldF9jaGFubmVscycpXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fY2hhbm5lbHMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gY2hhbm5lbCB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0bGV0IHZ1ZUxpc3RDaGFubmVscyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RDaGFubmVscycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdGNoYW5uZWxzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjogZXJyb3IsXG5cdFx0ICAgICAgICBcdHNlbGVjdGVkOiBudWxsXG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgbWV0aG9kczp7XG5cdFx0ICAgICAgICBcdHNlbGVjdENoYW46IGZ1bmN0aW9uKGlkKSB7XG5cdFx0ICAgICAgICBcdFx0dGhpcy5zZWxlY3RlZCA9IGlkXG5cdFx0ICAgICAgICBcdFx0JHNlbGVjdGVkLnZhbHVlID0gaWRcblx0XHQgICAgICAgIFx0XHRzb2NrZXQuZW1pdCgnZ2V0X2NoYW5uZWxfbWVzc2FnZXMnLCBpZClcblx0XHQgICAgICAgIFx0fVxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KVxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RDaGFubmVscyIsImxldCBsaXN0TWVzc2FnZXMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdE1lc3NhZ2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RNZXNzYWdlcycpXG5cdGlmKCRsaXN0TWVzc2FnZXMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0bGV0IHZ1ZUxpc3RNZXNzYWdlcyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RNZXNzYWdlcycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdG1lc3NhZ2VzOiBbXSxcblx0XHQgICAgICAgIFx0ZXJyb3I6IG51bGxcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSlcblx0XHRzb2NrZXQub24oJ3JldHVybl9tZXNzYWdlcycsIChkYXRhKT0+IHtcblx0XHRcdGlmKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0ZGF0YSAgPSBbXVxuXHRcdFx0XHRlcnJvciA9ICdBdWN1biBtZXNzYWdlIHRyb3V2w6kuLi4nXG5cdFx0XHR9XG5cdFx0XHR2dWVMaXN0TWVzc2FnZXMubWVzc2FnZXMgPSBkYXRhXG5cdFx0XHR2dWVMaXN0TWVzc2FnZXMuZXJyb3IgPSBlcnJvclxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RNZXNzYWdlcyIsImxldCBsaXN0UHJpdmF0ZXMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdFByaXZhdGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RQcml2YXRlcycpXG5cdGlmKCRsaXN0UHJpdmF0ZXMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fY2hhbm5lbHMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gY2hhbm5lbCBwcml2w6knXG5cdFx0XHR9XG5cdFx0XHRWdWUuY29tcG9uZW50KCdtb2RhbCcsIHtcblx0XHRcdCAgdGVtcGxhdGU6ICcjbW9kYWwtdGVtcGxhdGUnLFxuXHRcdFx0ICAvL1RoZSBjaGlsZCBoYXMgYSBwcm9wIG5hbWVkICd2YWx1ZScuIHYtbW9kZWwgd2lsbCBhdXRvbWF0aWNhbGx5IGJpbmQgdG8gdGhpcyBwcm9wXG5cdFx0XHQgIHByb3BzOiBbJ3Nob3cnXSxcblx0XHRcdCAgZGF0YTogZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgcmV0dXJuIHtcblx0XHRcdCAgICAgIGludGVybmFsVmFsdWU6ICcnXG5cdFx0XHQgICAgfVxuXHRcdFx0ICB9LFxuXHRcdFx0ICB3YXRjaDoge1xuXHRcdFx0ICAgICdpbnRlcm5hbFZhbHVlJzogZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgICAvLyBXaGVuIHRoZSBpbnRlcm5hbCB2YWx1ZSBjaGFuZ2VzLCB3ZSAkZW1pdCBhbiBldmVudC4gQmVjYXVzZSB0aGlzIGV2ZW50IGlzXG5cdFx0XHQgICAgICAvLyBuYW1lZCAnaW5wdXQnLCB2LW1vZGVsIHdpbGwgYXV0b21hdGljYWxseSB1cGRhdGUgdGhlIHBhcmVudCB2YWx1ZVxuXHRcdFx0ICAgICAgaWYgKCF0aGlzLmludGVybmFsVmFsdWUpIHt0aGlzLiRlbWl0KCdjbG9zZScsIHRoaXMuaW50ZXJuYWxWYWx1ZSk7fVxuXG5cdFx0XHQgICAgfVxuXHRcdFx0ICB9LFxuXHRcdFx0ICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdCAgICAvLyBXZSBpbml0aWFsbHkgc3luYyB0aGUgaW50ZXJuYWxWYWx1ZSB3aXRoIHRoZSB2YWx1ZSBwYXNzZWQgaW4gYnkgdGhlIHBhcmVudFxuXHRcdFx0ICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IHRoaXMuc2hvdztcblx0XHRcdCAgfVxuXHRcdFx0fSlcblxuXG5cdFx0XHRsZXQgdnVlTGlzdFByaXZhdGVzID0gbmV3IFZ1ZSh7XG5cdFx0XHRcdGRlbGltaXRlcnM6IFsnJHsnLCAnfSddLFxuXHRcdCAgICAgICAgZWw6ICcjbGlzdFByaXZhdGVzJyxcblx0XHQgICAgICAgIGRhdGE6IHtcblx0XHQgICAgICAgIFx0cHJpdmF0ZXM6IGRhdGEsXG5cdFx0ICAgICAgICBcdGVycm9yOmVycm9yLFxuXHRcdCAgICAgICAgXHRzaG93TW9kYWw6IGZhbHNlXG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgbWV0aG9kczoge1xuXHQgICAgICAgIFx0XHRjbG9zZU1vZGFsOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICBcdFx0XHR2dWVMaXN0UHJpdmF0ZXMuc2hvd01vZGFsID0gZmFsc2Vcblx0ICAgICAgICBcdFx0fVxuXHQgICAgICAgIFx0fVxuXHRcdCAgICB9KVxuXHRcdH0pXG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IGxpc3RQcml2YXRlcyIsImxldCBsaXN0VXNlcnMgPSAoc29ja2V0KSA9PiB7XG5cdGxldCAkbGlzdFVzZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RVc2VycycpXG5cdGlmKCRsaXN0VXNlcnMpIHtcblx0XHRsZXQgZXJyb3IgPSBudWxsXG5cdFx0c29ja2V0LmVtaXQoJ2dldF91c2VycycpXG5cdFx0c29ja2V0Lm9uKCdyZXR1cm5fdXNlcnMnLCAoZGF0YSk9PiB7XG5cdFx0XHRpZihkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdGRhdGEgID0gW11cblx0XHRcdFx0ZXJyb3IgPSAnQXVjdW4gdXNlciB0cm91dsOpLi4uJ1xuXHRcdFx0fVxuXHRcdFx0bGV0IHZ1ZUxpc3RVc2VycyA9IG5ldyBWdWUoe1xuXHRcdFx0XHRkZWxpbWl0ZXJzOiBbJyR7JywgJ30nXSxcblx0XHQgICAgICAgIGVsOiAnI2xpc3RVc2VycycsXG5cdFx0ICAgICAgICBkYXRhOiB7XG5cdFx0ICAgICAgICBcdHVzZXJzOiBkYXRhLFxuXHRcdCAgICAgICAgXHRlcnJvcjogZXJyb3Jcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSlcblx0XHR9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsaXN0VXNlcnMiLCJsZXQgbG9hZGVyID0gKHNvY2tldCkgPT4ge1xuXHRsZXQgY3VycmVudENoYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZWRDaGFubmVsJykudmFsdWVcblx0bGV0ICRsb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkxvYWRlcicpXG5cdGlmKCRsb2FkZXIpIHtcblx0XHRsZXQgJHN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbmQnKVswXVxuXHRcdGxldCAkaW5wdXQgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbmQtbWVzc2FnZScpXG5cdFx0bGV0IHZ1ZWxvYWRlciA9IG5ldyBWdWUoe1xuXHRcdFx0ZGVsaW1pdGVyczogWyckeycsICd9J10sXG5cdCAgICAgICAgZWw6ICcjbWFpbkxvYWRlcicsXG5cdCAgICAgICAgZGF0YToge1xuXHQgICAgICAgIFx0Y3VycmVudENoYW46IGN1cnJlbnRDaGFuXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBtZXRob2RzOntcblx0ICAgICAgICB9XG5cdCAgICB9KVxuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBsb2FkZXIiXX0=
