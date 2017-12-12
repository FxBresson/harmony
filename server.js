import BP 		    from 'body-parser'
import express      from 'express'
import ioBase       from 'socket.io'
import httpBase     from 'http'
import path 	    from 'path'

const app  = express()
const http = httpBase.Server(app)
const io   = ioBase(http)




io.on('connection', (socket)=>{
	io.emit('test', 'coucou')

	socket.on('test', (msg)=> {
		console.log(msg)
	})

	socket.on('disconnect', ()=>{
		console.log('a user is disconnected')
	})
})

http.listen(3000, () => {console.log('Chat app listening on port 3000!')})