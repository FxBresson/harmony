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
		        	error: error,
		        	selected: null
		        },
		        methods:{
		        	selectChan: function(id) {
		        		this.selected = id
		        		socket.emit('get_channel_messages', id)
		        	}
		        }
		    })
		})
	}
}
export default listChannels