import userlist from './views/chat/listUsers.js'


class App {

	init() {
		console.log('init')
		let socket = io(window.location.origin+':3000')
		userlist(socket)
		console.log(userlist)
	}
}

document.addEventListener("DOMContentLoaded", (event)  =>{
  let app = new App
  app.init()
})

