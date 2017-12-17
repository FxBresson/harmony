let listMessages = (socket) => {
	let $listMessages = document.getElementById('listMessages')
	if($listMessages) {
		let error = null
		//socket.emit('get_messages')
		let vueListMessages = new Vue({
				delimiters: ['${', '}'],
		        el: '#listMessages',
		        data: {
		        	messages: [],
		        	error: null
		        }
		    })
		socket.on('return_messages', (data)=> {
			console.log('return_messages', data)
			if(data === null) {
				data  = []
				error = 'Aucun message trouvé...'
			}
			vueListMessages.messages = data
			vueListMessages.error = error
		})
	}
}
export default listMessages