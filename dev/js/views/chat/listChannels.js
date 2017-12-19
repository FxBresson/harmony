let listChannels = (socket) => {
	let $listChannels = document.getElementById('listChannels')
	if($listChannels) {
		let error = null
		let $selected = document.getElementById('selectedChannel')
		socket.emit('get_channels')
		let vueListChannels = new Vue({
			delimiters: ['${', '}'],
	        el: '#listChannels',
	        data: {
	        	channels: [],
	        	error: null,
	        	selected: null
	        },
	        methods:{
	        	selectChan: function(id) {

	        		socket.emit('select_chan', id)
	        		socket.emit('get_channel_messages', id)
	        	}
	        }
	    })

		socket.on('select_chan', (chan) => {
			let chans = JSON.parse(JSON.stringify(vueListChannels.channels))
			for( let c of chans ){
				if (c.id_channel == chan) {
					c.notification = undefined
				}
			}
			vueListChannels.channels = chans
	    	vueListChannels.selected = chan.id_channel
	    })

	    socket.on('add_channel_notification', (id) => {
	    	let chans = JSON.parse(JSON.stringify(vueListChannels.channels))
	    	for( let chan of chans ){
	    		if (chan.id_channel == id) {
	    			if (chan.notification) {
	    				chan.notification ++
	    			} else {
	    				chan.notification = 1
	    			}
	    		}
	    	}
	    	vueListChannels.channels = chans

	    })
		socket.on('return_channels', (data)=> {
			if(data === null) {
				data  = []
				error = 'Aucun channel trouvé...'
			}
			vueListChannels.channels = data
			vueListChannels.error = error




		})
	}
}
export default listChannels