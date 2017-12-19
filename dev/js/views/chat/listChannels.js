let listChannels = (socket) => {
	let $listChannels = document.getElementById('listChannels')
	if($listChannels) {
		let error = null
		let $selected = document.getElementById('selectedChannel')
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
		        		socket.emit('select_chan', id)
		        		console.log('emit select_chan')
		        		socket.emit('get_channel_messages', id)
		        	}
		        }
		    })

		    socket.on('select_chan', (id) => {
		    	console.log('on_select_chan_chan', id)
		    	vueListChannels.selected = id
		    })
		})
	}
}
export default listChannels