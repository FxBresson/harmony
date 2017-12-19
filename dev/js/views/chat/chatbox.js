let chatbox = (socket) => {
	let $chatbox = document.getElementById('section-input')
	if($chatbox) {
		let idChan = 0
		let vuechatbox = new Vue({
			delimiters: ['${', '}'],
	        el: '#section-input',
	        data: {
	        	message: '',
	        	currentChan: null
	        },
	        methods:{
	        	send: function() {
			    	// Check if the current message is empty or not
			    	if (this.message && this.message != '' && this.currentChan != null) {
			    		// Creating a nex message
		    		  	// reinitialise the input and blur it
		        		let message = {
		        			content: this.message,
		        			id_user: current_user,
		        			id_channel: this.currentChan,
		        		}

		        		socket.emit('send_message', message)
		        		idChan = this.currentChan
		        		this.message = ''
		        	}
	        	}
	        }
	    })

	    socket.on('success_send_message', (id) => {
	    	socket.emit('get_channel_messages',idChan )
	    })

	    socket.on('select_chan', (id) => {
	    	vuechatbox.currentChan = id
	    })

	}
}
export default chatbox