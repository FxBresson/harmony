import BP 		    from 'body-parser'
import express      from 'express'
import ioBase       from 'socket.io'
import httpBase     from 'http'
import path 	    from 'path'

const app  = express()
const http = httpBase.Server(app)
const io   = ioBase(http)

io.on('connection', (socket)=>{
	io.emit('userConnect', Users[lastConnectedUserName])
	socket.on('disconnect', ()=>{
		console.log('a user is disconnected')
	})
	socket.on('chat message', (msg) => {
		let date 	= new Date()
		let message = new MsgModel({content:msg.msg, timetemp:date, sendBy:msg.userId, status: "send" })
		message.save()
	    io.emit('chat message', msg);
	});
})

http.listen(3000, () => {console.log('Chat app listening on port 3000!')})