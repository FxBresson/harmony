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
	var currentNamespace = socket.handshake.headers.origin;
	currentNamespace = currentNamespace === 'http://localhost' ? currentNamespace + '/harmony' : currentNamespace;
	socket.on('get_users', function () {
		(0, _request2.default)(currentNamespace + '/api/user', { json: true }, function (err, res, body) {
			if (err) {
				io.emit('return_users', { 'error': err });
				return console.log(err);
			}
			io.emit('return_users', res.body);
		});
	});

	socket.on('get_messages', function () {
		(0, _request2.default)(currentNamespace + '/api/message', { json: true }, function (err, res, body) {
			if (err) {
				io.emit('return_messages', { 'error': err });
				return console.log(err);
			}
			io.emit('return_messages', res.body);
		});
	});

	socket.on('send_message', function (message) {
		_request2.default.post({ url: currentNamespace + '/api/message', form: message }, function (err, httpResponse, body) {
			if (err) {
				console.log(err);
				return err;
			}
			io.emit('success_send_message');
		});
	});

	socket.on('get_channels', function () {
		(0, _request2.default)(currentNamespace + '/api/channel', { json: true }, function (err, res, body) {
			if (err) {
				io.emit('return_channels', { 'error': err });
				return console.log(err);
			}
			io.emit('return_channels', res.body);
		});
	});

	socket.on('get_channel_messages', function (id) {
		(0, _request2.default)(currentNamespace + '/api/channel/' + id + '/messages', { json: true }, function (err, res, body) {
			if (err) {
				io.emit('return_messages', { 'error': err });
				return console.log(err);
			}
			io.emit('return_messages', res.body);
		});
	});

	socket.on('get_privates', function (idUser) {
		(0, _request2.default)(currentNamespace + '/api/user/' + idUser + '/chanprivate', { json: true }, function (err, res, body) {
			if (err) {
				io.emit('return_privates', { 'error': err });
				return console.log(err);
			}
			io.emit('return_privates', res.body);
		});
	});

	socket.on('create_channel', function (chan) {
		_request2.default.post({ url: currentNamespace + '/api/channel', form: chan }, function (err, httpResponse, body) {
			if (err) {
				console.log(err);
				return err;
			}
			console.log(httpResponse);
			io.emit('success_create_channel');
		});
	});

	socket.on('disconnect', function () {
		console.log('a user is disconnected');
	});
});

http.listen(3000, function () {
	console.log('Chat app listening on port 3000!');
});