import BP 		    from 'body-parser'
import express      from 'express'
import ioBase       from 'socket.io'
import httpBase     from 'http'
import path 	    from 'path'
import request 	    from 'request'

const app  = express()
const http = httpBase.Server(app)
const io   = ioBase(http)




io.on('connection', (socket)=>{
	let currentNamespace = socket.handshake.headers.origin
	currentNamespace = (currentNamespace === 'http://localhost' ? currentNamespace+'/harmony' : currentNamespace )
	socket.on('get_users', () => {
		request(currentNamespace+'/api/user', { json: true }, (err, res, body) => {
		  	if (err) {
		  		io.emit('return_users', {'error': err})
		  		return console.log(err)
		  	}
			io.emit('return_users', res.body)
		})
	})

	socket.on('get_messages', () => {
		request(currentNamespace+'/api/message', { json: true }, (err, res, body) => {
		  	if (err) {
		  		io.emit('return_messages', {'error': err})
		  		return console.log(err)
		  	}
			io.emit('return_messages', res.body)
		})
	})

	socket.on('send_message', (message) => {
		request.post({url:currentNamespace+'/api/message', form:message }, (err,httpResponse,body) => {
			if (err) {
				console.log(err)
				return err
			}
			io.emit('success_send_message')
		})
	})

	socket.on('get_channels', () => {
		request(currentNamespace+'/api/channel', { json: true }, (err, res, body) => {
		  	if (err) {
		  		io.emit('return_channels', {'error': err})
		  		return console.log(err)
		  	}
			io.emit('return_channels', res.body)
		})
	})

	socket.on('get_channel_messages', (id) => {
		request(currentNamespace+'/api/channel/'+id+'/messages', { json: true }, (err, res, body) => {
		  	if (err) {
		  		io.emit('return_messages', {'error': err})
		  		return console.log(err)
		  	}
			io.emit('return_messages', res.body)
		})
	})

	socket.on('get_privates', (idUser) => {
		request(currentNamespace+'/api/user/' + idUser + '/chanprivate', { json: true }, (err, res, body) => {
		  	if (err) {
		  		io.emit('return_privates', {'error': err})
		  		return console.log(err)
		  	}
			io.emit('return_privates', res.body)
		})
	})

	socket.on('create_channel', (chan) => {
		request.post({url:currentNamespace+'/api/channel', form:chan }, (err,httpResponse,body) => {
			if (err) {
				console.log(err)
				return err
			}
			console.log(httpResponse)
			io.emit('success_create_channel')
		})
	})

	socket.on('disconnect', ()=>{
		console.log('a user is disconnected')
	})
})

http.listen(3000, () => {console.log('Chat app listening on port 3000!')})