let listPrivates = (socket) => {
	let $listPrivates = document.getElementById('listPrivates')
	if($listPrivates) {
		let error = null
		socket.emit('get_privates')
		socket.on('return_privates', (data)=> {
			if(data === null) {
				data  = []
				error = 'Aucun channel privé'
			}
			let vueListPrivates = new Vue({
				delimiters: ['${', '}'],
		        el: '#listPrivates',
		        data: {
		        	privates: data,
		        	error:error
		        }
		    })
		})
	}
}
export default listPrivates