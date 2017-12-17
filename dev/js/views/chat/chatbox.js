let chatbox = (socket) => {
	let $chatbox = document.getElementById('section-input')
	if($chatbox) {
		console.log('erckejhn')
		let $submit = document.getElementsByClassName('send')[0]
		let $message = document.getElementById('send-message')
		let vuechatbox = new Vue({
			delimiters: ['${', '}'],
	        el: '#section-input',
	        data: {
	        	message: ''
	        },
	        methods:{
	        	send: function() {
	        		console.log(document.getElementById('selectedChannel').value)
	        		let message = {
	        			content: this.message,
	        			id_user: 1,
	        			id_channel: document.getElementById('selectedChannel').value,
	        		}
	        		socket.emit('send_message', message)
	        	}
	        }
	    })

	    socket.on('success_send_message', () => {
	    	socket.emit('get_channel_messages', document.getElementById('selectedChannel').value)
	    })

		// let error = null
		// socket.emit('get_channels')
		// socket.on('return_channels', (data)=> {
		// 	if(data === null) {
		// 		data  = []
		// 		error = 'Aucun channel trouvé...'
		// 	}
		// 	let vuechatbox = new Vue({
		// 		delimiters: ['${', '}'],
		//         el: '#chatbox',
		//         data: {
		//         	channels: data,
		//         	error: error,
		//         	selected: null
		//         },
		//         methods:{
		//         	selectChan: function(id) {
		//         		this.selected = id
		//         		socket.emit('get_channel_messages', id)
		//         	}
		//         }
		//     })
		// })
	}
}
export default chatbox