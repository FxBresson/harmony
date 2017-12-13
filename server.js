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
	io.emit('test', 'coucou')

	socket.on('get_users', (msg)=> {
		request('http://harmony/API/api.php?rquest=users', { json: true }, (err, res, body) => {
		  	if (err) { return console.log(err) }
		  	console.log(res.body)
			io.emit('users', res.body)
		})
	})

	socket.on('disconnect', ()=>{
		console.log('a user is disconnected')
	})
})

http.listen(3000, () => {console.log('Chat app listening on port 3000!')})