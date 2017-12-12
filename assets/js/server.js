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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var http = _http2.default.Server(app);
var io = (0, _socket2.default)(http);

io.on('connection', function (socket) {
	io.emit('userConnect', Users[lastConnectedUserName]);
	socket.on('disconnect', function () {
		console.log('a user is disconnected');
	});
	socket.on('chat message', function (msg) {
		var date = new Date();
		var message = new MsgModel({ content: msg.msg, timetemp: date, sendBy: msg.userId, status: "send" });
		message.save();
		io.emit('chat message', msg);
	});
});

http.listen(3000, function () {
	console.log('Chat app listening on port 3000!');
});