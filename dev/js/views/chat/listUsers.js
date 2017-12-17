let listUsers = (socket) => {
	let $listUsers = document.getElementById('listUsers')
	if($listUsers) {
		socket.emit('get_users')
		socket.on('users', (data)=> {
			let vueListUsers = new Vue({
		        el: '#listUsers',
		        data: {
		        	users: data
		        }
		    })
		    console.log(vueListUsers)

		})
	}
}
export default listUsers