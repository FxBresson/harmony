import userList 	from './views/chat/listUsers.js'
import privatesList from './views/chat/listPrivates.js'
import messagesList from './views/chat/listMessages.js'
import channelsList from './views/chat/listChannels.js'
import chatbox 		from './views/chat/chatbox.js'
import loader 		from './views/chat/loader.js'
import profil 		from './views/chat/profile.js'
import header 		from './views/chat/headerChat.js'



import Cookie       from 'js-cookie'


import signin       from './views/signin.js'


class App {

	constructor() {
	    this.socket = io(window.location.origin+':3000')
	}

	initChat() {
		if(Cookie.get('current_user') === undefined){document.location.href = window.location.origin}
		window.current_user = Cookie.get('current_user')
		userList(this.socket)
		messagesList(this.socket)
		privatesList(this.socket)
		channelsList(this.socket)
		chatbox(this.socket)
		loader(this.socket)
		profil(this.socket)
		header(this.socket)
	}

	initSignin() {
		signin(this.socket)
	}
}

document.addEventListener("DOMContentLoaded", (event)  =>{
  	let app = new App
  	let $body = document.getElementsByTagName('body')[0]
  	if ( $body.classList.contains('signin') ) {
  		if (Cookie.get('current_user')) {
  			document.location.href = window.location.origin+'/?action=chat'
  		} else  {
  			app.initSignin()
  		}

  	} else if ($body.classList.contains('chat')) {
  		app.initChat()
  	}

})

