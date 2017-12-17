import userList 	from './views/chat/listUsers.js'
import privatesList from './views/chat/listPrivates.js'
import messagesList from './views/chat/listMessages.js'
import channelsList from './views/chat/listChannels.js'
import chatbox 		from './views/chat/chatbox.js'
import loader 		from './views/chat/loader.js'


class App {

	init() {
		Vue.config.delimiters = ['${', '}']
		let socket = io(window.location.origin+':3000')
		userList(socket)
		messagesList(socket)
		privatesList(socket)
		channelsList(socket)
		chatbox(socket)
		loader(socket)
	}
}

document.addEventListener("DOMContentLoaded", (event)  =>{
  let app = new App
  app.init()
})

