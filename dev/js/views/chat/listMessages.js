let listMessages = (socket) => {
	let $listMessages = document.getElementById('listMessages')
	if($listMessages) {
		let error = null
		socket.emit('get_messages')
		socket.on('return_messages', (data)=> {

			if(data === null) {
				data  = []
				error = 'Aucun message trouvé...'
			}
			let vueListMessages = new Vue({
				delimiters: ['${', '}'],
		        el: '#listMessages',
		        data: {
		        	messages: data,
		        	error: error
		        }
		    })
		})
	}
}
export default listMessages