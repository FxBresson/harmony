'use strict';

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var http = _http2.default.Server(app);
var io = (0, _socket2.default)(http);

io.on('connection', function (socket) {
	io.emit('test', 'coucou');

	socket.on('get_users', function (msg) {
		(0, _request2.default)('http://harmony/API/api.php?rquest=users', { json: true }, function (err, res, body) {
			if (err) {
				return console.log(err);
			}
			console.log(res.body);
			io.emit('users', res.body);
		});
	});

	socket.on('disconnect', function () {
		console.log('a user is disconnected');
	});
});

http.listen(3000, function () {
	console.log('Chat app listening on port 3000!');
});