let listChannels = (socket) => {
	let $listChannels = document.getElementById('listChannels')
	if($listChannels) {
		let error = null
		socket.emit('get_channels')
		socket.on('return_channels', (data)=> {
			console.log(data)
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
		        		console.log(this)
		        		this.selected = id
		        	}
		        }
		    })
		})
	}
}
export default listChannels