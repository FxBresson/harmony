let listChannels = (socket) => {
	let $listChannels = document.getElementById('listChannels')
	if($listChannels) {
		let error = null
		socket.emit('get_channels')
		socket.on('return_channels', (data)=> {

			if(data === null) {
				data  = []
				error = 'Aucun channel trouvé...'
			}
			let vueListChannels = new Vue({
				delimiters: ['${', '}'],
		        el: '#listChannels',
		        data: {
		        	channels: data,
		        	error: error
		        }
		    })
		})
	}
}
export default listChannels