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
	socket.on('get_users', () => {
		request('http://harmony/api/user', { json: true }, (err, res, body) => {
		  	if (err) {
		  		io.emit('return_users', {'error': err})
		  		return console.log(err)
		  	}
			io.emit('return_users', res.body)
		})
	})

	socket.on('get_messages', () => {
		request('http://harmony/api/message', { json: true }, (err, res, body) => {
		  	if (err) {
		  		io.emit('return_messages', {'error': err})
		  		return console.log(err)
		  	}
			io.emit('return_messages', res.body)
		})
	})

	socket.on('get_channels', () => {
		request('http://harmony/api/channel', { json: true }, (err, res, body) => {
		  	if (err) {
		  		io.emit('return_channels', {'error': err})
		  		return console.log(err)
		  	}
			io.emit('return_channels', res.body)
		})
	})

	socket.on('get_privates', () => {
		request('http://harmony/api/private', { json: true }, (err, res, body) => {
		  	if (err) {
		  		io.emit('return_privates', {'error': err})
		  		return console.log(err)
		  	}
			io.emit('return_privates', res.body)
		})
	})

	socket.on('disconnect', ()=>{
		console.log('a user is disconnected')
	})
})

http.listen(3000, () => {console.log('Chat app listening on port 3000!')})