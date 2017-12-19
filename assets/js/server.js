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
			var i = void 0,
			    index = void 0,
			    len = void 0,
			    bddUser = void 0;

			for (index = i = 0, len = res.body.length; i < len; index = ++i) {
				bddUser = res.body[index];
				if (user.username == bddUser.username || user.username == bddUser.email) {
					error = "";
					comparePassword(user.password, bddUser.password, function (errPass, passCorrect) {
						if (errPass) {
							console.log('error decrypting password', errPass);
							return errPass;
						}
						if (passCorrect) {
							// User exist and password match
							socket.emit('success_connect', { url: currentNamespace + '/?action=chat', userId: bddUser.id_user });
						} else {
							// User existe but password doest match
							socket.emit('error_connect', "Password wrong.");
						}
					});
				} else {
					if (index + 1 === res.body.length) {
						socket.emit('error_connect', "username or email doesn't exist.");
					}
				}
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
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = res.body[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var bddUser = _step.value;

					if (user.username === bddUser.username || user.email === bddUser.email) {
						error = "User or Email already exist.";
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
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
						socket.emit('success_connect', { url: currentNamespace + '/?action=chat', userId: body });
					});
				});
			} else {
				socket.emit('error_connect', error);
			}
		});
	});

	socket.on('get_users', function (userId) {
		(0, _request2.default)(currentNamespace + '/api/user/' + userId + '/userlist', { json: true }, function (err, res, body) {
			if (err) {
				socket.emit('return_users', { 'error': err });
				return console.log(err);
			}
			socket.emit('return_users', res.body);
		});
	});

	socket.on('get_current_user', function (userId) {
		(0, _request2.default)(currentNamespace + '/api/user/' + userId, { json: true }, function (err, res, body) {
			if (err) {
				socket.emit('error_get_current_user', { 'error': err });
				return console.log(err);
			}
			socket.emit('success_get_current_user', res.body);
		});
	});

	socket.on('get_messages', function () {
		(0, _request2.default)(currentNamespace + '/api/message', { json: true }, function (err, res, body) {
			if (err) {
				io.emit('return_messages', { 'error': err });
				return console.log(err);
			}
			socket.emit('return_messages', res.body);
		});
	});

	socket.on('send_message', function (message) {
		_request2.default.post({ url: currentNamespace + '/api/message', form: message }, function (err, httpResponse, body) {
			if (err) {
				console.log(err);
				return err;
			}
			io.emit('success_send_message', message.id_channel);
		});
	});

	socket.on('get_channels', function () {
		(0, _request2.default)(currentNamespace + '/api/channel', { json: true }, function (err, res, body) {
			if (err) {
				io.emit('return_channels', { 'error': err });
				return console.log(err);
			}
			socket.emit('return_channels', res.body);
		});
	});

	socket.on('get_channel_messages', function (id) {
		(0, _request2.default)(currentNamespace + '/api/channel/' + id + '/messages', { json: true }, function (err, res, body) {
			if (err) {
				io.emit('return_messages', { 'error': err });
				return console.log(err);
			}
			socket.emit('return_messages', res.body);
		});
	});

	socket.on('get_privates', function (idUser) {
		(0, _request2.default)(currentNamespace + '/api/user/' + idUser + '/chanprivate', { json: true }, function (err, res, body) {
			if (err) {
				socket.emit('return_privates', { 'error': err });
				return console.log(err);
			}
			socket.emit('return_privates', res.body);
		});
	});

	socket.on('create_channel', function (chan) {
		_request2.default.post({ url: currentNamespace + '/api/channel', form: chan }, function (err, httpResponse, body) {
			if (err) {
				console.log(err);
				return err;
			}
			console.log(httpResponse);
			socket.emit('success_create_channel');
		});
	});

	socket.on('select_chan', function (id) {
		(0, _request2.default)(currentNamespace + '/api/channel/' + id, { json: true }, function (err, res, body) {
			if (err) {
				socket.emit('return_messages', { 'error': err });
				return console.log(err);
			}
			socket.emit('select_chan', res.body);
		});
	});

	socket.on('send_invite', function (users) {
		(0, _request2.default)(currentNamespace + '/api/user/' + users.current_user + '/invitesend/' + users.user_to_invite, { json: true }, function (err, httpResponse, body) {
			if (err) {
				console.log(err);
				return err;
			}
			console.log(httpResponse);
			io.emit('success_friend_interraction');
		});
	});

	socket.on('accept_invite', function (users) {
		(0, _request2.default)(currentNamespace + '/api/user/' + users.current_user + '/inviteaccept/' + users.user_initiator, { json: true }, function (err, httpResponse, body) {
			if (err) {
				console.log(err);
				return err;
			}
			console.log(httpResponse);
			io.emit('success_friend_interraction');
		});
	});

	socket.on('refuse_invite', function (users) {
		(0, _request2.default)(currentNamespace + '/api/user/' + users.current_user + '/inviterefuse/' + users.user_initiator, { json: true }, function (err, httpResponse, body) {
			if (err) {
				console.log(err);
				return err;
			}
			console.log(httpResponse);
			io.emit('success_friend_interraction');
		});
	});

	socket.on('add_channel_notification', function (id) {
		socket.emit('add_channel_notification', id);
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