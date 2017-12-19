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

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var http = _http2.default.Server(app);
var io = (0, _socket2.default)(http);
app.use((0, _cookieParser2.default)());

io.on('connection', function (socket) {
	var currentNamespace = socket.handshake.headers.origin;
	currentNamespace = currentNamespace === 'http://localhost' ? currentNamespace + '/harmony' : currentNamespace;

	socket.on('connect_user', function (user) {
		(0, _request2.default)(currentNamespace + '/api/user', { json: true }, function (err, res, body) {
			if (err) {
				console.log(err);
				return err;
			}
			var error = "";

			var _loop = function _loop(bddUser) {
				if (user.name === bddUser.username || user.name === bddUser.email) {
					error = "";
					cryptPassword(user.password, function (cryptErr, hash) {
						if (cryptErr) {
							console.log('error crypting password', cryptErr);
							return cryptErr;
						}
						comparePassword(user.password, bddUser.password, function (errPass, passCorrect) {
							if (errPass) {
								console.log('error decrypting password', errPass);
								return errPass;
							}
							if (passCorrect) {
								// User exist and password match
								//res.cookie('currentUser', JSON.stringify(user), { maxAge: 900000, httpOnly: true })
								res.redirect(currentNamespace + '/?action=chat');
							} else {
								// User existe but password doest match
								error = "Password wrong.";
							}
						});
					});
				} else {
					error = "username or email doesn't exist.";
				}
			};

			for (var bddUser in res.body) {
				_loop(bddUser);
			}

			if (error != '') {
				io.emit('error_connect', error);
			}
		});
	});

	socket.on('create_user', function (user) {
		(0, _request2.default)(currentNamespace + '/api/user', { json: true }, function (err, res, body) {
			if (err) {
				console.log(err);
				return err;
			}
			var error = "";
			for (var bddUser in res.body) {
				if (user.name === bddUser.username || user.email === bddUser.email) {
					error = "User or Email already exist.";
				}
			}
			if (error == '') {
				cryptPassword(user.password, function (cryptErr, hash) {
					if (cryptErr) {
						console.log('error crypting password', cryptErr);
						return cryptErr;
					}
					user.password = hash;
					_request2.default.post({ url: currentNamespace + '/api/user', form: user }, function (err, httpResponse, body) {
						if (err) {
							console.log(err);
							return err;
						}
						//res.cookie('currentUser', JSON.stringify(user), { maxAge: 900000, httpOnly: true })
						//res.redirect(currentNamespace+'/?action=chat')
						httpResponse.redirect(currentNamespace + '/?action=chat');
						console.log(httpResponse.request.uri.href);
					});
				});
			} else {
				io.emit('error_connect', error);
			}
		});
	});

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

var cryptPassword = function cryptPassword(password, callback) {
	_bcrypt2.default.genSalt(10, function (err, salt) {
		if (err) return callback(err);

		_bcrypt2.default.hash(password, salt, function (err, hash) {
			return callback(err, hash);
		});
	});
};

var comparePassword = function comparePassword(plainPass, hashword, callback) {
	_bcrypt2.default.compare(plainPass, hashword, function (err, isPasswordMatch) {
		return err == null ? callback(null, isPasswordMatch) : callback(err);
	});
};