import BP 		    from 'body-parser'
import express      from 'express'
import ioBase       from 'socket.io'
import httpBase     from 'http'
import path 	    from 'path'
import request 	    from 'request'
import cookieParser from 'cookie-parser'
import bcrypt       from 'bcrypt'

const app  = express()
const http = httpBase.Server(app)
const io   = ioBase(http)
app.use(cookieParser())




io.on('connection', (socket)=>{
	let currentNamespace = socket.handshake.headers.origin
	currentNamespace = (currentNamespace === 'http://localhost' ? currentNamespace+'/harmony' : currentNamespace )

	socket.on('connect_user', (user) => {
		request(currentNamespace+'/api/user', { json: true }, (err, res, body) => {
			if(err) {
				console.log(err)
				return err
			}
			let error = ""
			let i, index, len, bddUser

			for (index = i = 0, len = res.body.length; i < len; index = ++i) {
				bddUser = res.body[index]
				if(user.username == bddUser.username || user.username == bddUser.email) {
					error = ""
					comparePassword(user.password, bddUser.password, (errPass, passCorrect) => {
						if(errPass) {
							console.log('error decrypting password', errPass)
							return errPass
						}
						if (passCorrect) {
							// User exist and password match
							socket.emit('success_connect', {url:currentNamespace+'/?action=chat', userId:bddUser.id_user })
						} else {
							// User existe but password doest match
							socket.emit('error_connect', "Password wrong.")
						}
					})
				} else {
					if(index+1 === res.body.length) {
						socket.emit('error_connect', "username or email doesn't exist.")
					}
				}
			}
		})
	})

	socket.on('create_user', (user) => {
		request(currentNamespace+'/api/user', { json: true }, (err, res, body) => {
			if(err) {
				console.log(err)
				return err
			}
			let error = ""
			for( let bddUser of res.body ) {
				if(user.username === bddUser.username || user.email === bddUser.email) {
					error = "User or Email already exist."
				}
			}
			if (error == '') {
				cryptPassword(user.password, (cryptErr, hash) => {
					if(cryptErr) {
						console.log('error crypting password', cryptErr)
						return cryptErr
					}
					user.password = hash
					request.post({url:currentNamespace+'/api/user', form:user }, (err,httpResponse,body) => {
						if(err) {
							console.log(err)
							return err
						}
						socket.emit('success_connect', {url:currentNamespace+'/?action=chat', userId:body })
					})
				})
			} else {
				socket.emit('error_connect', error)
			}
		})
	})


	socket.on('get_users', (userId) => {
		request(currentNamespace+'/api/user/'+userId+'/userlist', { json: true }, (err, res, body) => {
			if (err) {
				socket.emit('return_users', {'error': err})
				return console.log(err)
			}
			socket.emit('return_users', res.body)
		})
	})

	socket.on('get_current_user', (userId) => {
		request(currentNamespace+'/api/user/'+userId, { json: true }, (err, res, body) => {
			if (err) {
				socket.emit('error_get_current_user', {'error': err})
				return console.log(err)
			}
			socket.emit('success_get_current_user', res.body)
		})
	})

	socket.on('get_messages', () => {
		request(currentNamespace+'/api/message', { json: true }, (err, res, body) => {
			if (err) {
				io.emit('return_messages', {'error': err})
				return console.log(err)
			}
			socket.emit('return_messages', res.body)
		})
	})

	socket.on('send_message', (message) => {
		request.post({url:currentNamespace+'/api/message', form:message }, (err,httpResponse,body) => {
			if (err) {
				console.log(err)
				return err
			}
			io.emit('success_send_message', message.id_channel)
		})
	})

	socket.on('get_channels', () => {
		request(currentNamespace+'/api/channel', { json: true }, (err, res, body) => {
			if (err) {
				io.emit('return_channels', {'error': err})
				return console.log(err)
			}
			socket.emit('return_channels', res.body)
		})
	})

	socket.on('get_channel_messages', (id) => {
		request(currentNamespace+'/api/channel/'+id+'/messages', { json: true }, (err, res, body) => {
			if (err) {
				io.emit('return_messages', {'error': err})
				return console.log(err)
			}
			socket.emit('return_messages', res.body)
		})
	})

	socket.on('get_privates', (idUser) => {
		request(currentNamespace+'/api/user/' + idUser + '/chanprivate', { json: true }, (err, res, body) => {
			if (err) {
				socket.emit('return_privates', {'error': err})
				return console.log(err)
			}
			socket.emit('return_privates', res.body)
		})
	})

	socket.on('create_channel', (chan) => {
		request.post({url:currentNamespace+'/api/channel', form:chan }, (err,httpResponse,body) => {
			if (err) {
				console.log(err)
				return err
			}
			console.log(httpResponse)
			socket.emit('success_create_channel')
		})
	})

	socket.on('select_chan', (id)=> {
		request(currentNamespace+'/api/channel/'+id, { json: true }, (err, res, body) => {
			if (err) {
				socket.emit('return_messages', {'error': err})
				return console.log(err)
			}
			socket.emit('select_chan', res.body)
		})
	})

	socket.on('send_invite', (users) => {
		request(currentNamespace+'/api/user/'+users.current_user+'/invitesend/'+users.user_to_invite, {json : true}, (err,httpResponse,body) => {
			if (err) {
				console.log(err)
				return err
			}
			console.log(httpResponse)
			io.emit('success_friend_interraction')
		})
	})

	socket.on('accept_invite', (users) => {
		request(currentNamespace+'/api/user/'+users.current_user+'/inviteaccept/'+users.user_initiator, {json : true}, (err,httpResponse,body) => {
			if (err) {
				console.log(err)
				return err
			}
			console.log(httpResponse)
			io.emit('success_friend_interraction')
		})
	})

	socket.on('refuse_invite', (users) => {
		request(currentNamespace+'/api/user/'+users.current_user+'/inviterefuse/'+users.user_initiator, {json : true}, (err,httpResponse,body) => {
			if (err) {
				console.log(err)
				return err
			}
			console.log(httpResponse)
			io.emit('success_friend_interraction')
		})
	})

	socket.on('add_channel_notification', (id) => {
		socket.emit('add_channel_notification', id)
	})

	socket.on('disconnect', ()=>{
		console.log('a user is disconnected')
	})
})

http.listen(3000, () => {console.log('Chat app listening on port 3000!')})






const cryptPassword = (password, callback) =>{
	bcrypt.genSalt(10, (err, salt) => {
		if (err)
			return callback(err)

		bcrypt.hash(password, salt, (err, hash) => {
			return callback(err, hash)
		})
	})
}

const comparePassword = (plainPass, hashword, callback) => {
	bcrypt.compare(plainPass, hashword, (err, isPasswordMatch) => {
		return err == null ?
		callback(null, isPasswordMatch) :
		callback(err)
	})
}