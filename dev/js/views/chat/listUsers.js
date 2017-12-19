let listUsers = (socket) => {
	let $listUsers = document.getElementById('listUsers')
	if($listUsers) {
		let error = null
		socket.emit('get_users', current_user)
		socket.on('return_users', (data)=> {
			if(data === null) {
				data  = []
				error = 'Aucun user trouvé...'
			}
			let vueListUsers = new Vue({
				delimiters: ['${', '}'],
		        el: '#listUsers',
		        data: {
		        	users: data,
		        	error: error
		        }
		    })
		})
	}
}
export default listUsers